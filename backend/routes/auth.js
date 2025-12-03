import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

/**
 * Routes d'authentification
 * Note: Le register est désactivé. Les entreprises sont ajoutées via script.
 */

// POST /api/auth/login - Connexion
router.post('/login', authController.login)

// GET /api/auth/me - Vérifier le token et obtenir les infos
router.get('/me', authController.verifyToken)

// POST /api/auth/logout - Déconnexion
router.post('/logout', authController.logout)

export default router
