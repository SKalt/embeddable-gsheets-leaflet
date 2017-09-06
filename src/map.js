import queryString from 'query-string';
import {point, featureCollection} from '@turf/helpers';
/**
 * Maps rows in a google sheet to GeoJSON points
 * @param  {String[]} colNames An array of column names
 * @param  {Array<String>|Array<Number>} row a row from the imported google sheet
 * @return {GeoJSON.Point[]} an array of GeoJSON points with properties and coordinates from their row.
 */
const toPoints = (colNames, row)=>{
  let properties = colNames.map((col, index) => {
      return {[col || index]: row[index]}
    })
    .reduce(Object.assign, {});
  let [lat, lng] = [x, y].map(colName => {
    coord = properties[colName];
    delete properties[colName];
    return coord;
  });
  return point([lng, lat], properties);
}
/**
 * Maps an array of rows to a GeoJSON FeatureCollection of Points.
 * @param  {Array<Array>} json the array of rows in the imported google sheet.
 * @return {GeoJSON.FeatureCollection} a collection of point features.
 */
const toGeoJson = json => {
    let values = json.values || json;
    if (!Array.isArray(values) || !values.length) throw new Error('No values');
    let colNames = values.splice(headerRow || 0, 1);
    return featureCollection(values.map((row)=>toPoints(colNames, row)));
};
/**
 * Turns a point's properties into a string of property : value lines.
 * @param  {Object} properties a plain object
 * @return {String}  a string of property : value lines.
 */
const propertyTable = (properties)=> Object.entries(properties)
  .map(entry => entry.join(' : '))
  .join('\n');

let {
  apiKey,
  sheetId,
  range,
  x, y, headerRow
  lat, lng, zoom,
  color, weight, opacity, radius
} = queryString.parse(location.query);
// override defaults with queryString parameters
let style = {
  radius: radius || 8,
  fillColor: color || "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: opacity || 0.8
};

const pointToLayer = (feature, latLng) => L.circleMarker(latlng, style);
/**
 * binds a tooltip to each point
 */
function onEachFeature(feature, layer){
  return layer.bindPopup(propertyTable(feature.properties));
}
L.map('map').setView([lat, lng], zoom);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.light'
}).addTo(map);
try {
  let url = 'https://sheets.googleapis.com/v4/spreadsheets/' +
    `${sheetId}/values/{range}?key=${apiKey}`;
  fetch(url).then(response => {
    if (!response.ok){
      throw new Error(`response status ${response.status}`);
    }
    return response.json();
  }).then(
    points => L.geoJson(points, {
      onEachFeature,
      pointToLayer
    }).addTo(map);
  });
} catch(err){
  alert('API key invalid on this domain');
  throw err;
}
