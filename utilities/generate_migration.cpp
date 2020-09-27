#include <iostream>
#include <string>
#include <ctime>
#include <fstream>

/*
  This program creates sql schema migration file with added utc date time
  Created by Gabriel Betancourt (github.com/mau5atron ) on Sep 21, 2020
*/

/*
  Usage:
  Run from project src
  ( I created this script to generate a file based on my own structure )
  targeted path to generate a sql file -> project_src_folder/db/migrations
  $ ./path_to_binary --file_name migration_name

  this will then generate a sql file at path:
  $ ./db/migrations
  Which will look something like
  $ ./db/migrations/20200922020715_token_table_schema.sql
*/

int main(int argc, char *argv[]){
  for ( unsigned int i = 0 ; i < argc ; i++ ){
    std::string arg = argv[i];
    if ( arg == "--file_name" ){
      if ( i + 1 < argc ){
        std::cout << argv[i + 1] << "\n";
        char formatted_filename[255];
        char full_path[512];

        time_t current_time;
        tm *curr_tm;
        char date_string[50];
        time(&current_time);
        curr_tm = localtime(&current_time);
        strftime(date_string, 50, "%Y%m%d%H%M%S", curr_tm);
        std::cout << "Current date and time: " << date_string << "\n";

        strcpy(formatted_filename, date_string);
        strcat(formatted_filename, "_");
        strcat(formatted_filename, argv[i + 1]);
        strcat(full_path, "./db/migrations/");
        strcat(full_path, formatted_filename);
        strcat(full_path, ".sql");
        std::ofstream createFile(full_path); // create file at path
        std::cout << "Formatted date and time string with args AND full path: " << full_path << "\n";
      } else {
        std::cerr << "Program requires a name for the migration" << "\n";
        return 1;
      }
    }
    // }
  }
  return 0;
}