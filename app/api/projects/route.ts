/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "../../../business-card-editor/lib/db";
import projectService from "../../../business-card-editor/services/projectService";
import {
  authenticateToken,
  JWTPayload,
} from "../../../business-card-editor/lib/jwt";

// Verify authentication helper
async function verifyAuth(
  req: NextRequest
): Promise<{ user: JWTPayload | null; response: NextResponse | null }> {
  const authHeader = req.headers.get("authorization");
  // Try to read token from Authorization header first, then cookies
  const cookieToken =
    req.cookies.get("auth_token")?.value ||
    req.cookies.get("token")?.value ||
    null;
  console.log(
    "[projects/route] Authorization header:",
    authHeader,
    "cookie present:",
    !!cookieToken
  );

  // Build a token input for authenticateToken: prefer header (which includes 'Bearer ...'), otherwise construct one from cookie
  const tokenInput = authHeader || (cookieToken ? `Bearer ${cookieToken}` : "");
  const user = authenticateToken(tokenInput || "");

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized: Please log in to access projects" },
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const project = await projectService.getProjectById(id);
    if (!project)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Ensure user owns this project
    if (project.userId && project.userId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this project" },
        { status: 403 }
      );
    }

    return NextResponse.json(project);
  }

  // List only user's projects
  const projects = await projectService.listProjects(user.userId);
  return NextResponse.json(projects);
}

// --- Helpers for POST ---
type Step = {
  id: string;
  title: string;
  status: "pending" | "running" | "success" | "error";
  message?: string;
};

const addStep = (
  steps: Step[],
  id: string,
  title: string,
  status: Step["status"] = "running",
  message?: string
) => {
  const step: Step = { id, title, status, message };
  steps.push(step);
  return step;
};

function handleValidation(payload: any, saveMode: any, steps: Step[]) {
  addStep(steps, "validate", "Validate payload");
  const lastStep = steps.at(-1);

  if (!payload || typeof payload !== "object") {
    if (lastStep) {
      lastStep.status = "error";
      lastStep.message = "Missing or invalid payload";
    }

    return NextResponse.json(
      {
        steps,
        error: "Missing or invalid payload",
        choices: ["remote", "local", "both"],
      },
      { status: 400 }
    );
  }
  if (lastStep) {
    lastStep.status = "success";
  }

  if (!saveMode) {
    addStep(
      steps,
      "choose",
      "Choose save destination",
      "pending",
      "No saveMode provided. Choose `remote`, `local`, or `both`."
    );
    return NextResponse.json({
      steps,
      choices: ["remote", "local", "both"],
      note: "Include `saveMode` in the request body to proceed.",
    });
  }
  return null;
}

async function executeRemoteSave(
  payload: any,
  user: any,
  saveMode: string,
  steps: Step[],
  result: any
) {
  const lastStep = steps.at(-1);
  addStep(steps, "connect-db", "Connect to database");
  if (lastStep) {
    lastStep.status = "running";
  }

  try {
    await connectDb();
    if (lastStep) {
      lastStep.status = "success";
    }
  } catch (err: any) {
    if (lastStep) {
      lastStep.status = "error";
      lastStep.message = String(err?.message || err);
    }
    if (saveMode === "remote") {
      return NextResponse.json(
        {
          steps,
          error: "Failed to connect to DB",
          suggestion:
            'You can retry or save locally by using saveMode: "local".',
        },
        { status: 503 }
      );
    }
    return null;
  }
  if (lastStep) {
    lastStep.status = "success";
  }

  addStep(steps, "save-remote", "Save project (remote)");
  try {
    const project = await projectService.createProject({
      ...payload,
      userId: user.userId,
    });
    if (lastStep) {
      lastStep.status = "success";
      lastStep.message = `Saved project with id ${project._id}`;
    }
    result.remote = project;
  } catch (err: any) {
    if (lastStep) {
      lastStep.status = "error";
      lastStep.message = String(err?.message || err);
    }
    if (saveMode === "remote") {
      return NextResponse.json(
        {
          steps,
          error: "Failed to save project remotely",
          suggestion: "Retry or choose local save.",
        },
        { status: 500 }
      );
    }
  }
  return null;
}

function executeLocalSave(payload: any, result: any, steps: Step[]) {
  const lastStep = steps.at(-1);
  addStep(steps, "save-local", "Prepare local save");
  try {
    const localPayload = payload.project || result.remote || payload;
    if (lastStep) {
      lastStep.status = "success";
      lastStep.message =
        "Client should save the provided project JSON to localStorage under your chosen key.";
    }
    result.local = localPayload;
  } catch (err: any) {
    if (lastStep) {
      lastStep.status = "error";
      lastStep.message = String(err?.message || err);
    }
  }
}

function getRecommendation(remoteResult: any) {
  if (remoteResult) {
    return {
      action: "redirect",
      url: `/editor/${remoteResult._id}`,
      note: "Open the editor for the newly-created project.",
    };
  }
  return {
    action: "open-editor-local",
    url: undefined,
    note: "Save project locally and open editor with local project data.",
  };
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const saveMode = payload?.saveMode as "remote" | "local" | "both" | undefined;
  const steps: Step[] = [];
  const result: any = { remote: null, local: null };

  const validationError = handleValidation(payload, saveMode, steps);
  if (validationError) return validationError;

  let user = null as any;
  if (saveMode === "remote" || saveMode === "both") {
    const auth = await verifyAuth(req);
    if (auth.response) return auth.response;
    user = auth.user;
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (saveMode === "remote" || saveMode === "both") {
    const remoteError = await executeRemoteSave(
      payload,
      user,
      saveMode,
      steps,
      result
    );
    if (remoteError) return remoteError;
  }

  if (saveMode === "local" || saveMode === "both") {
    executeLocalSave(payload, result, steps);
  }

  addStep(
    steps,
    "finalize",
    "Finalize",
    "success",
    "Process complete. Follow the recommended actions."
  );

  return NextResponse.json(
    {
      steps,
      result,
      recommended: getRecommendation(result.remote),
    },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const { user, response } = await verifyAuth(req);
  if (response) return response;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const body = await req.json();
  const { id, data } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Verify user owns this project
  const project = await projectService.getProjectById(id);
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (project.userId && project.userId.toString() !== user.userId) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this project" },
      { status: 403 }
    );
  }

  const updated = await projectService.updateProject(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { user, response } = await verifyAuth(req);
  if (response) return response;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Verify user owns this project
  const project = await projectService.getProjectById(id);
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (project.userId && project.userId.toString() !== user.userId) {
    return NextResponse.json(
      { error: "Forbidden: You do not own this project" },
      { status: 403 }
    );
  }

  await projectService.deleteProject(id);
  return new NextResponse(null, { status: 204 });
}
