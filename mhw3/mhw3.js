//SCALA SALVATORE GAETANO O46001744

const api_key = "5mofwaqie9IzjFIZyEGqvbXO3DiNkVqp";
const numResults = 12;

//Keys and endpoints
const key_gif = 'mAvCsm3x3r5UhimJjQvAbWmHVSf8Uomb';		
const key_img = '16326848-36a4d0e195bb2375d6f41ea91';		
const gif_api_endpoint = 'http://api.giphy.com/v1/gifs/search' 
const img_api_endpoint = 'https://pixabay.com/api/' 

//Key and secret for Unsplash OAuth2.0 
const key_petfinder = '7enQNVqjn3UjEq6n01Y4vqEkx6rnN2dPy2gCSbORSFp1DlzXFT'
const secret_petfinder = 'ooIVyIMsx0g8KEMWO49rVwPRqPNwL9VaixniYJF6'
const pet_api_endpoint_token = 'https://api.petfinder.com/v2/oauth2/token' 
const pet_api_endpoint = 'https://api.petfinder.com/v2/animals' 



function onResponse(response)
{ return response.json(); }

function onImgJson(json)
{
    console.log(json); 
    const album = document.querySelector("#album-view");
    album.innerHTML='';

    const results = json.hits;

    for(let result of results)
    {
        
        const imgContainer = document.createElement("div");
        const img = document.createElement('img');
        
        imgContainer.classList.add("container");

        img.addEventListener('click', openPic);
        img.src=result.largeImageURL;

        imgContainer.appendChild(img);
        album.appendChild(imgContainer);
    }
}

function onGifJson(json){
    
    console.log(json); 
    const album = document.querySelector("#album-view");
    album.innerHTML='';

    let results = json.data;

    for(let result of results)
    {
        
        const imgContainer = document.createElement("div");
        const img = document.createElement('img');
        
        imgContainer.classList.add("container");

        img.addEventListener('click', openPic);
        img.src=result.images.downsized_medium.url;

        imgContainer.appendChild(img);
        album.appendChild(imgContainer);
    }
}

function onPetJson(json){
    
    console.log(json); 
    const album = document.querySelector("#album-view");
    album.innerHTML='';

    let results = json.animals;

    for(let result of results)
    {
        if(result.length === 0){
            continue;
        }
        const imgContainer = document.createElement("div");
        const img = document.createElement('img');
        
        imgContainer.classList.add("container");

        img.addEventListener('click', openPic);
        img.src = result.primary_photo_cropped.medium;
        //result.primary_photo_cropped.medium;
        
        //result.photos[0].medium;

        imgContainer.appendChild(img);
        album.appendChild(imgContainer);
    }
}



let token;
function onJsonToken(json)
{
    console.log(json);
    token = json.access_token;

}

function openPic(event)
{
    //per aprire la foto in una nuova scheda
    window.open(event.currentTarget.src);
}

function sendRequest(event){
    event.preventDefault();

    const text = document.querySelector("#content").value;
    const tipo = document.querySelector("#tipo").value;
    const encodeText = encodeURIComponent(text);

    if(tipo === "immagine"){
        const imgRequest = img_api_endpoint + '?key='  + key_img + '&q=' + encodeText + '&per_page=' + numResults;
        fetch(
            imgRequest
        ).then(onResponse).then(onImgJson);
    }

    if(tipo === "gif"){
        const gifRequest = gif_api_endpoint + '?api_key='  + key_gif + '&q=' + encodeText + '&limit=' + numResults;
        fetch(
            gifRequest
        ).then(onResponse).then(onGifJson);
    }

    if(tipo === 'pet')
    {
        const status = 'adoptable'
        fetch('https://api.petfinder.com/v2/animals?type=' + encodeText + '&status=' + status, 
        {
            headers: {
                'Authorization': "Bearer" + ' ' + token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(onResponse).then(onPetJson);
    }
}


const form = document.querySelector("#search_content");
form.addEventListener("submit", sendRequest);


fetch(
    pet_api_endpoint_token,
    {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=' + key_petfinder + '&client_secret=' + secret_petfinder,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }   
).then(onResponse).then(onJsonToken);