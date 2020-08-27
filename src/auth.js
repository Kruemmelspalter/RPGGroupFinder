const jwt = require('jsonwebtoken');
const conf = require("../conf.json");

module.exports = (check) => {
    return (req, res, next) => {
        const token = req.header('auth_token');
        if (!token) return res.status(401).json({
            "error": {
                "auth": "invalid"
            }
        });
        try {
            const verified = jwt.verify(token, conf["auth"]["token_secret"]) && check(jwt.decode(token), req.params);
            if (!verified) return res.status(401).json({
                "error": {
                    "auth": "invalid"
                }
            });
            next();
        } catch (err) {
            console.log(err)
        }
    }
}