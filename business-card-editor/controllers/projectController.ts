import type { NextApiRequest, NextApiResponse } from 'next';
import projectService from '../services/projectService';

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  const projects = await projectService.listProjects();
  res.status(200).json(projects);
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const project = await projectService.getProjectById(String(id));
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(project);
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body;
  const project = await projectService.createProject(payload);
  res.status(201).json(project);
};

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, data } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const project = await projectService.updateProject(id, data);
  res.status(200).json(project);
};

const remove = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  await projectService.deleteProject(String(id));
  res.status(204).end();
};

const projectController = {
  list,
  get,
  create,
  update,
  remove,
}
export default projectController;
