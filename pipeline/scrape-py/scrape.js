const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = 'https://www.portlandmaine.gov/472/Daily-Media-Logs';
    await page.goto(url);

    const path = '/html/body/div[4]/div/div[2]/div[2]/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div/div/div/div/div/div[2]/div/ul';
    await page.waitForSelector(path);

    const liTags = await page.$$('ul > li');
    for (let li of liTags) {
        const aTag = await li.$('a');
        const href = await aTag.evaluate(a => a.href);
        const fileName = href.split('/').pop() + '.pdf';
        const filePath = `pdfs/${fileName}`;
        const file = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            request.get(href)
                .on('error', reject)
                .pipe(file)
                .on('finish', resolve);
        });
    }

    await browser.close();
})();