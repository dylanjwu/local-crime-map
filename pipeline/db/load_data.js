const { db } = require('./connect.js');
const fs = require('fs');
const path = require('path');

const { QueryFile } = require('pg-promise');


const getAllData = () => {
    const dir = path.join('..', 'parse-js', 'json_data');
    let allData = [];
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            for (const fname of files) {
                const f = fs.readFileSync(path.join(dir, fname), 'utf8');
                const jsonData = JSON.parse(f);
                allData = allData.concat(jsonData.contents);
            }
            resolve(allData);
        });
    });
};


const insertOfficers = async(conn, officerStrings) => {
    const officers = officerStrings.map(full => ({ first: full.split(' ')[0], last: full.split(' ').slice(1).join(' ') }));
    const officersJsonString = JSON.stringify(officers);
    const INSERT_OFFICERS = new QueryFile('./insert_officers.sql', { minify: true });
    await conn.none(INSERT_OFFICERS, { officers: officersJsonString });
};

const insertCallTypes = async(conn, callTypes) => {
    const INSERT_TYPES = new QueryFile('./insert_call_types.sql', { minify: true });
    await conn.none(INSERT_TYPES, { callTypes });
};

const insertCallsData = async(conn, callsData, officerNameToId, typeNameToId) => {
    const calls = callsData.map(({ callNum, callStart, callEnd, type, location, officerName }) => ({
        callNum: Number(callNum),
        callStart,
        callEnd,
        typeId: typeNameToId[type],
        location,
        officerId: officerNameToId[officerName]
    }));

    const INSERT_CALLS = new QueryFile('./insert_calls.sql', { minify: true });
    await conn.none(INSERT_CALLS, { calls: JSON.stringify(calls) });
}


const getOfficers = (allData) => {
    const officers = allData.map(({ officerName }) => officerName);
    const uniqueOfficers = Array.from(new Set(officers));
    return uniqueOfficers;
}

const getTypes = (allData) => {
    const callTypes = allData.map(({ type }) => type);
    const uniqueCallTypes = Array.from(new Set(callTypes));
    return uniqueCallTypes;
}


(async() => {
    const conn = db();

    const rawData = await getAllData();
    const allData = rawData.map((o) => {
        const firstname = `${o.officerName.split(',').slice(1).join(' ').trim()}`;
        const lastname = `${o.officerName.split(',')[0].trim()}`;

        return {...o, officerName: `${firstname} ${lastname}` }
    })

    // insert types and officers into respective tables
    const uniqueOfficers = getOfficers(allData);
    await insertOfficers(conn, uniqueOfficers);

    const uniqueCallTypes = getTypes(allData);
    await insertCallTypes(conn, uniqueCallTypes);

    const officersFromDb = await conn.many('SELECT id, first_name, last_name FROM officers');
    const officerNameToId = officersFromDb.reduce((acc, { id, first_name, last_name }) => { acc[`${first_name} ${last_name}`] = id; return acc; }, {});

    const types = await conn.many('SELECT id, name FROM types');
    const typeNameToId = types.reduce((acc, { id, name }) => { acc[name] = id; return acc; }, {});

    await insertCallsData(conn, allData, officerNameToId, typeNameToId);

    process.exit(0)
})();