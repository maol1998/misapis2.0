import mongoose from 'mongoose';
import Marisco from '../models/marisco.model.js';

// Datos iniciales de pesca artesanal representativos de Esmeraldas
const lotesSemilla = [
    {
        codigoLote: 'LOTE-ESM-001',
        producto: 'Camarón Pomada de Exportación',
        categoria: 'Crustáceos',
        embarcacion: 'Don Paco IV',
        pescadorResponsable: 'Carlos Tenorio Quiñónez',
        puertoOrigen: 'Puerto Pesquero Artesanal de Esmeraldas',
        pesoKg: 450.5,
        precioKilo: 6.80,
        calidad: 'Exportación',
        destino: 'Exportación (EE.UU./UE)',
        temperaturaAlmacenamiento: -18,
        estado: 'Empacado',
        observaciones: 'Calibre seleccionado para congelación rápida I.Q.F. con destino a Miami.'
    },
    {
        codigoLote: 'LOTE-ESM-002',
        producto: 'Concha Prieta de Manglar (Anadara tuberculosa)',
        categoria: 'Moluscos',
        embarcacion: 'Virgen del Carmen',
        pescadorResponsable: 'Edison Mina Arroyo',
        puertoOrigen: 'Puerto Pesquero Artesanal de Esmeraldas',
        pesoKg: 180.0,
        precioKilo: 4.50,
        calidad: 'Primera',
        destino: 'Nacional (Quito/Guayaquil)',
        temperaturaAlmacenamiento: 4,
        estado: 'En Inspección',
        observaciones: 'Procedente de recolectores artesanales de manglar. Talla mínima reglamentaria cumplida.'
    },
    {
        codigoLote: 'LOTE-ESM-003',
        producto: 'Corvina de Roca Entera',
        categoria: 'Peces',
        embarcacion: 'Niño Jesús de Praga',
        pescadorResponsable: 'Segundo Batioja Valencia',
        puertoOrigen: 'Puerto Pesquero Artesanal de Esmeraldas',
        pesoKg: 320.0,
        precioKilo: 5.25,
        calidad: 'Exportación',
        destino: 'Exportación (EE.UU./UE)',
        temperaturaAlmacenamiento: -18,
        estado: 'Empacado',
        observaciones: 'Eviscerada y lavada en planta procesadora del muelle pesquero.'
    },
    {
        codigoLote: 'LOTE-ESM-004',
        producto: 'Picudo Blanco en Tronchos Fresco',
        categoria: 'Peces',
        embarcacion: 'La Perla del Pacífico',
        pescadorResponsable: 'Julio Estupiñán Caicedo',
        puertoOrigen: 'Puerto Pesquero Artesanal de Esmeraldas',
        pesoKg: 280.0,
        precioKilo: 7.50,
        calidad: 'Primera',
        destino: 'Nacional (Quito/Guayaquil)',
        temperaturaAlmacenamiento: 0,
        estado: 'Distribuido',
        observaciones: 'Despachado en camión isotérmico hacia la cadena de distribución en Quito.'
    },
    {
        codigoLote: 'LOTE-ESM-005',
        producto: 'Langostino Real del Pacífico',
        categoria: 'Crustáceos',
        embarcacion: 'El Isleño II',
        pescadorResponsable: 'Manuel Nazareno Reascos',
        puertoOrigen: 'Puerto Pesquero Artesanal de Esmeraldas',
        pesoKg: 150.0,
        precioKilo: 11.00,
        calidad: 'Exportación',
        destino: 'Exportación (EE.UU./UE)',
        temperaturaAlmacenamiento: -22,
        estado: 'Recibido en Muelle',
        observaciones: 'Lote de alta gama con control estricto de frescura en cámara frigorífica.'
    }
];

/**
 * GET /api/mariscos
 * Obtiene todos los lotes de mariscos con opción de filtrado
 */
export const getAllMariscos = async (req, res) => {
    try {
        const { categoria, destino, estado, calidad, buscar } = req.query;
        const filtro = {};

        if (categoria) filtro.categoria = categoria;
        if (destino) filtro.destino = destino;
        if (estado) filtro.estado = estado;
        if (calidad) filtro.calidad = calidad;
        if (buscar) {
            filtro.$or = [
                { producto: { $regex: buscar, $options: 'i' } },
                { codigoLote: { $regex: buscar, $options: 'i' } },
                { embarcacion: { $regex: buscar, $options: 'i' } },
                { pescadorResponsable: { $regex: buscar, $options: 'i' } }
            ];
        }

        let mariscos = await Marisco.find(filtro).sort({ createdAt: -1 });

        // Si la base de datos está totalmente vacía, cargamos los datos semilla automáticamente
        if (mariscos.length === 0 && Object.keys(filtro).length === 0) {
            console.log('Colección vacía. Sembrando lotes iniciales de Esmeraldas...'.cyan);
            mariscos = await Marisco.insertMany(lotesSemilla);
        }

        return res.status(200).json({
            ok: true,
            empresa: 'Distribuidora y Exportadora de Mariscos "El Puerto" - Esmeraldas',
            puerto: 'Puerto Pesquero Artesanal de Esmeraldas',
            total: mariscos.length,
            mariscos
        });
    } catch (error) {
        console.error('Error al obtener lotes de mariscos:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno al obtener los lotes de mariscos',
            error: error.message
        });
    }
};

