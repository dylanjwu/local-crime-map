import axios from 'axios';

const { REACT_APP_MAPBOX_TOKEN_SECRET } = process.env;

const ACCESS_TOKEN = REACT_APP_MAPBOX_TOKEN_SECRET;

// const address = 'Oakdale St, Portland, ME';


export const geocode = async(address) => {

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${ACCESS_TOKEN}`;
    const response = await axios.get(url)
    const { data } = response;

    const [longitude, latitude] = data.features[0].center;

    return { longitude, latitude };
};