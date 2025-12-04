import mongoose from 'mongoose'

/**
 * Schéma pour les articles du menu
 * Chaque menu appartient à une entreprise spécifique (pizzeria, snack, etc.)
 * Les menus d'une entreprise sont isolés des autres
 */
const menuItemSchema = new mongoose.Schema(
    {
        // Référence OBLIGATOIRE à l'entreprise propriétaire du menu
        entrepriseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entreprise',
            required: [true, 'L\'ID entreprise est requis'],
        },
        // Nom de l'article
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // Catégorie de l'article
        category: {
            type: String,
            required: true,
            enum: ['Pizza', 'Pizzas', 'Pâtes', 'Salade', 'Salades', 'Plats', 'Dessert', 'Desserts', 'Boissons', 'Boisson'],
        },
        // Description de l'article
        description: {
            type: String,
            trim: true,
        },
        // Prix de l'article
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        // Disponibilité
        available: {
            type: Boolean,
            default: true,
        },
        // Temps de préparation en minutes
        preparationTime: {
            type: Number,
            default: 15,
        },
        // URL de l'image
        image: {
            type: String,
        },
    },
    { timestamps: true }
)

/**
 * Index pour améliorer les recherches par entreprise
 */
menuItemSchema.index({ entrepriseId: 1 })

/**
 * Modèle MenuItem - Gère les articles du menu
 */
const MenuItem = mongoose.model('MenuItem', menuItemSchema)

export default MenuItem
