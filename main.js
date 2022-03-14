const ip = document.querySelector('.ip-address')
const loc = document.querySelector('.location')
const timezone = document.querySelector('.timezone')
const isp = document.querySelector('.isp')
const button = document.querySelector('.button')
const inputText = document.querySelector('#header-ip-bar')
const checkIP = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/
const checkDomain = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
const errorMessage = document.querySelector('.error-message')
const key = "at_te0oGANCmLf0jscxIxvBd7DXGH0V4"
getData().catch(err => console.log(err.message))


let coordinates
let map
let marker
const myIcon = L.icon ({
    iconUrl: 'images/icon-location.svg',
    iconSize: [35, 45],
    iconAnchor: [22, 54],
    popupAnchor: [-3, -76]
})

async function getData(address) {
    if (address === undefined) {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}`)
        const data = await response.json()
        settingMapAndData(data)
        createMap(coordinates)
    }
    else if (address.match(checkDomain)) {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}&domain=${address}`)
        const data = await response.json()
        settingMapAndData(data)
        map.setView(coordinates, 13)
        marker.setLatLng(coordinates)
    }
    else {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}&ipAddress=${address}`)
        const data = await response.json()
        settingMapAndData(data)
        map.setView(coordinates, 13)
        marker.setLatLng(coordinates)
    }
}

button.addEventListener('click' ,(e) => {
        e.preventDefault()
        if(!inputText.value.match(checkIP) && !inputText.value.match(checkDomain)) {
            errorMessage.textContent = "Please enter valid IP address or domain"
        }
        else {
            errorMessage.textContent = ''
            getData(inputText.value).catch(err => console.log(err.message))
        }     
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
function settingMapAndData(data) {  
    coordinates = [data.location.lat, data.location.lng]
    ip.textContent = data.ip
    loc.textContent = `${data.location.city}, ${data.location.country} \u00A0${data.location.geonameId}`
    timezone.textContent = "USP " + data.location.timezone
    isp.textContent = data.isp
}
