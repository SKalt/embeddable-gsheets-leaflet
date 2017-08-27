(function(d) {
  function inject(tag, opts, onload){
    element = Object.assign(d.createElement(tag), opts);
    if (onload) element.onload = onload;
    d.getElementsByTagName('head')[0].appendChild(element)
  }
  async function promiseInject(tag, opts){
    return new Promise((resolve) => inject(tag, opts, resolve));
  };
  async function injectLeaflet(){
    return promiseInject('link', {
      rel:"stylesheet", href:"https://unpkg.com/leaflet@1.2.0/dist/leaflet.css",
      integrity:"sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
      crossorigin:""
    }).then(()=>promiseInject('script', {
      src:"https://unpkg.com/leaflet@1.2.0/dist/leaflet.js",
      integrity:"sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log=="
      crossorigin:""
    }));
  }
  function __init__(){
    L.map(MAP_ID).setview(VIEW);
    L.geoJSON(myLines, { //TODO: import from gsheets
    style: myStyle
}).addTo(map);
  }
}(document));
