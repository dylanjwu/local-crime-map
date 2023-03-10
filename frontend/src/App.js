import './App.css'
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

import camelCase from 'camelcase-keys';

const { REACT_APP_MAPBOX_TOKEN_PUBLIC } = process.env;
const ACCESS_TOKEN = REACT_APP_MAPBOX_TOKEN_PUBLIC;
mapboxgl.accessToken = ACCESS_TOKEN;

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const loadMap = async (data) => {

    // console.log(locations);

    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
    // const marker1 = new mapboxgl.Marker()
    //   .setLngLat([12.554729, 55.70651])
    //   .addTo(map.current);

    map.current.on('load', () => {
      console.log(data);
      // Add an image to use as a custom marker
      map.current.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.current.addImage('custom-marker', image);
          // Add a GeoJSON source with 2 points
          map.current.addSource('points', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': data.map(({ coordinates, callLocation, callType }) => ({
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [
                    coordinates.x, coordinates.y
                  ]
                },
                'properties': {
                  'title': callLocation
                }
              }))
            }
          });

          // Add a symbol layer
          map.current.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'custom-marker',
              // get the title name from the source's "title" property
              'text-field': ['get', 'title'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          });
        }
      );
    });
  }

  const getCalls = async () => {
    const res = await axios.get('http://localhost:3001/calls');
    const { data } = res;
    return data;
  };

  useEffect(() => {
    getCalls().then(res => camelCase(res, { deep: true })).then((data) => loadMap(data));
  });

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on('move', () => {
  //     setLng(map.current.getCenter().lng.toFixed(4));
  //     setLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });

  return (<div>
    <div ref={mapContainer}
      className="map-container" />
    </div>
    );
}