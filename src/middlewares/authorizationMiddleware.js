const {validateToken} = require('../services/authorizationService');
const isDebug = process.env.NODE_ENV == 'debug';

exports.authorize = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // Header format is: "Bearer <token>"
    if (isDebug) {
        console.log(`[DEBUG] ${authHeader}`);
    }
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        req.userInfo = validateToken(token);
    } catch (err) {
        console.error(err);
        return res.sendStatus(403);
    }
    next();
};