/**
 * GET /api/mariscos/:id
 * Obtiene un lote por su ID de MongoDB o por su código de lote (ej: LOTE-ESM-001)
 */
export const getMariscoById = async (req, res) => {
    const { id } = req.params;

    try {
        let marisco = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            marisco = await Marisco.findById(id);
        }

        // Si no se encontró por ObjectId, buscar por código de lote
        if (!marisco) {
            marisco = await Marisco.findOne({ codigoLote: id.toUpperCase().trim() });
        }

        if (!marisco) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró ningún lote de marisco con el identificador: ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            marisco
        });
    } catch (error) {
        console.error('Error al obtener el lote:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al buscar el lote de marisco',
            error: error.message
        });
    }
};

/**
 * POST /api/mariscos
 * Registra un nuevo lote de pesca artesanal que ingresa al puerto
 */
export const createMarisco = async (req, res) => {
    try {
        const data = req.body;

        // Si no viene código de lote, generar uno con prefijo de Esmeraldas
        if (!data.codigoLote) {
            const count = await Marisco.countDocuments();
            data.codigoLote = `LOTE-ESM-${String(count + 1).padStart(3, '0')}`;
        }

        const nuevoLote = new Marisco(data);
        await nuevoLote.save();

        return res.status(201).json({
            ok: true,
            msg: 'Lote de marisco registrado exitosamente en el Puerto de Esmeraldas',
            marisco: nuevoLote
        });
    } catch (error) {
        // Manejo de código de lote duplicado (MongoDB 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                msg: `El código de lote '${req.body.codigoLote}' ya existe. Debe ser único.`
            });
        }

        // Errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                msg: 'Error de validación en los datos del lote',
                errores
            });
        }

        console.error('Error al registrar lote:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al registrar el lote de marisco',
            error: error.message
        });
    }
};

/**
 * PUT /api/mariscos/:id
 * Actualiza la información de un lote (peso, precio, estado de procesamiento, destino)
 */
export const updateMarisco = async (req, res) => {
    const { id } = req.params;

    try {
        let filtro = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            filtro = { _id: id };
        } else {
            filtro = { codigoLote: id.toUpperCase().trim() };
        }

        const loteActualizado = await Marisco.findOneAndUpdate(filtro, req.body, {
            new: true,
            runValidators: true
        });

        if (!loteActualizado) {
            return res.status(404).json({
                ok: false,
                msg: `Lote de marisco no encontrado para actualizar: ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Lote de marisco actualizado exitosamente',
            marisco: loteActualizado
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                msg: 'Error de validación al actualizar',
                errores
            });
        }

        console.error('Error al actualizar el lote:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el lote de marisco',
            error: error.message
        });
    }
};

/**
 * DELETE /api/mariscos/:id
 * Elimina un lote del registro
 */
export const deleteMarisco = async (req, res) => {
    const { id } = req.params;

    try {
        let filtro = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            filtro = { _id: id };
        } else {
            filtro = { codigoLote: id.toUpperCase().trim() };
        }

        const loteEliminado = await Marisco.findOneAndDelete(filtro);

        if (!loteEliminado) {
            return res.status(404).json({
                ok: false,
                msg: `Lote de marisco no encontrado para eliminar: ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Lote de marisco eliminado del sistema exitosamente',
            marisco: loteEliminado
        });
    } catch (error) {
        console.error('Error al eliminar lote:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el lote de marisco',
            error: error.message
        });
    }
};

/**
 * GET /api/mariscos/seed
 * Recarga los datos de prueba de lotes de Esmeraldas
 */
export const seedMariscos = async (req, res) => {
    try {
        await Marisco.deleteMany({});
        const insertados = await Marisco.insertMany(lotesSemilla);

        return res.status(200).json({
            ok: true,
            msg: 'Lotes de pesca artesanal sembrados exitosamente para Distribuidora "El Puerto" (Esmeraldas)',
            total: insertados.length,
            lotes: insertados
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al sembrar lotes iniciales',
            error: error.message
        });
    }
};
