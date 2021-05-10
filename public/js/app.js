let lat = document.querySelector('#lat').value || -16.495858688006876;
let lng = document.querySelector('#lng').value || -68.13393650971288;
const map = L.map('mapa').setView([lat, lng], 18);

const edit = document.querySelector('#editar').value || 'crear';

if(edit === 'editar'){

    marker = new L.marker([lat,lng], {
        draggable : true,
        autoPan: true
    })
    .addTo(map)
    .bindPopup('Me Perdí por Aquí')
    .openPopup();

    marker.on('moveend', function(e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        lat = posicion.lat;
        lng = posicion.lng;
        map.panTo(new L.LatLng(lat,lng) );
        llenarInputs(lat,lng);        
    }) 

}

if(edit === 'crear'){
    map.locate({enableHighAccuracy:true});
    map.on('locationfound', e => {   
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        llenarInputs(lat,lng);
        const coordenadas = [lat,lng];
        marker = new L.marker(coordenadas, {
            draggable : true,
            autoPan: true
        })
        .addTo(map)
        .bindPopup('Me Perdí por Aquí')
        .openPopup();   

        map.panTo(new L.LatLng(lat,lng) );
        
        marker.on('moveend', function(e) {
            marker = e.target;
            const posicion = marker.getLatLng();
            lat = posicion.lat;
            lng = posicion.lng;
            map.panTo(new L.LatLng(lat,lng) );
            llenarInputs(lat,lng);        
        })    
    })

    map.on('locationerror',e => {    
        marker = new L.marker([lat,lng], {
            draggable : true,
            autoPan: true
        })
        .addTo(map)
        .bindPopup('Me Perdí po Aquí')
        .openPopup();   
        map.panTo(new L.LatLng(lat, lng) );
        llenarInputs(lat,lng);

        marker.on('moveend', function(e) {
            marker = e.target;
            const posicion = marker.getLatLng();
            lat = posicion.lat;
            lng = posicion.lng;
            map.panTo(new L.LatLng(lat,lng) );
            llenarInputs(lat,lng);        
        })    
    })
}




document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);   
})


function llenarInputs(lat, lng){
   document.querySelector('#lat').value = lat || '';
   document.querySelector('#lng').value = lng || '';
}

