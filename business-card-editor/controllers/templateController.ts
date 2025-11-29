import type { NextApiRequest, NextApiResponse } from 'next';
import templateService from '../services/templateService';

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  const templates = await templateService.listTemplates();
  res.status(200).json(templates);
};

export default {
  list,
};
