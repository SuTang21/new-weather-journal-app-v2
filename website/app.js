/* Global Variables */
// Personal API Key for OpenWeatherMap API
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = '4333e27eda6c7ef03005a422309fd1bf';
var coOrds = [];

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* MAIN Function called by event listener */
function performAction(e){
    e.preventDefault();

    const zipCode = document.getElementById('zip').value;
    const placename = encodeURI(document.getElementById('city__country').value);
    const mood = document.getElementById('mood').value;

    var cansubmit = validInput(zipCode, placename, mood);

    if(cansubmit == true){
        const openCageURL = `https://api.opencagedata.com/geocode/v1/json?q=${placename}&key=baaf67794210473b97a0388e18b7dc80`;  
        retrieveData(openCageURL).then(data => {
            const latitude = data.results[0].geometry.lat;
            const longitude = data.results[0].geometry.lng;
            coOrds = data.results[0].geometry;   

            retrieveData(`${baseURL}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
                .then( data => {
                    const temperature = data.main.temp;
                    postData('/entryData', {date: newDate, temp: temperature, mood: mood});
                    updateUI();
                });
            });
    }
};

/* Function to GET Web API Data*/ 
const retrieveData = async (url)=>{
  const res = await fetch(url);
  try {
      const data = await res.json();
      return data;
  } catch(error) {
      console.log("error", error);
  }
}

/* Function to POST data */
const postData = async ( url = '', data= {}) =>{
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

const updateUI = async () => {
    const request = await fetch('/all');
    try{
        document.getElementById('entryHolder').style.visibility='visible';
        const allData = await request.json();
        let i = allData.length-1;
        document.getElementById('date').innerHTML = `DATE: ${allData[i].date}`;
        document.getElementById('temp').innerHTML = `TEMP: ${allData[i].temperature}°C`;
        document.getElementById('new__entry').innerHTML = allData[i].mood;
    } catch(error){
        console.log("error", error);
    }
}

function validInput(zipCode, placename, mood){
    const reset = document.querySelectorAll('.error');
    reset.forEach(r => {
        r.remove();
    });

    if(zipCode.length < 4 || placename.length < 2 || mood.length < 3){
        if(zipCode.length < 4){
            const zipParent = document.getElementById('zip_container');
            zipParent.insertAdjacentHTML('beforeend', '<div class=error><p>*invalid zip code</p></div>');
        } 
        if (placename.length < 2){
            const locParent = document.getElementById('location_container');
            locParent.insertAdjacentHTML('beforeend', '<div class=error><p>*can not identify location</p></div>');
        }
        if (mood.length < 3){
            const moodParent = document.getElementById('mood');
            moodParent.insertAdjacentHTML('afterend', '<div className="error"><p class=error>*required field</p></div>');
        } 
        return false;
    } else {
        return true;
    }
}