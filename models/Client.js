import mongoose from 'mongoose'

/**
 * Schéma Client - Représente un client d'une entreprise
 * Chaque client appartient à une entreprise spécifique (pizzeria, snack, etc.)
 * Les clients d'une entreprise sont isolés des autres
 */
const clientSchema = new mongoose.Schema(
    {
        // Référence OBLIGATOIRE à l'entreprise propriétaire
        entrepriseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entreprise',
            required: [true, 'L\'ID entreprise est requis'],
        },
        // Numéro de commande/client
        orderNumber: {
            type: String,
            required: [true, 'Le numéro de commande est requis'],
        },
        // Numéro de téléphone
        phoneNumber: {
            type: String,
            required: [true, 'Le téléphone est requis'],
        },
        // Nom complet du client
        name: {
            type: String,
            required: [true, 'Le nom est requis'],
            trim: true,
        },
        // Adresse de livraison
        address: {
            type: String,
            required: [true, 'L\'adresse est requise'],
        },
        // Ville
        city: {
            type: String,
            required: [true, 'La ville est requise'],
        },
        // Code postal
        postalCode: {
            type: String,
            required: [true, 'Le code postal est requis'],
        },
        // Numéro de rue
        houseNumber: {
            type: String,
        },
        // Étage/Appartement
        apartment: {
            type: String,
        },
        // Notes de livraison (instructions spéciales)
        deliveryNotes: {
            type: String,
            default: '',
        },
        // Statut du client
        status: {
            type: String,
            enum: ['Actif', 'Inactif', 'Bloqué'],
            default: 'Actif',
        },
        // Nombre de commandes
        orderCount: {
            type: Number,
            default: 0,
        },
        // Dépense totale
        totalSpent: {
            type: Number,
            default: 0,
        },
        // Dernier achat
        lastOrderDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

/**
 * Index pour améliorer les recherches par entreprise
 */
clientSchema.index({ entrepriseId: 1 })

/**
 * Modèle Client
 */
const Client = mongoose.model('Client', clientSchema)

export default Client
