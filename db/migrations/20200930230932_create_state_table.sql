CREATE TABLE state (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  state_abbrev VARCHAR(2) NOT NULL,
  state_name VARCHAR(255) NOT NULL,
  INDEX (state_abbrev)
);