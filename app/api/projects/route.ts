import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../../business-card-editor/lib/db';
import projectService from '../../../business-card-editor/services/projectService';

export async function GET(req: NextRequest) {
  await connectDb();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (id) {
    const project = await projectService.getProjectById(id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  }
  const projects = await projectService.listProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await connectDb();
  const payload = await req.json();
  const project = await projectService.createProject(payload);
  return NextResponse.json(project, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectDb();
  const body = await req.json();
  const { id, data } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const updated = await projectService.updateProject(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await connectDb();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await projectService.deleteProject(id);
  return new NextResponse(null, { status: 204 });
}
