const knex = require('knex');
require('dotenv').config({ path: require('find-config')('.env') }) //https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;


const db = () => knex({
    client: 'pg',
    connection: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME
    }
});

module.exports = { db };