const db = require("../../db/database");

module.exports = class Token {
  constructor(token, isValidToken = 1){
    // valid token will be bit ( 1 for true, 0 for false) default is true
    this.token = token;
    this.valid_token = isValidToken;
  }

  saveToken(){
    return db.execute(
      "INSERT INTO tokens (token, valid_token) VALUES (?, ?)",
      [this.token, this.valid_token]
    );
  }

  static validateToken(token){
    return db.execute(
      "SELECT valid_token FROM tokens WHERE token=?",
      [token]
    );
  }
};