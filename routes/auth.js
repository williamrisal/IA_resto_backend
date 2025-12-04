import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

/**
 * Routes d'authentification
 */

// POST /api/auth/register - Inscription d'une nouvelle entreprise
router.post('/register', authController.register)

// POST /api/auth/login - Connexion
router.post('/login', authController.login)

// GET /api/auth/me - Vérifier le token et obtenir les infos
router.get('/me', authController.verifyToken)

// POST /api/auth/logout - Déconnexion
router.post('/logout', authController.logout)

export default router
