import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../../business-card-editor/lib/db';
import templateService from '../../../business-card-editor/services/templateService';

export async function GET() {
  await connectDb();
  const templates = await templateService.listTemplates();
  return NextResponse.json(templates);
}
