const router = require('express').Router();
const db = require("../db/db");
const jwt = require('jsonwebtoken');
const auth = require('../auth');
const sha512 = require("js-sha512").sha512;


router.get('/:id', auth((token, params) => {
    return true;
}));
router.get('/:id', (req, res) => {
    db.query("SELECT * FROM users WHERE id=?", [req.params.id.toString()], (err, result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        if (result.length == 0) {
            res.json({
                "error": {
                    "user": "nonexistant"
                }
            });
        } else {
            res.json({
                "name": result.name,
                "loc": {
                    "n": result.loc_n,
                    "e": result.loc_e
                }
            });
        }
    });
});

router.use('/', auth((token, params) => {
    return true;
}));
router.get('/', (req, res) => {
    if (!req.header('radius')) return res.status(400).json({
        "error": {
            "radius": "notspecified"
        }
    });
    var radius = req.header('radius');
    var token = jwt.decode(req.header('auth_token'));
    db.query("SELECT * FROM users WHERE id=?", [token._id], (err, result) => {
        result = JSON.parse(JSON.stringify(result))[0];
        if (result == undefined || result.length == 0) return res.status(400).json({
            "error": {
                "auth": {
                    "id": "invalid"
                }
            }
        });
        var sql_params = [result.loc_n - radius / 100, result.loc_n + radius / 100, result.loc_e - radius / 100, result.loc_e + radius / 100];
        db.query("SELECT * FROM users WHERE loc_n BETWEEN ? AND ? AND loc_e BETWEEN ? AND ?", sql_params, (err, result) => {
            var users = [];
            for (user of result) {
                users.push({
                    "id":user.id,
                    "name": user.name,
                    "loc": {
                        "n": user.loc_n,
                        "e": user.loc_e
                    }
                });
            }
            res.json({
                "users": users
            })
            console.log(result);
        });
    });
});



router.patch('/:id', auth((token, params) => {
    return token._id == params.id;
}));
router.patch('/:id', (req, res) => {
    var usr = req.body.usr;
    var loc = req.body.loc;
    var pwd = req.body.pwd;
    if (!usr && !loc && !pwd) res.status(400).json({
        "error": {
            "data": "doesntchange"
        }
    });
    var successful = [true, true, true];
    if (usr) db.query("UPDATE users SET name=? WHERE id=?;", [usr, req.params.id], (err, result) => {
        successful[0] = !err;
    });
    if (loc) db.query("UPDATE users SET loc_n=?, loc_e=? WHERE id=?;", [loc.n, loc.e, req.params.id], (err, result) => {
        successful[1] = !err;
    });
    if (pwd) db.query("UPDATE users SET pwd=? WHERE id=?;", [sha512(pwd), req.params.id], (err, result) => {
        successful[2] = !err;
    });
    if (!successful.every((i) => {
            return i;
        })) {
        res.status(500).json({
            "error": {
                "db": "something"
            }
        });
        return;
    };
    res.status(204).send();

});

module.exports = router;