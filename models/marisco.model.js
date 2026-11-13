import mongoose from 'mongoose';

const mariscoSchema = new mongoose.Schema(
    {
        codigoLote: {
            type: String,
            required: [true, 'El código de lote es obligatorio (ej: LOTE-ESM-001)'],
            unique: true,
            uppercase: true,
            trim: true
        },
        producto: {
            type: String,
            required: [true, 'El nombre del marisco/producto es obligatorio'],
            trim: true
            // Ej: "Camarón Pomada", "Camarón Blanco", "Concha Prieta", "Corvina de Roca", "Picudo Blanco"
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: {
                values: ['Crustáceos', 'Moluscos', 'Peces', 'Cefalópodos'],
                message: '{VALUE} no es una categoría válida (Crustáceos, Moluscos, Peces, Cefalópodos)'
            },
            default: 'Crustáceos'
        },
        embarcacion: {
            type: String,
            required: [true, 'El nombre de la embarcación pesquera artesanal es obligatorio'],
            trim: true
            // Ej: "Don Paco IV", "Niño Jesús", "Virgen del Carmen"
        },
        pescadorResponsable: {
            type: String,
            required: [true, 'El nombre del pescador artesanal responsable es obligatorio'],
            trim: true
        },
        puertoOrigen: {
            type: String,
            default: 'Puerto Pesquero Artesanal de Esmeraldas',
            trim: true
        },
        pesoKg: {
            type: Number,
            required: [true, 'El peso en kilogramos es obligatorio'],
            min: [0.1, 'El peso debe ser de al menos 0.1 kg']
        },
        precioKilo: {
            type: Number,
            required: [true, 'El precio por kilo en USD es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },
        calidad: {
            type: String,
            enum: {
                values: ['Primera', 'Segunda', 'Exportación'],
                message: '{VALUE} no es un grado de calidad válido'
            },
            default: 'Exportación'
        },
        destino: {
            type: String,
            enum: {
                values: [
                    'Local (Esmeraldas)',
                    'Nacional (Quito/Guayaquil)',
                    'Exportación (EE.UU./UE)'
                ],
                message: '{VALUE} no es un destino válido'
            },
            default: 'Exportación (EE.UU./UE)'
        },
        temperaturaAlmacenamiento: {
            type: Number,
            default: -18 // Grados Celsius (cadena de frío para exportación)
        },
        estado: {
            type: String,
            enum: {
                values: ['Recibido en Muelle', 'En Inspección', 'Empacado', 'Distribuido', 'Cancelado'],
                message: '{VALUE} no es un estado válido'
            },
            default: 'Recibido en Muelle'
        },
        observaciones: {
            type: String,
            default: 'Inspección de sanidad y trazabilidad aprobada en muelle.',
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Virtual para calcular valor total del lote
mariscoSchema.virtual('valorTotalUSD').get(function () {
    if (this.pesoKg && this.precioKilo) {
        return Number((this.pesoKg * this.precioKilo).toFixed(2));
    }
    return 0;
});

mariscoSchema.set('toJSON', { virtuals: true });
mariscoSchema.set('toObject', { virtuals: true });

const Marisco = mongoose.model('Marisco', mariscoSchema);

export default Marisco;
