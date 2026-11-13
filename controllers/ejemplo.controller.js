import * as mariscosController from './mariscos.controller.js';

// Mantiene compatibilidad de funciones exportadas
export const getAllEjemplos = mariscosController.getAllMariscos;
export const getEjemploById = mariscosController.getMariscoById;
export const postEjemplo = mariscosController.createMarisco;
export const putEjemplo = mariscosController.updateMarisco;
export const deleteEjemplo = mariscosController.deleteMarisco;
export const seedMariscos = mariscosController.seedMariscos;

export default mariscosController;
