const fs = require('fs'); //para grabar en un archivo de datos

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //leer DB si existe
        this.leerDB();
    }

    //getter
    get paramsMapbox() {
        return {
            //segun solicitud Postman
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    //getter
    get paramsOpenWeather() {
        return {
            //segun solicitud Postman
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    //getter
    get historialCapitalizado() {
        //Capitalizar cada palabra

        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });
    }

    async ciudad(lugar = '') {

        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();
            //retorna los lugares
            //console.log(resp); //data
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            return [];
        }

    }

    async climaLugar(lat, lon) {

        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                //destructurib´ng del getter y anado los parametros adicionales
                params: { ...this.paramsOpenWeather, lat, lon }
            })

            const resp = await instance.get();
            // console.log(resp); //data
            // extarigo los objetos weather y main de la data
            const { weather, main } = resp.data;
            // console.log(weather);

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {
        //Prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        //array de historial con maximo 6 elementos
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();
    }

    guardarDB() {
        const payLoad = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payLoad));
    }

    leerDB() {
        //Debe de existir
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }
        //Cargar info
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        // console.log(data);
        this.historial = data.historial;
    }
}

module.exports = Busquedas;