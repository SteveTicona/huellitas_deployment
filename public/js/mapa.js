document.addEventListener('DOMContentLoaded',() => {
    if(document.querySelector('#ubicacion-publicacion')){
        mostrarMapa();
    }
});

function mostrarMapa(){

    // Obtener los valores
    const lat = document.querySelector('#lat').value,
          lng = document.querySelector('#lng').value;

    var map = L.map('ubicacion-publicacion').setView([lat, lng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Me perdi por aqui')
        .openPopup();
}
