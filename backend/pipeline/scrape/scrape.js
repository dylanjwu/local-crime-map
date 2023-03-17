const fs = require('fs');
const { parse } = require('node-html-parser');
const request = require('request');

const writePdf = async (filePath, link) => {
    const file = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
        request.get(link)
            .on('error', reject)
            .pipe(file)
            .on('finish', resolve);
    });
};


(async() => {
    const prefix = 'https://content.civicplus.com/api/assets';
    const resp = await fetch("https://content.civicplus.com/api/apps/me-portland/all?$top=100&$skip=0&$orderby=id&$filter=(id%20eq%20640c7bec-314f-4e5c-884e-c992ee62d669%20or%20id%20eq%207f9c2d63-7ecd-40a2-857a-2814328dee20%20or%20id%20eq%20fd0fd860-ae03-41f8-af9e-d2d106cffe5e%20or%20id%20eq%2090142ea6-d6c3-473e-ae49-fe9ac199b7a4%20or%20id%20eq%2046fc8d44-3841-49ad-ba0a-ebe66ee2c123%20or%20id%20eq%2014a46392-0ed2-4923-b797-f0b784d5998c%20or%20id%20eq%20ad9ce5d8-885b-4d01-bb89-29e418eadacc)", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkYtbUItVDBLUzQxbmxTWVQ3WVFPdmciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE2Nzg2NTc2MDAsImV4cCI6MTY4MTI0OTYwMCwiaXNzIjoiaHR0cHM6Ly9jb250ZW50LmNpdmljcGx1cy5jb20vaWRlbnRpdHktc2VydmVyIiwiY2xpZW50X2lkIjoibWUtcG9ydGxhbmQ6ZGVmYXVsdCIsImp0aSI6IkM4MTc0QzYyNTE0N0YzNDMzQTRDNDUzRDRDQzZDQ0RCIiwiaWF0IjoxNjc4NjU3NjAwLCJzY29wZSI6WyJoY21zLWFwaSJdfQ.Tk62b9bKJvhUoJAs2wUQ6nkSGIKs3Yo7k7qDhrq8LmYrixlnkDTK2zjdzbMvohWLthpZ-znAZBU1yXYa2D6KYEF8E4NJ3dNMUTN-b8LlPom7O4jkSXk7gfNDCaH1jDkAkmzVlEqwY0Wi7wulq9CmQzfo09Qr6Pli1vf5IzGumnt7N4RF-2u3n9j6hDTNIedNnnOSAHIzmc1pXVsItBvMjjHPp9OD26NcJlVr7zMaLID9u8ARo4-NL5BevWSud5zl5aGephJWcECEgFHt1rI3gW8VBMDTUhGVmSgXbZyJsD92neKUrxtez8CRC3ctBZfkAoV5F80dssBVfYkjfKySbg",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-resolveflow": "true",
            "x-unpublished": "true"
        },
        "referrer": "https://www.portlandmaine.gov/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await resp.json();
    const { items } = data;

    const res = items.map(({data}) => data?.article?.en).filter(Boolean).filter(t => t.includes('Daily Call Logs'));

    const html = parse(res)
    const tags = html.querySelectorAll('ul li a');
    const links = tags.map((tag) => tag.getAttribute('href'));


    for (const link of links) {
        const splitPath = link.split('/');
        const filePath = __dirname + '/pdfs/' + splitPath[splitPath.length-1] + '.pdf';
        await writePdf(filePath, link);
    }
})();