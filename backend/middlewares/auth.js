const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        let userId;
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
            if (err !== null) {
                throw err;
            }
            userId = decoded.userId;
            console.log("userId:", userId)
        });
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        }
        req.auth = { userId };
        next();
    } catch (error) {
        res.status(JSON.stringify(error).includes('Invalid user ID') ? 403 : 401).json({ error: error })
    }

}