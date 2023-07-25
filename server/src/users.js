const md5 = require("md5");
const db = require("./database");

const createUserInDatabase = (user, res) => {
    var insert = 'INSERT INTO user (username, email, password) VALUES (?,?,?)'
    db.run(insert, [user.username, user.email, md5(user.password)], (err) => {
        if (err) {
            res.status(500).json({ "error": err.message });
        }
        res.status(201).json({
            "message": "success",
            "data": user
        });
    });
}

const createUser = (req, res) => {
    // User logic
    let user = req.body;
    if (!user.username || !user.email || !user.password) {
        res.status(400).json({ "error": "Invalid data" });
        return;
    }

    // Check if user already exists
    var sql = "select * from user where username = ? or email = ?"
    var params = [user.username, user.email]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (row) {
            res.status(400).json({ "error": "User already exists" });
            return;
        }
        createUserInDatabase(user, res);
    });
}

const findUserById = (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
}

const getUsers = (req, res) => {
    var sql = "select * from user ";
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
}



module.exports = { createUser, getUsers, findUserById }

