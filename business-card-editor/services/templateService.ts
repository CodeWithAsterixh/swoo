import Template from '../models/Template';

const listTemplates = async () => {
  return await Template.find().lean().exec();
};

export default {
  listTemplates,
};
