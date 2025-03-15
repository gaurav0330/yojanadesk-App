const { gql } = require("apollo-server-express");
const projectManagerTypeDefs = require("./projectManager");
const leadTypeDefs = require("./teamLead");
const userTypeDefs = require("./user");
const teamTypeDefs = require("./teams");
const memberTypeDefs = require("./member");
const taskTypeDefs = require("./task");
const analyticsTypeDefs = require("./analytics");
const chatTypeDefs = require("./chat");

const typeDefs = [
  userTypeDefs,
  leadTypeDefs,
  teamTypeDefs,
  memberTypeDefs,
  projectManagerTypeDefs,
  taskTypeDefs,
  analyticsTypeDefs,
  chatTypeDefs
];

module.exports = typeDefs;
