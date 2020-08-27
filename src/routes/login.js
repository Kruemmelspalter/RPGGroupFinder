const router = require('express').Router();
const db = require("../db/db");
const sha512 = require("js-sha512").sha512;
const conf = require("../../conf.json");
const jwt = require('jsonwebtoken');


router.post('/', (req, res) => {
    var pwd = sha512(req.body.pwd);
    db.query("SELECT * FROM users where name=?", [req.body.usr], (err, result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        if (result == undefined || result.length == 0) {
            res.status(400).json({
                "error": {
                    "user": "nonexistant"
                }
            });
            return;
        }
        if (pwd == result.pwd) {
            console.log("Login successful!");
            // TODO auth
            const token = jwt.sign({
                _id: result["id"]
            }, conf["auth"]["token_secret"]);
            res.header('auth_token', token).send();
        } else {
            res.status(400).json({
                "error": {
                    "password": "wrong"
                }
            });
        }
    });
});


module.exports = router;