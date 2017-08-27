async function getJson(url){
  fetch(url).then(response => {
    if (response.ok){
      return response.json();
    }
    throw new Error(response.status);
  }).then(json => {

  })
}
