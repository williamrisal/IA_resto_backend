import Order from '../models/Order.js'
import Client from '../models/Client.js'
import { sendConfirmationSMS, SendSmS } from '../controllers/smsController.js'
import twilio from 'twilio'

/**
 * Contrôleur pour la gestion des commandes
 */

/**
 * Récupère toutes les commandes
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('items.menuItemId')
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes',
            error: error.message,
        })
    }
}

/**
 * Récupère une commande par ID
 */
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.menuItemId')
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée',
            })
        }
        res.status(200).json({
            success: true,
            data: order,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la commande',
            error: error.message,
        })
    }
}

/**
 * Crée une nouvelle commande
 */
export const createOrder = async (req, res) => {
    try {
        const { phoneNumber, entrepriseId } = req.body

        // Vérifier que le numéro de téléphone est fourni
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Le numéro de téléphone est requis',
            })
        }
        console.log('📞 Numéro de téléphone reçu:', phoneNumber)

        // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
        const cleanPhone = phoneNumber.replace(/[\s\-\.]/g, '')

        // Rechercher le client par numéro de téléphone
        const client = await Client.findOne({
            entrepriseId: entrepriseId,
            $or: [
                { phoneNumber: phoneNumber },
                { phoneNumber: cleanPhone },
                { phoneNumber: phoneNumber.replace(/^0/, '') },
                { phoneNumber: cleanPhone.replace(/^0/, '') },
            ],
        })

        if (!client) {
            return res.status(404).json({
                success: false,
                message: `Aucun client trouvé avec le numéro ${phoneNumber}`,
            })
        }

        // Enrichir les données de la commande avec les infos du client
        const orderData = {
            ...req.body,
            clientId: client._id,
            customer: {
                name: client.name,
                phone: client.phoneNumber,
            },
            address: {
                street: client.address,
                city: client.city,
                zipCode: client.postalCode,
                country: 'France',
            }
        }

        const newOrder = new Order(orderData)
        const savedOrder = await newOrder.save()
        
        // Envoyer automatiquement la confirmation SMS (ne pas bloquer si erreur)
        let smsStatus = { sent: false, error: null }
        try {
            if (!client.address) {
                await sendConfirmationSMS(savedOrder)
                smsStatus.sent = true
            }
            else {
                await SendSmS(savedOrder)
                smsStatus.sent = true
            }
        } catch (smsError) {
            console.error('⚠️ Erreur envoi SMS (commande sauvegardée):', smsError.message)
            smsStatus.error = smsError.message
        }
        
        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: savedOrder,
            client: {
                id: client._id,
                name: client.name,
                phone: client.phoneNumber,
                address: client.address,
            },
            sms: smsStatus,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de la commande',
            error: error.message,
        })
    }
}/**
 * Met à jour une commande
 */
export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Commande mise à jour avec succès',
            data: updatedOrder,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la commande',
            error: error.message,
        })
    }
}

/**
 * Supprime une commande
 */
export const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Commande supprimée avec succès',
            data: deletedOrder,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la commande',
            error: error.message,
        })
    }
}

/**
 * Récupère les commandes par statut
 */
export const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params
        const orders = await Order.find({ status }).sort({ createdAt: -1 }).populate('items.menuItemId')
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes',
            error: error.message,
        })
    }
}

/**
 * Récupère la dernière commande d'un client par son ID
 * GET /api/orders/client/:clientId/last
 */
export const getLastOrderByClientId = async (req, res) => {
    try {
        const { clientId } = req.params

        // Récupérer la dernière commande du client (la plus récente)
        const lastOrder = await Order.findOne({ clientId })
            .sort({ createdAt: -1 })
            .populate('items.menuItemId')

        if (!lastOrder) {
            return res.status(404).json({
                success: false,
                message: 'Aucune commande trouvée pour ce client',
            })
        }

        res.status(200).json({
            success: true,
            data: lastOrder,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la dernière commande',
            error: error.message,
        })
    }
}

/**
 * Récupère toutes les commandes d'un client par son ID
 * GET /api/orders/client/:clientId
 */
export const getOrdersByClientId = async (req, res) => {
    try {
        const { clientId } = req.params

        const orders = await Order.find({ clientId })
            .sort({ createdAt: -1 })
            .populate('items.menuItemId')

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes du client',
            error: error.message,
        })
    }
}