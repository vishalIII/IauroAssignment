const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).send({
                message: 'Auth failed: No token provided',
                success: false
            });
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: 'Auth failed: Invalid token',
                    success: false
                });
            } else {
                req.body.userId = decoded.id;
                next();
            }
        });
    } catch (error) {
        return res.status(401).send({
            message: 'Auth failed',
            success: false
        });
    }
};