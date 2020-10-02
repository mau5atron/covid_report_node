-- using this as an example to perform insert for state and state data
START TRANSACTION;
-- going to insert into state first
-- then use last id and info from iteration to insert into state data table

  INSERT INTO 
    state(state_abbrev, state_name)
  VALUES (
    "CA",
    "California"
  );

  -- set id from just inserted row
  SET state_fk = LAST_INSERT_ID();

  INSERT INTO
    state_data(positive, negative, deaths, state_id)
  VALUES (
    100,
    100,
    100,
    state_fk
  );

COMMIT;