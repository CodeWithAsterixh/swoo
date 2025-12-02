/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../../business-card-editor/lib/db';
import projectService from '../../../business-card-editor/services/projectService';
import { authenticateToken, JWTPayload } from '../../../business-card-editor/lib/jwt';

// Verify authentication helper
async function verifyAuth(req: NextRequest): Promise<{ user: JWTPayload | null; response: NextResponse | null }> {
  const authHeader = req.headers.get('authorization');
  // Try to read token from Authorization header first, then cookies
  const cookieToken = req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || null;
  console.log('[projects/route] Authorization header:', authHeader, 'cookie present:', !!cookieToken);

  // Build a token input for authenticateToken: prefer header (which includes 'Bearer ...'), otherwise construct one from cookie
  const tokenInput = authHeader || (cookieToken ? `Bearer ${cookieToken}` : '');
  const user = authenticateToken(tokenInput || '');

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized: Please log in to access projects' },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
}

export async function GET(req: NextRequest) {
  const { user, response } = await verifyAuth(req);
  if (response) return response;

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDb();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const project = await projectService.getProjectById(id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // Ensure user owns this project
    if (project.userId && project.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this project' }, { status: 403 });
    }
    
    return NextResponse.json(project);
  }

  // List only user's projects
  const projects = await projectService.listProjects(user.userId);
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  // Parse payload first so we can decide whether auth is required
  const payload = await req.json();
  const saveMode = payload?.saveMode as 'remote' | 'local' | 'both' | undefined;

  // Require authentication only if client requests a remote save (or both)
  let user = null as any;
  if (saveMode === 'remote' || saveMode === 'both') {
    const auth = await verifyAuth(req);
    if (auth.response) return auth.response;
    console.log('[projects/route.POST] Authenticated user:', auth.user);
    user = auth.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  type Step = { id: string; title: string; status: 'pending' | 'running' | 'success' | 'error'; message?: string };

  const steps: Step[] = [];

  // Step 1: Validate payload
  steps.push({ id: 'validate', title: 'Validate payload', status: 'running' });
  if (!payload || typeof payload !== 'object') {
    steps.push({ id: 'validate', title: 'Validate payload', status: 'error', message: 'Missing or invalid payload' });
    return NextResponse.json({ steps, error: 'Missing or invalid payload', choices: ['remote', 'local', 'both'] }, { status: 400 });
  }
  steps[steps.length - 1].status = 'success';

  // If client didn't indicate save preference, return choices so caller can decide.
  if (!saveMode) {
    steps.push({ id: 'choose', title: 'Choose save destination', status: 'pending', message: 'No saveMode provided. Choose `remote`, `local`, or `both`.' });
    return NextResponse.json({ steps, choices: ['remote', 'local', 'both'], note: 'Include `saveMode` in the request body to proceed.' });
  }

  const result: any = { remote: null, local: null };

  // Step 2: Connect to DB (if remote save requested)
  if (saveMode === 'remote' || saveMode === 'both') {
    steps.push({ id: 'connect-db', title: 'Connect to database', status: 'running' });
    try {
      await connectDb();
      steps[steps.length - 1].status = 'success';
    } catch (err: any) {
      steps[steps.length - 1].status = 'error';
      steps[steps.length - 1].message = String(err?.message || err);
      // If DB connection failed and client wanted remote-only, return error and suggest local save.
      if (saveMode === 'remote') {
        return NextResponse.json({ steps, error: 'Failed to connect to DB', suggestion: 'You can retry or save locally by using saveMode: "local".' }, { status: 503 });
      }
    }
  }

  // Step 3: Save remotely if requested and DB connected
  if ((saveMode === 'remote' || saveMode === 'both') && steps.find(s => s.id === 'connect-db' ? s.status === 'success' : true)) {
    steps.push({ id: 'save-remote', title: 'Save project (remote)', status: 'running' });
    try {
      // Attach userId to the project
      const projectPayload = { ...payload, userId: user.userId };
      const project = await projectService.createProject(projectPayload);
      steps[steps.length - 1].status = 'success';
      steps[steps.length - 1].message = `Saved project with id ${project._id}`;
      result.remote = project;
    } catch (err: any) {
      steps[steps.length - 1].status = 'error';
      steps[steps.length - 1].message = String(err?.message || err);
      // If remote save failed and only remote requested, return error
      if (saveMode === 'remote') {
        return NextResponse.json({ steps, error: 'Failed to save project remotely', suggestion: 'Retry or choose local save.' }, { status: 500 });
      }
    }
  }

  // Step 4: Prepare local save instructions if requested
  if (saveMode === 'local' || saveMode === 'both') {
    steps.push({ id: 'save-local', title: 'Prepare local save', status: 'running' });
    try {
      // The server cannot write to the client's localStorage. Instead, return the
      // project JSON and instructions so the client can persist locally.
      const localPayload = payload.project || result.remote || payload;
      steps[steps.length - 1].status = 'success';
      steps[steps.length - 1].message = 'Client should save the provided project JSON to localStorage under your chosen key.';
      result.local = localPayload;
    } catch (err: any) {
      steps[steps.length - 1].status = 'error';
      steps[steps.length - 1].message = String(err?.message || err);
    }
  }

  // Step 5: Finalize and return structured process + next steps
  steps.push({ id: 'finalize', title: 'Finalize', status: 'success', message: 'Process complete. Follow the recommended actions.' });

  const responseBody = {
    steps,
    result,
    recommended: {
      // If we saved remotely, suggest redirecting to editor with the remote id
      action: result.remote ? 'redirect' : 'open-editor-local',
      url: result.remote ? `/editor/${result.remote._id}` : undefined,
      note: result.remote ? 'Open the editor for the newly-created project.' : 'Save project locally and open editor with local project data.'
    }
  };

  return NextResponse.json(responseBody, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const { user, response } = await verifyAuth(req);
  if (response) return response;

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDb();
  const body = await req.json();
  const { id, data } = body;

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // Verify user owns this project
  const project = await projectService.getProjectById(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  if (project.userId && project.userId.toString() !== user.userId) {
    return NextResponse.json({ error: 'Forbidden: You do not own this project' }, { status: 403 });
  }

  const updated = await projectService.updateProject(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { user, response } = await verifyAuth(req);
  if (response) return response;

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDb();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // Verify user owns this project
  const project = await projectService.getProjectById(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  if (project.userId && project.userId.toString() !== user.userId) {
    return NextResponse.json({ error: 'Forbidden: You do not own this project' }, { status: 403 });
  }

  await projectService.deleteProject(id);
  return new NextResponse(null, { status: 204 });
}
