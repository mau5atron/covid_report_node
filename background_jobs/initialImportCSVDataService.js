"use strict";
const { workerData, parentPort, isMainThread } = require("worker_threads");
const fs = require("fs");
const csvParser = require("csv-parser");
const process = require("process");
const db = require("../db/database");
const statesHash = require("../data/states_hash.json");

if ( isMainThread ){
  console.log("Not running background process, currently running in main thread");
} else {
  const fileLocation = "./crawler_downloads/all_states.csv";
  var stateArray = new Array;
  // console.log("args: ", process.argv);
  /*
    Instead of trying to pass in arguments ( which are not currently working )
    We can simply check if any states are available via sql count
  */
  fs.createReadStream(fileLocation)
    .on("error", (err) => {
      console.log("Err: ", err);
    })
    .pipe(csvParser())
    .on("data", ( row ) => {
      // header will be displayed as row of objects
      // if ( row["date"] == "2020-09-27"){// import all rows on first run instead of just specufic date
        // console.log("Row: ", row);

        // stateArray.push(row["state"]);
        if ( row["positive"] == "" ){
          row["positive"] = null;
        } else if ( row["recovered"] == "" ){
          row["recovered"] = null;
        } else if ( row["death"] == "" ){
          row["death"] = null;
        }

        stateArray.push({
          state_abbrev: row["state"],
          state_name: statesHash[row["state"]],
          positive: row["positive"],
          recovered: row["recovered"],
          deaths: row["death"],
          date: row["date"]
        });
      // }

      // instead of trying to save latest database
      // lets save all the rows on the first run,
      // then we need to import again we can simply query the latest date available in the database
      // and then just import from futre CV date > than whats available in the database
      /*
        Getting these properties from each row
        state abbreviation
        state name
        positive
        death
        recovered
      */

      // db.execute(
      //   ""
      // );
    })
    .on("end", () => {
      // console.log("state array: ", stateArray);
      var dbResponse = db.execute(
        "SELECT COUNT(*) AS row_count FROM state;"
      );

      dbResponse.then( (row, fieldData) => {
      
        let queryResponse = row[0][0].row_count;
        console.log("query type: ", typeof queryResponse);
        console.log("DB response: ", queryResponse);
        if ( queryResponse == 0 ){ // initial import
          console.log("query returned zero");
          // console.log("state data array: ", stateArray);
          for ( let i = 0 ; i < stateArray.length ; i++ ){
            // console.log("input to save: ", stateArray[i]);
            db.query(
              `
                START TRANSACTION;
                  INSERT INTO
                    state(state_abbrev, state_name)
                  VALUES(?, ?);

                  SET @state_fk = LAST_INSERT_ID();

                  INSERT INTO
                    state_data(positive, recovered, deaths, state_id, date)
                  VALUES (?, ?, ?, LAST_INSERT_ID(), ?);
                COMMIT;
              `, 
              [
                stateArray[i].state_abbrev,
                stateArray[i].state_name,
                stateArray[i].positive,
                stateArray[i].recovered,
                stateArray[i].deaths,
                stateArray[i].date
              ]
            ).then(([row, fieldData]) => {
              console.log("inserted: ", row[0]);
            })
            .catch( err => {
              console.log("Error performing CSV import: ", err);
            });

            /*
              state_abbrev: row["state"],
              state_name: statesHash[row["state"]],
              positive: row["positive"],
              recovered: row["recovered"],
              deaths: row["death"],
              date: row["date"]
            */
          }
        } else { // future imports
          // check the max date, start imports from there
        }

        // db.end(); // end the connection here rather than exit the running process
      }).catch( err => {
        console.log(err);
        process.exit(1);
      });
      // console.log("state array: ", stateArray);
      /* console.log("End of csv"); */
      // db.end();
    })
    .on("close", () => {
      console.log("closing....");
      db.end();
    });

  parentPort.postMessage({ status: "Importing csv data...."});
}