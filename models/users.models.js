const db = require("../db/connection");

function fetchUsers() {
  return db.query(`SELECT username, name, avatar_url FROM users;`).then(({ rows }) => {
    return rows;
  });
}

function fetchUserByUsername(username){
    return db.query(`SELECT * from users where username = $1`, [username]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status:404, msg: "Not found" })
        }
        return rows[0]
    })
}


module.exports = { fetchUsers, fetchUserByUsername };
