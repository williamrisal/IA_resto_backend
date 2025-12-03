import express from 'express'
import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientsByEntreprise,
    getVIPClients,
} from '../controllers/clientController.js'

const router = express.Router()

/**
 * Routes pour la gestion des clients
 */

// GET - Récupère tous les clients
router.get('/', getAllClients)

// GET - Récupère les clients VIP
router.get('/vip', getVIPClients)

// GET - Récupère les clients d'une entreprise
router.get('/entreprise/:entrepriseId', getClientsByEntreprise)

// GET - Récupère un client par ID
router.get('/:id', getClientById)

// POST - Crée un nouveau client
router.post('/', createClient)

// PUT - Met à jour un client
router.put('/:id', updateClient)

// DELETE - Supprime un client
router.delete('/:id', deleteClient)

export default router
