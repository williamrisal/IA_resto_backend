import mongoose from 'mongoose'

/**
 * Schéma pour les commandes
 * Chaque commande appartient à une entreprise spécifique
 * Les commandes d'une entreprise sont isolées des autres
 */
const orderSchema = new mongoose.Schema(
    {
        // Référence OBLIGATOIRE à l'entreprise propriétaire
        entrepriseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entreprise',
            required: [true, 'L\'ID entreprise est requis'],
        },
        // Référence OBLIGATOIRE au client
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: [true, 'L\'ID client est requis'],
        },
        // Type de commande
        type: {
            type: String,
            required: true,
            enum: ['Livraison', 'À emporter'],
        },
        // Informations du client
        customer: {
            name: {
                type: String,
                required: false,
            },
            phone: {
                type: String,
                required: true,
            },
        },
        // Adresse de livraison
        address: {
            street: String,
            city: String,
            zipCode: String,
            country: {
                type: String,
                default: 'France',
            },
        },
        // Articles commandés
        items: [
            {
                menuItemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'MenuItem',
                },
                name: String,
                quantity: Number,
                price: Number,
                subtotal: Number,
            },
        ],
        // Montant total
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        // Statut de la commande
        status: {
            type: String,
            enum: ['En attente', 'En cours', 'Prêt', 'Livré', 'Annulé'],
            default: 'En attente',
        },
        // Statut de paiement
        paymentStatus: {
            type: String,
            enum: ['Impayé', 'Payé', 'Remboursé'],
            default: 'Impayé',
        },
        // Méthode de paiement
        paymentMethod: {
            type: String,
            enum: ['Carte', 'Espèces', 'Chèque'],
            default: 'Carte',
        },
        // Notes de la commande
        notes: {
            type: String,
            trim: true,
        },
        // Heure de livraison estimée
        deliveryTime: {
            type: Date,
        },
    },
    { timestamps: true }
)

/**
 * Index pour améliorer les recherches par entreprise et client
 */
orderSchema.index({ entrepriseId: 1 })
orderSchema.index({ clientId: 1 })
orderSchema.index({ entrepriseId: 1, clientId: 1 })

/**
 * Modèle Order - Gère les commandes
 */
const Order = mongoose.model('Order', orderSchema)

export default Order
