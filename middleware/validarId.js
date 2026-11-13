import mongoose from 'mongoose';

/**
 * Middleware para validar si un parámetro :id es un ObjectId válido de MongoDB
 */
export const validarMongoId = (req, res, next) => {
    const { id } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id) && !id.toUpperCase().startsWith('LOTE-')) {
        return res.status(400).json({
            ok: false,
            msg: `El identificador '${id}' no tiene un formato válido`
        });
    }
    next();
};

export default validarMongoId;
