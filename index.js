require('dotenv').config()

const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

//Process = variables de entorno globales de node en mi app
// console.log(process.argv);
// console.log(process.env);
// console.log(process.env.MAPBOX_KEY);


const main = async () => {

    const busquedas = new Busquedas();

    let opt;

    do {
        opt = await inquirerMenu();
        // console.log({ opt });

        switch (opt) {

            case 1:
                //Mostar mensaje xa escribir ciudad
                const termino = await leerInput('Ciudad:');

                //Buscar lugares o ciudades
                const lugares = await busquedas.ciudad(termino);

                //seleccionar el lugar o ciudad
                if (lugares.length === 0) {
                    console.log('Ciudad no encontrada');
                } else {
                    const idSeleccionado = await listarLugares(lugares);

                    if (idSeleccionado === '0') continue;

                    const lugarSeleccionado = lugares.find(lugar => lugar.id === idSeleccionado);

                    //Guardar en DB
                    busquedas.agregarHistorial(lugarSeleccionado.nombre);

                    //Datos del clima
                    const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                    //Mostrar resultados
                    console.clear();
                    console.log('\nINFORMACION DE LA CIUDAD\n'.white);
                    console.log('Ciudad:', lugarSeleccionado.nombre);
                    console.log('Lat:', lugarSeleccionado.lat);
                    console.log('Lng:', lugarSeleccionado.lng);
                    console.log('Temperatura:', clima.temp);
                    console.log('T. Minima:', clima.min);
                    console.log('T. Maxima:', clima.max);
                    console.log('Descripcion:', clima.desc);
                }
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, indice) => {
                    const idx = `${indice + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0)

}

main();