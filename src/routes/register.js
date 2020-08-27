const router = require('express').Router();
const db = require("../db/db");
const sha512 = require("js-sha512").sha512;
const conf = require("../../conf.json");


router.post('/', async (req, res) => {
    var usr = req.body.usr;
    db.query("SELECT * FROM users where name=?;", [req.body.usr], (err, result) => {
        if (result.length != 0) {
            res.status(400).json({
                "error": {
                    "user": "exists"
                }
            });
            return;
        }
        var loc = req.body.loc;
        var pwd = sha512(req.body.pwd);
        if (loc) {
            db.query("INSERT INTO users(name,loc_n, loc_e, pwd) VALUES(?, ?, ?, ?);", [usr, loc.n, loc.e, pwd], (err, result) => {
                if (err) res.status(500).json({
                    "error": err
                });
                else res.status(201).send();
            });
        } else {
            db.query("INSERT INTO users(name, pwd) VALUES(?, ?);", [usr, pwd], (err, result) => {
                if (err) res.status(500).json({
                    "error": err
                });
                else res.status(201).send();
            });
        }
    });

});


module.exports = router;