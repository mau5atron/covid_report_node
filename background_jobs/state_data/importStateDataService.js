"use strict";
const { workerData, parentPort, isMainThread } = require("worker_threads");
const fs = require("fs");
const csvParser = require("csv-parser");
const db = require("../../db/database");

// utilities
const utilities = require("../../lib/utilities/utilities");

/*
  Unrelated, but a struct factory ( or class factory )

  function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
      for (var i = 0; i < count; i++) {
        this[names[i]] = arguments[i];
      }
    }
    return constructor;
  } 

  var Item = makeStruct("id speaker country");
  var row = new Item(1, 'john', 'au');
  alert(row.speaker); // displays: john
*/




if ( isMainThread ){
  console.log("Currently on main thread, exiting worker.....");
} else {
  /*
    Here I will be inserting data from the csv corresponding with
    existing states that are currently in the state table

    - Need to look for state abbreviation and grab state_id ( id ) from state table
    - Use the state id foreign key when creating a new record in the state_data table
    
    Data Needed:
    - state_abbrev // only need this when look for existing state
    - positive
    - recovered
    - deaths ( death in csv )
    - date
  */

  var stateDataArray = new Array;
  var stateDataHash = new Object;
  var stateDataDBCount;
  db.execute(
      `
        SELECT
          id,
          state_abbrev,
          (
            SELECT COUNT(*)
            FROM state_data
          ) AS state_data_count
        FROM state;
      `
    )
    .then( (row, fieldData) => {
      // console.log("Row data: ", row[0][0].state_data_count);
      // console.log("Returned row: ", row[0]);
      stateDataArray = row[0];
      for ( var i = 0 ; i < stateDataArray.length ; i++ ){
        if ( i == 0 ){
          stateDataDBCount = stateDataArray[i].state_data_count;
        }

        stateDataHash[stateDataArray[i].state_abbrev] = {
          id: stateDataArray[i].id,
          state_abbrev: stateDataArray[i].state_abbrev
        };
      }

      stateDataHash["state_data_count"] = stateDataDBCount;
      /* console.log("State data hash before returning : ", stateDataHash);
      console.log("State data db count: ", stateDataDBCount); */
      return stateDataHash;
    }).then( resDataHash => {
      if ( resDataHash["state_data_count"] == 0 ){
        var stateDataArrayToDB = new Array;
        // proceed to import all data from csv
        const csvFileLocation = "./crawler_downloads/all_states.csv";
        var csvReadStream = fs.createReadStream(csvFileLocation);
        csvReadStream
          .on("error", err => {
            console.log("ReadStream Error: ", err);
          })
          .pipe( csvParser() )
          .on("data", (csvRow) => {
            // if ( csvRow["date"] > "2020-09-26" ){
            csvRow["positive"] = utilities.checkForEmptyProp( csvRow["positive"] );
            csvRow["recovered"] = utilities.checkForEmptyProp( csvRow["recovered"] );
            csvRow["death"] = utilities.checkForEmptyProp( csvRow["death"] );
            // ", recovered_type: ", typeof csvRow["recovered"], 
            // this is of type string
            /* console.log(
              "positive: ", csvRow["positive"],
              ", recovered: ", csvRow["recovered"],
              ", deaths: ", csvRow["death"],
              ", date: ", csvRow["date"],
              ", state_id: ", resDataHash[csvRow["state"]].id
            ); */

            stateDataArrayToDB.push([ csvRow["positive"], csvRow["recovered"], csvRow["death"], csvRow["date"], resDataHash[csvRow["state"]].id ] );
            // }

            // console.log("Resdatahash")
            // rather than make a single query on each row ( inefficient )
            /*
              we can actually just grab all the state id primary keys from state table,
              along with state abbreviation, store rows into an object of objects

              var obj = {};
              ... pushing into obj....
              obj {
                {
                  state_id: 1,
                  state: "CA"
                }
              }

              then just search the data structure for the state and grab the id
              for the related record's foreign key
            */
            /*db.execute(
              "SELECT id FROM state WHERE state_name=?",
              [csvRow["state"]]
            )
            .then( ( row, fieldData) => {
              console.log("State Row: ", row[0][0]);
            })
            .catch( err => {
              console.log("Error getting state id: ", err);
            });*/
          })
          .on("end", () => {
            // start saving all data...
            stateDataArrayToDB.reverse();
            db.query(
              "INSERT INTO state_data(positive, recovered, deaths, date, state_id) VALUES ?",
              [stateDataArrayToDB]
            ).then((row, fieldData) => {
              console.log("Inserted data...");
              console.log("ending....");
            }).catch( err => {
              console.log("Error inserting csv rows: ", err);
            });
            /* console.log("ending data array: ", stateDataArrayToDB); */
          });
      } else if ( resDataHash["state_data_count"] > 0 ){
        // make another db query here checking for latest date
        // then just import data > latest date in the csv file
        /* use this in sql query for getting date stuff
          -- (SELECT MAX( DATE_FORMAT(date, "%m/%d/%Y") ) AS latest_date
          -- FROM state_data
          -- GROUP BY date
          -- ORDER BY latest_date 
          -- DESC LIMIT 1) AS latest_date

          -- SELECT DATE_FORMAT(CURDATE(), "%m/%d/%Y");
        */
        console.log("Doing something else with state_data count > 0.....");
      }
    })
    .catch( err => {
      console.log("DB error: ", err);
    })
}