const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.route('/users')
    .get(controller.listUsers);

router.route('/users/:id')
    .get(controller.getUser);

router.route('/users/me/password')
    .put(controller.updatePassword);
    
router.route('/users/me/imageUrl')
    .put(controller.updateImage);

router.route('/users/me/delete')
    .delete(controller.deleteAccount);

router.route('/auth/refresh')
    .post(controller.refreshToken);
    
router.route('/auth/logout')
    .post(controller.logoutUser);

module.exports = router;
