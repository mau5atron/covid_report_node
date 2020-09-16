const test = require("./agree_to_terms.js");

test.testAgreeTerms(undefined)
  .then( res => {
    console.log("first result: ", res);
  }).catch(err => {
    console.log(err);
  });

test.testAgreeTerms("")
  .then( res => {
    console.log("second result: ", res);
  }).catch(err => {
    console.log(err);
  });

test.testAgreeTerms( false )
  .then( res => {
    console.log("third result: ", res);
  })
  .catch( err => {
    console.log(err);
  });

test.agreeTerms( "false" )
  .then( res => {
    console.log("fourth result with string false: ", res);
  })
  .catch( err => {
    console.log(err);
  })

test.testAgreeTerms( true )
  .then( res => {
    console.log("fifth result with bool true: ", res);
  })
  .catch( err => {
    console.log(err);
  });

test.testAgreeTerms( "true" )
  .then( res => {
    console.log("6th result with string true: ", res);
  })
  .catch( err => {
    console.log(err);
  });