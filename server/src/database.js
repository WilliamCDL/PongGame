var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      throw err
    }else{
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text UNIQUE, 
            email text UNIQUE, 
            password text,
            CONSTRAINT email_unique UNIQUE (email),
            CONSTRAINT username_unique UNIQUE (username)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (username, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert, ["user","user@example.com",md5("user123456")])
                db.run(insert, ["player1","player1@jogoemredes.com",md5("player1")])
                db.run(insert, ["player2","player2@jogoemredes.com",md5("player2")])
                db.run(insert, ["player3","player3@jogoemredes.com",md5("player3")])
            }
        });  
    }
});


module.exports = db