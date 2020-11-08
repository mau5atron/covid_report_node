const db = require("../../db/database");

module.exports = class StateData {
  /**
   * @param { integer } positive
   * @param { integer } recovered
   * @param { integer } deaths
   * @param { date } date
   */
  constructor( positive, recovered, deaths, date ){
    this.positive = positive;
    this.recovered = recovered;
    this.deaths = deaths;
    this.date = date;
  }

  static getLatestStateData(){
    return db.execute(
      `
        SELECT 
          IFNULL(state_data.positive, 0) AS positive,
          IFNULL(state_data.recovered, 0) AS recovered,
          IFNULL(state_data.deaths, 0) AS deaths,
          DATE_FORMAT(state_data.date, "%m/%d/%Y") AS date,
          state.state_abbrev,
          state.state_name
        FROM state_data
        INNER JOIN
          state
        ON state_data.state_id = state.id
        WHERE DATE_FORMAT(state_data.date, "%m/%d/%Y") >= (
          SELECT MAX( DATE_FORMAT(date, "%m/%d/%Y") ) AS latest_date
          FROM state_data
          GROUP BY date
          ORDER BY latest_date 
          DESC LIMIT 1
        );
      `
    );
  }
};