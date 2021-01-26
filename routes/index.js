const users = require('./userRoute.js');

module.exports = (router) => {
  users(router);
  return router;
};