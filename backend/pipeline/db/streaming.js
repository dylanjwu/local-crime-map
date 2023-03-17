const fs = require('fs');
const path = require('path');
const { pick } = require('stream-json/filters/Pick');
const { chain } = require('stream-chain');
// const { streamValues } = require('stream-json/streamers/StreamValues');
const { parser } = require('stream-json');


const filepath = path.join(__dirname, '..', 'parse-js', 'json_data',
    '0addc34f-0f49-4905-bb69-aef72c2314ed.json');

const getFileContents = (filepath, chunkSize = 50) => {
    let buffer = [];
    let count = 0;
    const result = [];

    return new Promise((resolve, reject) => {
        const pipeline = chain([fs.createReadStream(filepath),
            parser(),
            pick({ filter: 'contents' }),
        ]);

        pipeline.on('data', (chunk) => {
            // counter++;
            // console.log(`counter: ${counter}: chunk: ${chunk}`)
            count++;
            buffer.push(chunk);

            if (count % chunkSize === 0) {
                // insert buffer into db 
                result.push({
                    [count / chunkSize]: buffer
                });
                buffer = [];
            }
        })
        pipeline.on('error', (err) => reject(err));
        pipeline.on('end', () => {
            result.push({ 'rest': buffer });
            resolve(result);
        });
    });
}


(async() => {

    const fileContents = await getFileContents(filepath);
    console.log(fileContents);

})();