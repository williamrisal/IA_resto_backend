import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * Schéma Entreprise - Représente un restaurant/pizzeria/snack
 * Chaque entreprise a ses propres menus, clients et commandes
 */
const entrepriseSchema = new mongoose.Schema(
    {
        // Nom de l'entreprise
        name: {
            type: String,
            required: [true, 'Le nom de l\'entreprise est requis'],
            trim: true,
        },
        // Email de contact (utilisé pour le login)
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
            lowercase: true,
        },
        // Mot de passe hashé (utilisé pour l'authentification)
        password: {
            type: String,
            required: [true, 'Le mot de passe est requis'],
            minlength: 6,
            select: false, // N'inclure le password que si explicitement demandé
        },
        // Numéro de téléphone
        phone: {
            type: String,
            required: [true, 'Le téléphone est requis'],
        },
        // Adresse complète
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
        // Pays
        country: {
            type: String,
            default: 'France',
        },
        // Devise
        currency: {
            type: String,
            default: 'EUR',
        },
        // Fuseau horaire
        timezone: {
            type: String,
            default: 'Europe/Paris',
        },
        // Logo/Image de l'entreprise
        logo: {
            type: String,
            default: null,
        },
        // Description
        description: {
            type: String,
            default: '',
        },
        // Statut actif/inactif
        isActive: {
            type: Boolean,
            default: true,
        },
        // Références aux collections propres à cette entreprise
        // Ces collections sont isolées par entreprise
        menus: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
            },
        ],
        clients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client',
            },
        ],
        commandes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
    },
    {
        timestamps: true,
    }
)

/**
 * Middleware pre-save pour hasher le password
 * S'exécute avant chaque save si le password a été modifié
 */
entrepriseSchema.pre('save', async function (next) {
    // Si le password n'a pas été modifié, on continue
    if (!this.isModified('password')) {
        next()
    }

    // Générer un salt et hasher le password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

/**
 * Méthode pour comparer les passwords
 * @param {String} passwordEntré - Le password saisi par l'utilisateur
 * @returns {Boolean} true si les passwords correspondent
 */
entrepriseSchema.methods.comparePassword = async function (passwordEntré) {
    return await bcrypt.compare(passwordEntré, this.password)
}

/**
 * Modèle Entreprise
 */
const Entreprise = mongoose.model('Entreprise', entrepriseSchema)

export default Entreprise

