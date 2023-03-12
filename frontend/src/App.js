import './App.css'
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

import 'mapbox-gl/dist/mapbox-gl.css';
import camelCase from 'camelcase-keys';

const { REACT_APP_MAPBOX_TOKEN_PUBLIC } = process.env;
const ACCESS_TOKEN = REACT_APP_MAPBOX_TOKEN_PUBLIC;
mapboxgl.accessToken = ACCESS_TOKEN;

const features = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776],
      },
      properties: {
        name: 'San Francisco',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-73.985, 40.748],
      },
      properties: {
        name: 'New York City',
      },
    },
  ],
};


const getCallFeature = ({ callStart, callEnd, callLocation, coordinates, name }) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coordinates.x, coordinates.y],
    },
    properties: {
      crimeType: name,
      callStart,
      callEnd,
      callLocation
    },
  };
}

const createPopupHtml = (entries) => {
  const pTemplate = (key, value) => `<p class="popup-line"> <span class="popup-key-name"> ${key}:</span> ${value} </p>`;

  return `<div class="popup"> ${entries.map(([key, value]) => pTemplate(key, value)).join(' ')} </div>`

}

const Map = () => {
  const [map, setMap] = useState(null);
  const mapContainerRef = useRef(null);

  const onMapLoaded = (data, map) => {
    setMap(map);
        map.resize();

        map.on('click', 'markers', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const {callEnd, callLocation, callStart, crimeType} = e.features[0].properties;
          
          const popupContent = createPopupHtml([['Crime Type', crimeType], ['Location', callLocation], ['Start-end', `${callStart} - ${callEnd}`]])
          new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo(map);
        })

        const features = camelCase(data, { deep: true}).map((feature => getCallFeature(feature)));

        features.forEach((marker) => {
          const el = document.createElement('div');
          el.className = 'marker';
          new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
        });

        map.addSource('markers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features
          },
        });

        map.addLayer({
          id: 'markers',
          type: 'symbol',
          source: 'markers',
          layout: {
            'icon-image': 'marker-15',
            'text-field': '{name}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
          },
        });
  }

  const getCalls = async () => {
    const resp = await axios.get('http://localhost:3001/calls');
    const { data } = resp;
    return data;
  }


  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;

    const initializeMap = (data, { setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2,
      });

      map.on('load', () => {
        onMapLoaded(data, map);
      });
    }

    if (!map) //this is called for every re-render so only run this if the map is already defined
    {
      getCalls().then(data => initializeMap(data, { setMap, mapContainer: mapContainerRef.current }));
    }
  });

  return <div ref={mapContainerRef} className="map-container" />;
};

// export default Map;

export default function App() {

  return <div className="App"> <Map /> </div>
}