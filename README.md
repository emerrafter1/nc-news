# NC News Seeding

## Hosted V1 version
https://nc-news-7xob.onrender.com/api

## Project Summary

The purpose of this project is to mimic a real world backend service for content-sharing, where users can read articles, comment and react.

## Project setup

### Cloning repository

Repository can be cloned by running: `git clone https://github.com/emerrafter1/nc-news.git`

### Installing dependencies

1. Run `npm install` to install all relevant npm packages

### Seeding local database

1. Run `npm run setup-dbs` to set up databases
2. Run `npm run setup-dbs` to seed the development databases

### Running tests

1. Run `npm test` to run all test fiiles
2. Run `npm test __tests__/{filename}.test.js` to run a specific test file


## Environment files

 For the purpose of accessing the code the following files will need to be added to the root directory and should contain the following: 

- .env.development
    `PGDATABASE=nc_news`

- .env.test
    `PGDATABASE=nc_news_test`


*Note: this is for the purpose of running the code only, in a real world example this information would be kept private due to it's senstivity*



