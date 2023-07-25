const md5 = require("md5");
const db = require("./database");

const login = (req, res, io) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(400).json({ "error": "Invalid data" });
        return;
    }

    // Check if user exists
    var sql = "select * from user where username = ? and password = ?"
    var params = [username, md5(password)]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!row) {
            res.status(400).json({ "error": "User not found" });
            return;
        }

        const map = io.sockets.sockets
        for (let [key, socket] of map) {
            if(socket.nickname == username){
                res.status(400).json({ "error": "User is already logged in another section." });
                return;
            }
        }

        res.json({
            "message": "success",
            "data": row
        })
    });
}

module.exports = { login }