const projectManagerResolvers = require("./projectManager");
const leadResolvers = require("./teamLead");
const userResolvers = require("./user");
const authResolvers = require("./user");
const teamResolvers = require("./teams");
const memberResolvers = require("./member");
const taskResolvers = require("./task");
const getTaskResolvers = require("./getTask");
const analyticsResolvers = require("./analytics");
const chatResolvers = require("./chat");


const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    ...teamResolvers.Query,
    ...leadResolvers.Query,
    ...userResolvers.Query,
    ...memberResolvers.Query,
    ...taskResolvers.Query,
    ...getTaskResolvers.Query,
    ...analyticsResolvers.Query   ,
    ...chatResolvers.Query 

  },
  Mutation: {
    ...authResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...projectManagerResolvers.Mutation,
    ...leadResolvers.Mutation,
    ...memberResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...chatResolvers.Mutation 


  },
};

module.exports = resolvers;
