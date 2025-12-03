import Order from '../models/Order.js'

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
        const newOrder = new Order(req.body)
        const savedOrder = await newOrder.save()
        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: savedOrder,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de la commande',
            error: error.message,
        })
    }
}

/**
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
