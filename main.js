const ip = document.querySelector('.ip-address')
const loc = document.querySelector('.location')
const timezone = document.querySelector('.timezone')
const isp = document.querySelector('.isp')
const button = document.querySelector('.button')
const inputText = document.querySelector('#header-ip-bar')

getData().catch(err => console.log(err.message))


let coordinates = [51.25, 22.56667]
let map = L.map('map').setView(coordinates, 13);

const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);
const myIcon = L.icon ({
    iconUrl: 'images/icon-location.svg',
    iconSize: [35, 45],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
})

let marker = L.marker(coordinates, {icon: myIcon}).addTo(map);

async function getData(address) {
    if (address === undefined) {
        const response = await fetch('http://ip-api.com/json')
        const data = await response.json()
        coordinates = [data.lat, data.lon]
        ip.textContent = data.query
        loc.textContent = `${data.city}, ${data.countryCode} ${data.zip}`
        timezone.textContent = data.timezone
        isp.textContent = data.isp
        // console.log(data)
        // console.log(coordinates)
    }
    else {
        const response = await fetch(`http://ip-api.com/json/${address}`)
        const data = await response.json()
        coordinates = [data.lat, data.lon]
        ip.textContent = address
        loc.textContent = `${data.city}, ${data.countryCode} ${data.zip}`
        timezone.textContent = data.timezone
        isp.textContent = data.isp
        // console.log(data)
        // console.log(coordinates)
    }
}

button.addEventListener('click' ,(e) => {
        e.preventDefault()
        getData(inputText.value).catch(err => console.log(err.message))
        console.log(coordinates)
        map.setView(coordinates, 13)
        marker.setLatLng(coordinates)
})
