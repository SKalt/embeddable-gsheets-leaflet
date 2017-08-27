// replace ID, RANGE
// mapboxgl from out of scope
const linkToId = (link) => link
  .replace(/.*\/d\//, '')
  .replace(/\/edit.+/, '');

let url = `https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${RANGE}`;

var data;
var map = new mapboxgl.Map(); //TODO: params
// if another geojson source is specified, grab that first
fetch(url).then(response => {
  if (response.ok){
    return response.json();
  }
  throw new Error(response.status);
}).then(json => {data = json;});
