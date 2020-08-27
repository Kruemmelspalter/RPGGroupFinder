const mysql = require('mysql');
const conf = require('../../conf.json')

const conn = mysql.createConnection({
    host: conf["db"]["host"],
    user: conf["db"]["user"],
    password: conf["db"]["password"],
    database: conf["db"]["database"]
});
conn.connect(err => {
    if (err) throw err;
    console.log("Connected to Database");
});

module.exports = conn;