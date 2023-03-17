// const { db } = require('./connect.js');
const { QueryFile } = require('pg-promise');
const path = require('path')

const GET_CALLS = new QueryFile(path.join(__dirname, './sql/get_calls.sql'), { minify: true });

const getCalls = async(conn) => {
    const res = await conn.many(GET_CALLS);
    return res;
}

module.exports = { getCalls };

// (async() => {
//     const result = await getCalls(db());
//     console.log(result);
// })();