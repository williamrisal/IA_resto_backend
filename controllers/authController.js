import Entreprise from '../models/Entreprise.js'
import jwt from 'jsonwebtoken'

/**
 * Générer un JWT token pour l'entreprise
 * @param {String} id - L'ID de l'entreprise
 * @returns {String} Token JWT
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d', // Le token expire après 7 jours
    })
}

/**
 * Contrôleur d'authentification
 */
const authController = {
    /**
     * Enregistrer une nouvelle entreprise
     * POST /api/auth/register
     */
    register: async (req, res) => {
        try {
            const { name, email, password, phone, address, city, postalCode } = req.body

            // Vérifier que tous les champs sont remplis
            if (!name || !email || !password || !phone || !address || !city || !postalCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs sont requis',
                })
            }

            // Vérifier si l'entreprise existe déjà
            const entrepriseExistante = await Entreprise.findOne({ email })
            if (entrepriseExistante) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà',
                })
            }

            // Créer la nouvelle entreprise
            const entreprise = await Entreprise.create({
                name,
                email,
                password,
                phone,
                address,
                city,
                postalCode,
            })

            // Générer le token
            const token = generateToken(entreprise._id)

            res.status(201).json({
                success: true,
                message: 'Entreprise créée avec succès',
                token,
                entreprise: {
                    id: entreprise._id,
                    name: entreprise.name,
                    email: entreprise.email,
                    phone: entreprise.phone,
                },
            })
        } catch (error) {
            console.error('❌ Erreur register:', error.message)
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du compte',
                error: error.message,
            })
        }
    },

    /**
     * Connexion d'une entreprise
     * POST /api/auth/login
     */
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            // Vérifier que email et password sont fournis
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email et mot de passe requis',
                })
            }

            // Chercher l'entreprise (select('+password') pour inclure le password)
            const entreprise = await Entreprise.findOne({ email }).select('+password')

            if (!entreprise) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect',
                })
            }

            // Vérifier le password
            const passwordValide = await entreprise.comparePassword(password)

            if (!passwordValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect',
                })
            }

            // Générer le token
            const token = generateToken(entreprise._id)

            res.status(200).json({
                success: true,
                message: 'Connecté avec succès',
                token,
                entreprise: {
                    id: entreprise._id,
                    name: entreprise.name,
                    email: entreprise.email,
                    phone: entreprise.phone,
                    address: entreprise.address,
                    city: entreprise.city,
                    postalCode: entreprise.postalCode,
                },
            })
        } catch (error) {
            console.error('❌ Erreur login:', error.message)
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                error: error.message,
            })
        }
    },

    /**
     * Vérifier le token et obtenir l'entreprise actuelle
     * GET /api/auth/me
     */
    verifyToken: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token manquant',
                })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
            const entreprise = await Entreprise.findById(decoded.id).populate('menus clients commandes')

            if (!entreprise) {
                return res.status(404).json({
                    success: false,
                    message: 'Entreprise non trouvée',
                })
            }

            res.status(200).json({
                success: true,
                entreprise: {
                    id: entreprise._id,
                    name: entreprise.name,
                    email: entreprise.email,
                    phone: entreprise.phone,
                    address: entreprise.address,
                    city: entreprise.city,
                    postalCode: entreprise.postalCode,
                    menus: entreprise.menus,
                    clients: entreprise.clients,
                    commandes: entreprise.commandes,
                },
            })
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token invalide',
                })
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expiré',
                })
            }
            console.error('❌ Erreur verifyToken:', error.message)
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la vérification',
                error: error.message,
            })
        }
    },

    /**
     * Logout (simplement supprimer le token côté client)
     * POST /api/auth/logout
     */
    logout: (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Déconnecté avec succès',
        })
    },
}

export default authController
