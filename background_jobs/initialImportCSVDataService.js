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
      if ( row["date"] == "2020-09-27"){// import all rows on first run
        // console.log("Row: ", row);

        // stateArray.push(row["state"]);
        stateArray.push({
          state_abbrev: row["state"],
          state_name: statesHash[row["state"]],
          positive: row["positive"],
          deaths: row["death"],
          recovered: row["recovered"],
          date: row["date"]
        });
      }

      db.execute(
        `
          START TRANSACTION;
            INSERT INTO
              states(state_abbrev, state_name)
            VALUES(
              ?,
              ?
            );

          SET state_fk = LAST_INSERT_ID();

          INSERT INTO
            state_data(
              positive,
              negative,
              deaths,
              state_id
            ) VALUES (
              ?,
              ?,
              ?,
              state_fk
            );
          COMMIT;
        `,
        []
      );

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
      console.log("state array: ", stateArray);
      console.log("End of csv");
    });

  parentPort.postMessage({ status: "Importing csv data...."});
}