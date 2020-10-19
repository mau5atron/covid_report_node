"use strict";

/**
 * @param { string }
 * @returns { string }
 */
exports.checkForEmptyProp = ( prop ) => {
  if ( typeof prop == "string" ){
    if ( prop.length == 0 ){
      prop = null;
    } else {
      prop = parseInt(prop);
    }
  }

  return prop;
}