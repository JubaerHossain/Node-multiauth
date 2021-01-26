
const controller = require('../controllers/userController');
const isAdmin =require('../midleware/isAdmin');
const auth =require('../midleware/auth');
module.exports = (router) => {
  router.route('/register').post(controller.createUser);
  router.route('/login').post(controller.login);
  router.route('/users').get(auth,controller.users);
};