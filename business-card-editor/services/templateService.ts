import Template from "../models/Template";

const listTemplates = async () => {
  return await Template.find().lean().exec();
};

const templateService = {
  listTemplates,
};
export default templateService;
