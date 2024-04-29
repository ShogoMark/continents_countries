document.addEventListener('DOMContentLoaded', function() {

const countriesContainer = document.querySelector('.continent__countries');
const continentContainer = document.querySelector('.continent__container');
const eachCountry = document.querySelectorAll('.container__each')



const continents = ['asia', 'africa', 'north america', 'south america', 'antartica', 'europe', 'australia']



//////////////////FUNCTIONS////////////////////

const displayContinents = function() {
  continents.forEach(cont => {
    const continentUpper = cont.toUpperCase();

    const html = `
    <div class="continent__container">
    <button class="btn-continent"><h3>${continentUpper}</h3></button>
  </div>    
  `
    continentContainer.insertAdjacentHTML('afterbegin', html)
  })
}

displayContinents();



const getCountries = async function(continent) {
  if (continent === "australia") {
    continent = "oceania"
  }

  countriesContainer.style.opacity = 0;


  const data = await fetch(`https://restcountries.com/v3.1/region/${continent}
  `)
  const res = await data.json();
  res.forEach(each => {
    const name = Object.values(each.name);

    const markup = `
    <div class="container__each">
      <img class="country__img" src="${each.flags.png}">
      <h3>Name: ${name[0]}</h3>
      <h4>Capital: ${each.capital}</h4>
    </div>
  `;
  
  countriesContainer.style.transition = "opacity 1s";

  countriesContainer.insertAdjacentHTML("afterbegin", markup);
})
  setTimeout(() => {
  countriesContainer.style.opacity = 1;
  }, 300);
}


const getCountryName = function(elementClicked) {
  
  const targetCountry = elementClicked.closest('.container__each');

  const nameElement = targetCountry.querySelector('h3:nth-of-type(1)')

  const nameValue = nameElement.textContent.trim().slice(6);

  return nameValue;
}



let map;


const renderMap = function(latitude, longitude) {

  if(!map) {
  map = L.map('mapContainer').setView([latitude, longitude], 13);

  L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  marker = L.marker([latitude, longitude]).addTo(map);


  } else {
      // If a map already exists, just update its view
      map.setView([latitude, longitude], 13);

}
  map.on('click', function() {
    hideModal();
})
}


function showModal() {
  const modal = document.getElementById('mapModal');
  modal.style.display = 'flex';
}

function hideModal() {
  const modal = document.getElementById('mapModal');
  modal.style.display = 'none';
}





async function fetchDataForCountry(countryName) {
 try {
   // Construct the API URL using the country name
   const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;

   const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    const latitude = data[0].latlng[0];
    const longitude = data[0].latlng[1];
    
    return { latitude, longitude };
} catch (err) {
  console.error('Error fetching data:', err);
  return null;
}
}




///////////////EVENTS/////////////////////////


continentContainer.addEventListener('click', function(e) {
  e.preventDefault();

  const targetButton = e.target.closest('.btn-continent');
  
  if(targetButton) {
    const continent = targetButton.textContent.toLowerCase();
  
  const allButtons = document.querySelectorAll('.btn-continent')

  
  allButtons.forEach(button => {
    button.classList.remove('btn-continent__active')
  })

  targetButton.classList.add('btn-continent__active')

  // clear the content of the div
    countriesContainer.innerHTML = '';

    getCountries(continent);
    
  }
})




countriesContainer.addEventListener('click', async function(e) {
  e.preventDefault();
  const namedValue = getCountryName(e.target);
  const { latitude, longitude } = await fetchDataForCountry(namedValue);
  if (latitude !== null && longitude !== null) {

    renderMap(latitude, longitude);
    showModal();
  }
});

})








