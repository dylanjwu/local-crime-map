const { getDocument } = require('pdfjs-dist');
const fs = require('fs');

const getTextItems = async (page) => {
    const content = await page.getTextContent();
    const textItems = content.items.map(item => item.str);
    return textItems;
}

const getContent = async (page, startIndex = 21) => {
    const items = await getTextItems(page);
    const itemsContent = items.slice(startIndex);

    const rows = [];
    let currRow = [];

    let currStr = '';
    let columns = 0;

    for (let i = 0; i < itemsContent.length; i++) {
        if (itemsContent[i] === '' || itemsContent[i] === ' ') {
            currRow.push(currStr.trim());
            currStr = '';
            columns += 1;
            if (columns === 6) {
                rows.push(currRow);
                currRow = [];
                columns = 0;
            }
        } else {
            currStr += ' ' + itemsContent[i];
        }
    }

    return rows;
}

const writeJsonFile = async (path) => {

    const pdfFile = fs.readFileSync(path);

    const pdf = await getDocument({ data: pdfFile }).promise;

    const textItems = await getTextItems(await pdf.getPage(1));
    const headerTextItems = textItems.filter(s => s.trim() !== '');
    const metadata = {
        exactTime: headerTextItems[0],
        dateString: headerTextItems[3]
    };

    const fields = ['callNum', 'callStart', 'callEnd', 'type', 'location', 'officerName']

    let contents = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await getContent(page, i === pdf.numPages ? 14 : 21)
        contents = contents.concat(content)
    }

    // add fields
    contents = contents.map(event => (Object.fromEntries(event.map((attrib, i) => [fields[i], attrib]))));
    console.log(contents)


    console.log(path)
    const splitPath = path.split('/')
    const filepath = `${splitPath[splitPath.length-1].split('.')[0]}.json`
    console.log(filepath)
    fs.writeFileSync('./json_data/' + filepath, JSON.stringify({ metadata, contents }, null, 2));
};

const writeAll = () => {
    const dir = '../scrape-py/pdfs';
    fs.readdir(dir, (err, files) => {
        Promise.all(files.map(file => {
            console.log(file);
            writeJsonFile(dir + '/' + file);
        }));
    });
}

writeA()