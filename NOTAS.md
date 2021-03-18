# Inicio
- >npm init -y (creo package.json)
- >npm start or >node index
- >npm install colors
- >npm install inquirer 
## Realizar peticiones HTTP desde Node
- https://www.npmjs.com/package/axios
- >npm install axios
- ir busquedas.js
  const axios = require('axios');
## Buscar ubicaciones geograficas con Mapbox y Geocoding (API)
- https://www.mapbox.com/
  crear cuenta Mapbox
  Tokens/create Token
  Guardar token (api_key) en archivo .env
- https://docs.mapbox.com/api/search/geocoding/
  Geocoding API PLAYGROUND ->
  Type filtering: out
  limit: 5 respuestas
  Language: spanish
  Search
  OJO (arriba drch) = Raw API Request (copiar) - url
- Ir Postman, cambiar api_key en access_token y probar
- Copiar toda url y pegar en busquedas.js
## Paquete .env para asignar nuevas variables de entorno en mi app
- >npm install dotenv
- En index -> require('dotenv').config()
- NO se suben a GITHUB, se sube un archivo example.env sin tokens o passwords!!!
## Informacion del clima por Geolocalizacion (lat, lng)
- OpenWeather
- https://openweathermap.org/
  crear cuenta Mapbox
  API Keys/create key
  Guardar token (key) en archivo .env
  API/Current Weather Data (API doc)/ Call current weather data By geographic coordinates
  API call:
  url= api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric&lang=es