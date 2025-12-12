const {validateToken} = require('../services/authorizationService');

exports.authorize = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    // Header format is: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401);
    }

    try {
        req.user = validateToken(token);
    } catch (err) {
        return res.sendStatus(403);
    }
    
    next();
};