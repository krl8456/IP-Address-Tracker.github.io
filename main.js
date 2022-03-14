const ip = document.querySelector('.ip-address')
const loc = document.querySelector('.location')
const timezone = document.querySelector('.timezone')
const isp = document.querySelector('.isp')
const button = document.querySelector('.button')
const inputText = document.querySelector('#header-ip-bar')
const regexIP = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/
const errorMessage = document.querySelector('.error-message')
getData().catch(err => console.log(err.message))


let coordinates
let map
const myIcon = L.icon ({
    iconUrl: 'images/icon-location.svg',
    iconSize: [35, 45],
    iconAnchor: [22, 54],
    popupAnchor: [-3, -76]
})
let marker

async function getData(address) {
    if (address === undefined) {
        const response = await fetch('http://ip-api.com/json')
        const data = await response.json()
        console.log(data)
        coordinates = [data.lat, data.lon]
        console.log(coordinates)
        ip.textContent = data.query
        loc.textContent = `${data.city}, ${data.countryCode} \u00A0${data.zip}`
        timezone.textContent = data.timezone
        isp.textContent = data.isp
        createMap(coordinates)
        // console.log(data)
        //console.log(coordinates)
    }
    else {
        const response = await fetch(`http://ip-api.com/json/${address}`)
        const data = await response.json()
        console.log(data)
        coordinates = [data.lat, data.lon]
        console.log(coordinates)
        ip.textContent = address
        loc.textContent = `${data.city}, ${data.countryCode} \u00A0${data.zip}`
        timezone.textContent = data.timezone
        isp.textContent = data.isp
        map.setView(coordinates, 13)
        marker.setLatLng(coordinates)
        // console.log(data)
        //console.log(coordinates)
    }
}

button.addEventListener('click' ,(e) => {
        e.preventDefault()
        if(!inputText.value.match(regexIP)) {
            errorMessage.textContent = "Please enter valid IP address"
        }
        else {
            errorMessage.textContent = ''
            getData(inputText.value).catch(err => console.log(err.message))
        }
        //console.log(coordinates)
       
})
function createMap(coordinates) {
    map = L.map('map').setView(coordinates, 13)
    const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map)
    marker = L.marker(coordinates, {icon: myIcon}).addTo(map)
}
