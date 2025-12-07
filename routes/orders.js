import express from 'express'
import * as orderController from '../controllers/orderController.js'

const router = express.Router()

/**
 * Routes pour la gestion des commandes
 */

// GET - Récupère toutes les commandes
router.get('/', orderController.getAllOrders)

// GET - Récupère une commande par ID
router.get('/:id', orderController.getOrderById)

// GET - Récupère les commandes par statut
router.get('/status/:status', orderController.getOrdersByStatus)

// POST - Crée une nouvelle commande
router.post('/', orderController.createOrder)

// POST - Envoie un message de confirmation au client
router.post('/:id/confirm', orderController.sendOrderConfirmation)

// PUT - Met à jour une commande
router.put('/:id', orderController.updateOrder)

// DELETE - Supprime une commande
router.delete('/:id', orderController.deleteOrder)

export default router
