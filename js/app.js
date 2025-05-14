function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchAirQuality, showError);
    } else {
        alert("Geolocalização não suportada pelo seu navegador.");
    }
}

function showError(error) {
    alert(`Erro ao obter localização: ${error.message}`);
}

function fetchAirQuality(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = "2585b50b7c536c495560c52bddd701d2"; 

    // Exibir a localização na página
    document.getElementById('location').innerHTML = 'Obtendo localização...';

    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // Requisição para obter dados de qualidade do ar e clima
    Promise.all([fetch(airQualityUrl), fetch(weatherUrl)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
            const aqi = data[0].list[0].main.aqi;
            const temperature = data[1].main.temp;
            const airQuality = getAirQuality(aqi);
            
            // Usando Nominatim para geocodificação reversa
            const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

            fetch(reverseGeocodeUrl)
                .then(response => response.json())
                .then(geocodeData => {
                    const cityName = geocodeData.address.city || geocodeData.address.town || geocodeData.address.village || 'Localização desconhecida';
                    
                    // Atualizando a localização na página
                    document.getElementById('location').innerHTML = `Localização: ${cityName}`;

                    // Exibindo os dados de qualidade do ar e temperatura
                    document.getElementById('air-quality').innerHTML = `
                        <p>Qualidade do ar: ${airQuality}</p>
                        <p>Índice de qualidade do ar (AQI): ${aqi} - ${getDescription(aqi)}</p>
                        <p>Temperatura atual: ${temperature}°C</p>
                    `;
                })
                .catch(error => alert("Erro ao obter o nome da cidade."));
        })
        .catch(error => alert("Erro ao obter dados de qualidade do ar e temperatura."));
}

function getAirQuality(aqi) {
    switch (true) {
        case (aqi >= 0 && aqi <= 50):
            return 'Boa';
        case (aqi >= 51 && aqi <= 100):
            return 'Moderada';
        case (aqi >= 101 && aqi <= 150):
            return 'Insalubre para grupos sensíveis';
        case (aqi >= 151 && aqi <= 200):
            return 'Insalubre';
        case (aqi >= 201 && aqi <= 300):
            return 'Perigosa';
        default:
            return 'Desconhecida';
    }
}

function getDescription(aqi) {
    if (aqi >= 0 && aqi <= 50) {
        return "Boa: A qualidade do ar é satisfatória e não representa risco à saúde.";
    } else if (aqi >= 51 && aqi <= 100) {
        return "Moderada: A qualidade do ar é aceitável; pode afetar grupos sensíveis.";
    } else if (aqi >= 101 && aqi <= 150) {
        return "Insalubre para grupos sensíveis: Crianças, idosos e pessoas com doenças respiratórias podem ser afetados.";
    } else if (aqi >= 151 && aqi <= 200) {
        return "Insalubre: A qualidade do ar é prejudicial à saúde para todos.";
    } else if (aqi >= 201 && aqi <= 300) {
        return "Perigosa: A qualidade do ar é muito ruim e afeta a saúde de todos.";
    } else {
        return "Desconhecida";
    }
}

window.onload = getLocation;
