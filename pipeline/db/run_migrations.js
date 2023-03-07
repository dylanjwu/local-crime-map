const { db } = require('./connect.js');
const fs = require('fs');
const path = require('path');
const migrations = require('./migrations.json').migrations;

(async() => {
    const conn = db();

    for (const filename of migrations) {
        console.log(`Running migration ${filename}`);
        const fullpath = path.join(__dirname, 'migrations', filename);
        const file = fs.readFileSync(fullpath, 'utf8');
        await conn.none(file);
    }

    process.exit(0); // figure out how to close pg promise connection, but in the meantime
    console.log('Migrations done')
})();