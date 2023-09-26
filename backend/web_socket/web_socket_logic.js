const { DateTime } = require('luxon');
const {invernadero1Model} = require('../models');
const {invernadero2Model} = require('../models');
const {invernadero3Model} = require('../models');

temperatura1Dato = 0;
humedad1Dato = 0;
co2_1Dato = 0;
fecha1Dato = "";

temperatura2Dato = 0;
humedad2Dato = 0;
co2_2Dato = 0;
fecha2Dato = "";

temperatura3Dato = 0;
humedad3Dato = 0;
co2_3Dato = 0;
fecha3Dato = "";

// Función para obtener el último registro de invernadero1
async function getLastInvernadero1() {
  try {
    const ultimoRegistro = await invernadero1Model
      .findOne()
      .sort({ timestamp: -1 }); // Ordena de manera descendente por el campo timestamp

    if (!ultimoRegistro) {
      return res.status(404).json({ error: 'No se encontraron registros.' });
    }

    const {
      temperatura1,
      humedad1,
      co2_1,
      fecha1
    } = ultimoRegistro;

    console.log(ultimoRegistro);

    return {
      temperatura1,
      humedad1,
      co2_1,
      fecha1
    };
  } catch (error) {
    console.error('Error al obtener el último registro de invernadero1:', error);
    return null;
  }
}

// Función para obtener el último registro de invernadero2
async function getLastInvernadero2() {
  try {
    const ultimoRegistro = await invernadero2Model.findOne({}).sort({ _id: -1 });

    if (!ultimoRegistro) {
      console.log('No se encontraron registros en invernadero2');
      return null;
    }

    const {
      temperatura2,
      humedad2,
      co2_2,
      fecha2
    } = ultimoRegistro;
    

    return {
      temperatura2,
      humedad2,
      co2_2,
      fecha2
    };
  } catch (error) {
    console.error('Error al obtener el último registro de invernadero2:', error);
    return null;
  }
}

// Función para obtener el último registro de invernadero1
async function getLastInvernadero3() {
  try {
    const ultimoRegistro = await invernadero3Model.findOne({}).sort({ _id: -1 });

    if (!ultimoRegistro) {
      console.log('No se encontraron registros en invernadero3');
      return null;
    }

    const {
      temperatura3,
      humedad3,
      co2_3,
      fecha3
    } = ultimoRegistro;

    return {
      temperatura3,
      humedad3,
      co2_3,
      fecha3
    };
  } catch (error) {
    console.error('Error al obtener el último registro de invernadero3:', error);
    return null;
  }
}

// Función para enviar datos al cliente cada segundo
async function sendRandomData(connection) {
  try {
    const [
      invernadero1Data,
      invernadero2Data,
      invernadero3Data
    ] = await Promise.all([
      getLastInvernadero1(),
      getLastInvernadero2(),
      getLastInvernadero3()
    ]);

    if (invernadero1Data) {
      const {
        temperatura1,
        humedad1,
        co2_1,
        fecha1
      } = invernadero1Data;

      temperatura1Dato = temperatura1;
      humedad1Dato = humedad1;
      co2_1Dato = co2_1;
      fecha1Dato = fecha1;
    }

    if (invernadero2Data) {
      const {
        temperatura2,
        humedad2,
        co2_2,
        fecha2
      } = invernadero2Data;

      temperatura2Dato = temperatura2;
      humedad2Dato = humedad2;
      co2_2Dato = co2_2;
      fecha2Dato = fecha2;
    }

    if (invernadero3Data) {
      const {
        temperatura3,
        humedad3,
        co2_3,
        fecha3
      } = invernadero3Data;

      temperatura3Dato = temperatura3;
      humedad3Dato = humedad3;
      co2_3Dato = co2_3;
      fecha3Dato = fecha3;
    }

    const data = {
      temperatura1: temperatura1Dato,
      humedad1: humedad1Dato,
      co2_1: co2_1Dato,
      fechaInvernadero1: fecha1Dato,

      temperatura2: temperatura2Dato,
      humedad2: humedad2Dato,
      co2_2: co2_2Dato,
      fechaInvernadero2: fecha2Dato,

      temperatura3: temperatura3Dato,
      humedad3: humedad3Dato,
      co2_3: co2_3Dato,
      fechaInvernadero3: fecha3Dato,
    };

    console.log(data);

    // Serializar el objeto a JSON
    const json_data = JSON.stringify(data);

    // Enviar los datos al cliente en formato JSON
    connection.sendUTF(json_data);
  } catch (error) {
    console.error('Error al enviar datos al cliente:', error);
  }
}

module.exports = { sendRandomData };
