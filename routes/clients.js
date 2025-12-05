import express from 'express'
import {
    getAllClients,
    getClientById,
    getClientByPhone,
    createClient,
    updateClient,
    deleteClient,
    getClientsByEntreprise,
    getVIPClients,
    getClientCoordinates,
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

// GET - Récupère un client par numéro de téléphone
router.get('/phone/:phone', getClientByPhone)

// GET - Récupère les coordonnées d'un client (téléphone + adresse)
router.get('/:id/coordinates', getClientCoordinates)

// GET - Récupère un client par ID
router.get('/:id', getClientById)

// POST - Crée un nouveau client
router.post('/', createClient)

// PUT - Met à jour un client
router.put('/:id', updateClient)

// DELETE - Supprime un client
router.delete('/:id', deleteClient)

export default router
