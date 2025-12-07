import Order from '../models/Order.js'
import Client from '../models/Client.js'
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
        print(phoneNumber)

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
        
        // Envoyer automatiquement la confirmation SMS
        await sendConfirmationSMS(savedOrder)
        
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
 * Envoie un message de confirmation au client (route manuelle)
 * POST /api/orders/:id/confirm
 */
export const sendOrderConfirmation = async (req, res) => {
    try {
        const orderId = req.params.id

        // Récupérer la commande avec les infos du client depuis la BDD
        const order = await Order.findById(orderId).populate('clientId')

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée',
            })
        }

        // Envoyer le SMS
       // await sendConfirmationAdresseSMS(order)
        //await sendConfirmationSMS(order)

        res.status(200).json({
            success: true,
            message: 'Confirmation SMS envoyée',
            data: {
                orderId: order._id,
                customerName: order.customer.name,
                customerPhone: order.customer.phone,
                customerAddress: order.address,
                customerLivraison: order.type,
                customerPayement: order.paymentMethod
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de la confirmation',
            error: error.message,
        })
    }
}

/**
 * Fonction interne pour envoyer un SMS de confirmation
 * Utilisée automatiquement après création de commande
 */
const sendConfirmationSMS = async (order) => {
    try {
        // Message avec l'adresse
        const orderNum = order.orderId || order._id.toString().slice(-6)
        const address = `${order.address.street}, ${order.address.zipCode} ${order.address.city}`
        
        const message = `👋 ${order.customer.name}\n\n✅ Commande n°${orderNum} enregistree !\n\n📦 ${order.type}\n📍 ${address}\n💰 ${order.total}€\n💳 ${order.paymentMethod}\n\n⏱️ Preparation: ~20 min\n\nMerci ! 🙏`
        
        const confirmationMessage = {
            to: order.customer.phone,
            message: message,
        }

        console.log('📱 Message de confirmation:', confirmationMessage)
        console.log('📏 Longueur du message:', message.length, 'caractères')
        console.log('🔍 Debug - customer.phone:', order.customer.phone)
        console.log('🔍 Debug - type:', order.type)
        console.log('🔍 Debug - total:', order.total)
        
        await SendSmS(confirmationMessage)
        console.log('✅ SendSmS appelé avec succès')
    } catch (error) {
        console.error('❌ Erreur envoi SMS:', error.message)
        console.error('❌ Stack:', error.stack)
        // Ne pas bloquer la création de commande si le SMS échoue
    }
}


export const SendSmS = async (messageData) => {
    try {
        const accountSid = 'AC595c4dab477bf49373df06196a43f77f';
        const authToken = '22f290833263e4700f180044f7b6a517';
        const client = twilio(accountSid, authToken);
        
        const message = await client.messages.create({
            body: messageData.message,
            from: '+15172003255',
            to: '+33699766246' 
        })
        
        console.log('✅ SMS envoyé:', message.sid)
        return message
    } catch (error) {
        console.error('❌ Erreur Twilio:', error.message)
        throw error
    }
}


const sendConfirmationAdresseSMS = async (order) => {
    try {
        // Message avec l'adresse
        const orderNum = order.orderId || order._id.toString().slice(-6)
        const address = `${order.address.street}, ${order.address.zipCode} ${order.address.city}`
        
        const message = `👋 ${order.customer.name}\n\n✅ Commande n°${orderNum} bien enregistree !\n\n⚠️ Merci de nous confirmer votre adresse de livraison :\n📍 ${address}\n\n📦 ${order.type}\n💰 ${order.total}€\n💳 ${order.paymentMethod}\n⏱️ Preparation: ~20 min\n\nMerci ! 🙏`
        
        const confirmationMessage = {
            to: order.customer.phone,
            message: message,
        }

        console.log('📱 Message de confirmation:', confirmationMessage)
        console.log('📏 Longueur du message:', message.length, 'caractères')
        console.log('🔍 Debug - customer.phone:', order.customer.phone)
        console.log('🔍 Debug - type:', order.type)
        console.log('🔍 Debug - total:', order.total)
        
        await SendSmS(confirmationMessage)
        console.log('✅ SendSmS appelé avec succès')
    } catch (error) {
        console.error('❌ Erreur envoi SMS:', error.message)
        console.error('❌ Stack:', error.stack)
        // Ne pas bloquer la création de commande si le SMS échoue
    }
}