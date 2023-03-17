const axios = require('axios');

require('dotenv').config({ path: require('find-config')('.env') });
const { MAPBOX_TOKEN_SECRET } = process.env;

const geocode = async(address) => {
    // await new Promise(res => setTimeout(res, 100));

    let fullAddress;
    const splitAddress = address.split('/');
    if (splitAddress.length > 1) {
        fullAddress = `${splitAddress[0]} & ${splitAddress[1]}, Portland, Maine`;
    } else {
        fullAddress = `${address}, Portland, Maine`;
    }

    // console.log(fullAddress);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${fullAddress}.json?access_token=${MAPBOX_TOKEN_SECRET}`;
    const response = await axios.get(url)
    const { data } = response;

    const [longitude, latitude] = data.features[0].center;

    return { longitude, latitude };
};

module.exports = {
    geocode
}

// (async() => {
//     for (let i = 0; i < 1000; i++) {

//         const res = geocode('68 Revere St, Portland, ME');
//         console.log(res)
//     }
// })();