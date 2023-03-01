const { getDocument } = require('pdfjs-dist');
const fs = require('fs');

const getTextItems = async (page) => {

    const content = await page.getTextContent();

    // fs.writeFileSync('./results.json', JSON.stringify(content.items, null, 2));

    const textItems = content.items.map(item => item.str);

    return textItems;
}

const getContent = async (page) => {
    const items = await getTextItems(page);
    const itemsContent = items.slice(21);

    const rows  = [];
    let currRow = [];

    let currStr = '';
    let columns = 0;

    for (let i = 0; i < itemsContent.length; i++){
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

(async() => {
    const pdfFile = fs.readFileSync('./logs.pdf');

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
        const content = await getContent(page)
        contents = contents.concat(content)
    }

    console.log(contents)

    fs.writeFileSync('./results.json', JSON.stringify(contents, null, 2));

})();
    