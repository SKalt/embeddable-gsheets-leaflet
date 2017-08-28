// replace ID, RANGE
// mapboxgl from out of scope
const linkToId = (link) => link
  .replace(/.*\/d\//, '')
  .replace(/\/edit.+/, '');

// poll for window closing
function pollWindow(url, cb){
  let tab = window.open(url);
  const checkOpen = () => setTimeout(()=> tab.closed ? cb() : checkOpen(), 500);
  checkOpen();
}

// get view-able link
// share > get shareable link
//
// make api key @ https://console.cloud.google.com/apis/credentials

let url = `https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${RANGE}` +
  `?key=${APIKEY}`;

var data;
var map = new mapboxgl.Map(); //TODO: params
// if another geojson source is specified, grab that first
fetch(url).then(response => {
  if (response.ok){
    return response.json();
  }
  throw new Error(response.status);
}).then(json => {data = json;});
