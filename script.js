const apiKey = 'e351e5d13283470991e5d13283f7098f';  
const stationId = 'IPODLE19'; 

function windDirectionFromDegrees(degrees) {
    const directions = ['S', 'SSV', 'SV', 'VSV', 'V', 'VJV', 'JV', 'JJV', 'J', 'JJZ', 'JZ', 'ZJZ', 'Z', 'ZSZ', 'SZ', 'SSZ'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function convertPressure(pressureInHpa, unit) {
    switch (unit) {
        case 'mmHg':
            return (pressureInHpa * 0.75006).toFixed(2);  
        case 'inHg':
            return (pressureInHpa * 0.02953).toFixed(2); 
        default:
            return pressureInHpa.toFixed(2);  
    }
}

function updateWeatherData() {
    const url = `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.observations && data.observations.length > 0) {
                const observation = data.observations[0];  // První záznam

                document.getElementById('teplota').textContent = (observation.metric.temp || '--').toFixed(1);
                document.getElementById('vitr').textContent = (observation.metric.windSpeed || '--').toFixed(1);

                document.getElementById('vlhkost').textContent = observation.humidity || '--';
                document.getElementById('sracky').textContent = observation.metric.precipTotal || '--';

                const windDirection = windDirectionFromDegrees(observation.winddir);
                document.getElementById('smer').textContent = windDirection || '--';

                const selectedUnit = document.getElementById('pressure-unit-select').value;
                const pressureInSelectedUnit = convertPressure(observation.metric.pressure, selectedUnit);
                document.getElementById('tlak').textContent = pressureInSelectedUnit;
                document.getElementById('pressure-unit').textContent = selectedUnit;

            } else {
                console.error('Chyba: Data nejsou dostupná.');
            }
        })
        .catch(error => {
            console.error('Chyba při načítání dat z API:', error);
        });
}

setInterval(updateWeatherData, 30);

document.addEventListener('DOMContentLoaded', updateWeatherData);

document.getElementById('pressure-unit-select').addEventListener('change', updateWeatherData);
