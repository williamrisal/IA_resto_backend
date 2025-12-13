import express from 'express'
import * as orderController from '../controllers/orderController.js'
import parseFormData from '../middleware/formDataParser.js'

const router = express.Router()

/**
 * Routes pour la gestion des commandes
 */

// GET - Récupère toutes les commandes
router.get('/', orderController.getAllOrders)

// GET - Récupère la dernière commande d'un client
router.get('/client/:clientId/last', orderController.getLastOrderByClientId)

// GET - Récupère toutes les commandes d'un client
router.get('/client/:clientId', orderController.getOrdersByClientId)

// GET - Récupère une commande par ID
router.get('/:id', orderController.getOrderById)

// GET - Récupère les commandes par statut
router.get('/status/:status', orderController.getOrdersByStatus)

// POST - Crée une nouvelle commande (accepte JSON et form-data)
router.post('/', parseFormData, orderController.createOrder)

// PUT - Met à jour une commande
router.put('/:id', orderController.updateOrder)

// DELETE - Supprime une commande
router.delete('/:id', orderController.deleteOrder)

export default router
