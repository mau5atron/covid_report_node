exports.generateKey = () => {
  var tokenLength = 32;
  var result = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for ( var i = 0 ; i < tokenLength ; i++ ){
    result += chars.charAt( Math.floor( Math.random() * chars.length ) );
  }

  return result;
}