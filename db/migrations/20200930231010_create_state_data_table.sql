CREATE TABLE state_data (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  positive INT NOT NULL,
  negative INT NOT NULL,
  deaths INT NOT NULL,
  state_id INT NOT NULL,
  KEY state_data_state_fk (state_id),
  CONSTRAINT state_data_state_fk FOREIGN KEY (state_id) REFERENCES state (id) ON DELETE CASCADE
);