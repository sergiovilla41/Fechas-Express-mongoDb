// Rutas/rutes.js
const express = require('express');
const router = express.Router();
const festivoController = require('../controllers/festivos-controller');
const { check } = require('express-validator');


/**
 * @swagger
 * /verificar-festivo/{year}/{month}/{day}:
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
router.get('/verificar-festivo/:year/:month/:day', [
  check('year').isInt(),
  check('month').isInt(),
  check('day').isInt(),
], festivoController.verificarFestivo);

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
router.get('/obtener-tipos-festivos', festivoController.obtenerTiposFestivos);

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
// Ruta para obtener la fecha de Semana Santa dado un año
router.get('/semana-santa/:year', festivoController.obtenerInicioSemanaSanta);


module.exports = router;
