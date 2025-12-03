import express from 'express'
import {
    getAllEntreprises,
    getEntrepriseById,
    createEntreprise,
    updateEntreprise,
    deleteEntreprise,
} from '../controllers/entrepriseController.js'

const router = express.Router()

/**
 * Routes pour la gestion des entreprises
 */

// GET - Récupère toutes les entreprises
router.get('/', getAllEntreprises)

// GET - Récupère une entreprise par ID
router.get('/:id', getEntrepriseById)

// POST - Crée une nouvelle entreprise
router.post('/', createEntreprise)

// PUT - Met à jour une entreprise
router.put('/:id', updateEntreprise)

// DELETE - Supprime une entreprise
router.delete('/:id', deleteEntreprise)

export default router
