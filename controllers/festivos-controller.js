const connectToDatabase = require('../Config/mongodb');
const fechas = require('../Services/fechas');

/**
 * @swagger
 * /obtener-tipos-festivos:
 *   get:
 *     summary: Obtener todos los tipos de festivos.
 *     responses:
 *       '200':
 *         description: Tipos de festivos obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tiposFestivos:
 *                   type: array
 *                   description: Lista de tipos de festivos.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del tipo de festivo.
 *                       id:
 *                         type: integer
 *                         description: ID del tipo de festivo.
 *                       tipo:
 *                         type: string
 *                         description: Tipo de festivo.
 *                       modoCalculo:
 *                         type: string
 *                         description: Modo de cálculo del festivo.
 *                       festivos:
 *                         type: array
 *                         description: Lista de festivos del tipo.
 *                         items:
 *                           type: object
 *                           properties:
 *                             dia:
 *                               type: integer
 *                               description: Día del festivo.
 *                             mes:
 *                               type: integer
 *                               description: Mes del festivo.
 *                             nombre:
 *                               type: string
 *                               description: Nombre del festivo.
 */
// Primera ruta para obtener tipos de festivos
exports.verificarFestivo = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    // Verificar si la fecha es válida
    const fecha = new Date(year, month - 1, day);
    if (isNaN(fecha) || fecha.getMonth() + 1 !== parseInt(month) || fecha.getDate() !== parseInt(day)) {
      return res.status(400).json({ error: 'Fecha no válida' });
    }

    // Establecer la conexión a la base de datos
    const db = await connectToDatabase();

    // Obtener los festivos de la base de datos
    const tiposFestivos = await db.collection('tipos').find({}).toArray();

    // Determinar si la fecha es festiva
    let nombreFestivo = null;
    let nuevaFecha = null;

    for (const tipo of tiposFestivos) {
      switch (tipo.id) {
        case 1: // Código para calcular los festivos fijos
          for (const festivo of tipo.festivos) {
            const festivoFecha = new Date(year, festivo.mes - 1, festivo.dia);
            if (festivoFecha.getTime() === fecha.getTime()) {
              nombreFestivo = festivo.nombre;
              break;
            }
          }
          break;
        case 2: // Código para calcular los festivos de la tabla id=2
          for (const festivo of tipo.festivos) {
            const festivoFecha = new Date(year, festivo.mes - 1, festivo.dia);
            if (festivoFecha.getTime() === fecha.getTime()) {
              nombreFestivo = festivo.nombre;
              // Si el festivo se traslada al siguiente lunes
              if (tipo.modoCalculo === 'Se traslada la fecha al siguiente lunes') {
                const diaSemana = festivoFecha.getDay();
                if (diaSemana !== 1) { // Si no es lunes
                  nuevaFecha = fechas.obtenerSiguienteLunes(festivoFecha);
                }
              }
              break;
            }
          }
          break;
        case 3: // Código para calcular los festivos de la tabla id=3
          const tiposFestivosSemanaSanta = await db.collection('tipos').findOne({ id: 3 });

          if (!tiposFestivosSemanaSanta) {
            return res.status(404).json({ error: 'No se encontraron festivos de Semana Santa en la base de datos' });
          }

          for (const festivo of tiposFestivosSemanaSanta.festivos) {
            const fechaPascua = fechas.calcularDomingoPascua(parseInt(year));
            const fechaFestivo = fechas.agregarDias(fechaPascua, festivo.diasPascua + 7);

            if (fecha.getFullYear() === fechaFestivo.getFullYear() && fecha.getMonth() === fechaFestivo.getMonth() && fecha.getDate() === fechaFestivo.getDate()) {
              nombreFestivo = festivo.nombre;
              break;
            }
          }
          break;
        case 4: // Código para calcular los festivos de la tabla id=4
          for (const festivo of tipo.festivos) {
            const fechaPascua = fechas.calcularDomingoPascua(parseInt(year));
            const fechaFestivo = fechas.agregarDias(fechaPascua, festivo.diasPascua + 7);
            nuevaFecha = fechas.obtenerSiguienteLunes(fechaFestivo);
            if (new Date(nuevaFecha).getTime() === fecha.getTime()) {
              nombreFestivo = festivo.nombre;
              break;
            }
          }
          break;
      }
      if (nombreFestivo) {
        break;
      }
    }

    // Preparar el mensaje personalizado
    let mensaje = '';
    if (nombreFestivo) {
      mensaje = `¡La fecha ${year}-${month}-${day} corresponde a un día festivo (${nombreFestivo})!`;
    } else {
      mensaje = `La fecha ${year}-${month}-${day} no corresponde a un día festivo.`;
    }

    // Preparar la respuesta JSON
    const respuesta = {

      Mensaje: mensaje
    };

    // Agregar la nueva fecha si se ha calculado
    if (nombreFestivo && nuevaFecha) {
      respuesta.NuevaFecha = nuevaFecha.toISOString().split('T')[0];
    }

    res.json(respuesta);
  } catch (error) {
    console.error('Error al verificar si es festivo:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};
/**
 * @swagger
 *  /verificar-festivo/{year}/{month}/{day}:
 *   get:
 *     summary: Verificar si una fecha es festiva y obtener información adicional.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         description: Año de la fecha a verificar.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         description: Mes de la fecha a verificar.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: day
 *         required: true
 *         description: Día de la fecha a verificar.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Información sobre la fecha proporcionada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: La fecha proporcionada.
 *                 esFestivo:
 *                   type: boolean
 *                   description: Indica si la fecha es festiva o no.
 *                 nombreFestivo:
 *                   type: string
 *                   description: El nombre del festivo si la fecha es festiva.
 *                 nuevaFecha:
 *                   type: string
 *                   format: date
 *                   description: La nueva fecha calculada si la fecha es festiva y se traslada.
 *       '400':
 *         description: Fecha no válida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 */
// Ruta para verificar si una fecha es festiva y obtener información adicional

exports.verificarFestivo = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    // Verificar si la fecha es válida
    const fecha = new Date(year, month - 1, day);
    if (isNaN(fecha) || fecha.getMonth() + 1 !== parseInt(month) || fecha.getDate() !== parseInt(day)) {
      return res.status(400).json({ error: 'Fecha no válida' });
    }

    // Establecer la conexión a la base de datos
    const db = await connectToDatabase();

    // Obtener los festivos de la base de datos
    const tiposFestivos = await db.collection('tipos').find({}).toArray();

    // Determinar si la fecha es festiva
    let nombreFestivo = null;
    let trasladarAlLunes = false;
    let nuevaFecha = null; // Inicializar la variable nuevaFecha aquí
    for (const tipo of tiposFestivos) {
      if (tipo.id === 3) {
        // Código para calcular los festivos de Semana Santa
      } else if (tipo.id === 4) {
        // Código para calcular los festivos de la tabla id=4
      } else if (tipo.id === 2) {
        // Código para calcular los festivos de la tabla id=2
        for (const festivo of tipo.festivos) {
          const festivoFecha = new Date(year, festivo.mes - 1, festivo.dia);
          if (
            festivoFecha.getFullYear() === fecha.getFullYear() &&
            festivoFecha.getMonth() === fecha.getMonth() &&
            festivoFecha.getDate() === fecha.getDate()
          ) {
            nombreFestivo = festivo.nombre;
            // Si el festivo se traslada al siguiente lunes
            if (tipo.modoCalculo === 'Se traslada la fecha al siguiente lunes') {
              const diaSemana = festivoFecha.getDay();
              if (diaSemana !== 1) { // Si no es lunes
                trasladarAlLunes = true;
              }
              nuevaFecha = trasladarAlLunes ? fechas.obtenerSiguienteLunes(festivoFecha) : null;
            }
            break;
          }
        }
      } else {
        // Código para calcular otros tipos de festivos
      }
      if (nombreFestivo) {
        break;
      }
    }

    // Calcular el inicio de la Semana Santa (Domingo de Ramos)
    const domingoRamos = fechas.calcularDomingoPascua(parseInt(year));

    // Si la fecha actual es el Domingo de Ramos, establecerlo como festivo
    if (
      domingoRamos.getFullYear() === fecha.getFullYear() &&
      domingoRamos.getMonth() === fecha.getMonth() &&
      domingoRamos.getDate() === fecha.getDate()
    ) {
      nombreFestivo = 'Inicio Semana Santa - Domingo de Ramos';
    }

    // Preparar el mensaje personalizado
    let mensaje = '';
    if (nombreFestivo) {
      mensaje = `¡La fecha ${year}-${month}-${day} corresponde a un día festivo (${nombreFestivo})!`;
    } else {
      mensaje = `La fecha ${year}-${month}-${day} no corresponde a un día festivo.`;
    }
    
    if (nuevaFecha) {
      nuevaFechaFormateada = nuevaFecha instanceof Date ? nuevaFecha.toISOString().split('T')[0] : nuevaFecha;
    }

    res.json(mensaje);
  } catch (error) {
    console.error('Error al verificar si es festivo:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};


/**
 * @swagger
 * tags:
 *   name: Semana Santa
 *   description: Operaciones relacionadas con la fecha de Semana Santa
 */

/**
 * @swagger
 * /semana-santa/{year}:
 *   get:
 *     summary: Obtener la fecha de Semana Santa para un año específico.
 *     tags: [Semana Santa]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         description: Año para el cual se desea obtener la fecha de Semana Santa.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Fecha de Semana Santa obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fechaSemanaSanta:
 *                   type: string
 *                   format: date
 *                   description: La fecha de Semana Santa para el año especificado.
 *       '400':
 *         description: Año no válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 */
// Controlador para obtener la fecha de Semana Santa dado un año
exports.obtenerInicioSemanaSanta = async (req, res) => {
  try {
    const { year } = req.params;

    // Verificar si el año es válido
    if (isNaN(year) || parseInt(year) < 1000 || parseInt(year) > 9999) {
      return res.status(400).json({ error: 'Año no válido' });
    }

    // Calcular la fecha de inicio de Semana Santa utilizando la función del módulo fechas
    const inicioSemanaSanta = fechas.calcularDomingoPascua(parseInt(year));

    // Preparar la respuesta
    const respuesta = {
      inicioSemanaSanta: inicioSemanaSanta.toISOString().slice(0, 10) // Convertir la fecha a formato ISO y obtener solo la parte de la fecha (sin la hora)
    };

    res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener el inicio de Semana Santa:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
};