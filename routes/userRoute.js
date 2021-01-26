
const controller = require('../controllers/userController');

module.exports = (router) => {
  router.route('/register')
    .post(controller.createUser);
};