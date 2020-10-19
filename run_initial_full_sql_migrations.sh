MIGRATION_FILES="./db/migrations/*";
for file in $MIGRATION_FILES
do
  # echo "$file"
  mysql -u root -p$DB_PASS covid_report < $file
  # or mysql -u root --password=$DB_PASS covid_report < $file
done