import express from 'express'
import { createEntrepriseWithData, seedMultipleEntreprises } from '../controllers/seedController.js'

const router = express.Router()

/**
 * Routes pour créer rapidement des entreprises avec données
 */

// POST - Crée une entreprise avec menus et clients
router.post('/entreprise', createEntrepriseWithData)

// POST - Crée plusieurs entreprises d'un coup
router.post('/multiple', seedMultipleEntreprises)

export default router
