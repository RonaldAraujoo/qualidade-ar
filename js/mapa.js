const API_KEY = '2585b50b7c536c495560c52bddd701d2';

// Inicializa o mapa
const map = L.map('map').setView([-23.6486, -46.8522], 10);

// Camada base (satélite)
const satellite = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Camadas meteorológicas
const clouds = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`);
const precipitation = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`);
const temperature = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`);
const wind = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`);
const pressure = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`);
const airPollution = L.tileLayer(`https://tile.openweathermap.org/map/air_pollution/{z}/{x}/{y}.png?appid=${API_KEY}`);

// Controle de camadas
const baseMaps = { "Satélite": satellite };
const overlayMaps = {
  "Nuvens": clouds,
  "Precipitação": precipitation,
  "Temperatura": temperature,
  "Vento": wind,
  "Pressão": pressure,
  "Qualidade do Ar": airPollution
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// --------- LEGENDAS ---------
const legends = {
  "Nuvens": `
    <strong>Nuvens</strong><br>
    <div style="background:#ffffff; height:10px;"></div> Céu limpo<br>
    <div style="background:#aaaaaa; height:10px;"></div> Nublado<br>
    <div style="background:#000000; height:10px;"></div> Denso
  `,
  "Precipitação": `
    <strong>Precipitação</strong><br>
    <div style="background:#bde6f9; height:10px;"></div> Fraca<br>
    <div style="background:#4c91c4; height:10px;"></div> Moderada<br>
    <div style="background:#002853; height:10px;"></div> Forte
  `,
  "Temperatura": `
    <strong>Temperatura</strong><br>
    <div style="background:#0000ff; height:10px;"></div> Muito frio (-30°C)<br>
    <div style="background:#00ffff; height:10px;"></div> Frio (0°C)<br>
    <div style="background:#00ff00; height:10px;"></div> Agradável (15°C)<br>
    <div style="background:#ffff00; height:10px;"></div> Quente (25°C)<br>
    <div style="background:#ff9900; height:10px;"></div> Muito quente (35°C)<br>
    <div style="background:#ff0000; height:10px;"></div> Extremo (40°C+)
  `,
  "Vento": `
    <strong>Vento</strong><br>
    <div style="background:#d0f0c0; height:10px;"></div> Leve<br>
    <div style="background:#91bfdb; height:10px;"></div> Moderado<br>
    <div style="background:#4575b4; height:10px;"></div> Forte
  `,
  "Pressão": `
    <strong>Pressão</strong><br>
    <div style="background:#fef0d9; height:10px;"></div> Baixa<br>
    <div style="background:#fdcc8a; height:10px;"></div> Média<br>
    <div style="background:#fc8d59; height:10px;"></div> Alta
  `,
  "Qualidade do Ar": `
    <strong>Qualidade do Ar</strong><br>
    <div style="background:#00e400; height:10px;"></div> Boa<br>
    <div style="background:#ffff00; height:10px;"></div> Moderada<br>
    <div style="background:#ff7e00; height:10px;"></div> Ruim<br>
    <div style="background:#ff0000; height:10px;"></div> Muito ruim<br>
    <div style="background:#8f3f97; height:10px;"></div> Péssima
  `
};

// Elemento da legenda
const legendControl = L.control({ position: 'bottomright' });

legendControl.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  div.style.background = 'white';
  div.style.padding = '10px';
  div.style.borderRadius = '8px';
  div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  div.innerHTML = '';
  return div;
};

legendControl.addTo(map);

// Atualiza legenda ao adicionar/remover camada
map.on('overlayadd', function (e) {
  if (legends[e.name]) {
    document.querySelector('.legend').innerHTML = legends[e.name];
  }
});

map.on('overlayremove', function (e) {
  if (legends[e.name]) {
    document.querySelector('.legend').innerHTML = '';
  }
});

// Centraliza no local do usuário
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    L.marker([lat, lon]).addTo(map)
      .bindPopup('Você está aqui!')
      .openPopup();
    map.setView([lat, lon], 13);
  });
} else {
  alert("Geolocalização não suportada pelo seu navegador.");
}
