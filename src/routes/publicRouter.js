const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { publicKey } = require('../services/authorizationService');

router.route('/users')
    .post(controller.createUser);

router.route('/auth/login')
    .post(controller.loginUser);
    
router.route('/auth/refresh')
    .post(controller.refreshToken);

router.route('/auth/public-key')
    .get((_, res) => {
        res.send({ publicKey: publicKey });
    });

router.route("/")
    .get((_, res) => {
        res.redirect(301, '/api-docs');
    });

module.exports = router;