import express from 'express'
import * as menuController from '../controllers/menuController.js'

const router = express.Router()

/**
 * Routes pour la gestion du menu
 */

// GET - Récupère tous les articles du menu
router.get('/', menuController.getAllMenuItems)

// GET - Récupère un article par ID
router.get('/:id', menuController.getMenuItemById)

// GET - Récupère les articles par catégorie
router.get('/category/:category', menuController.getMenuItemsByCategory)

// POST - Crée un nouvel article
router.post('/', menuController.createMenuItem)

// PUT - Met à jour un article
router.put('/:id', menuController.updateMenuItem)

// DELETE - Supprime un article
router.delete('/:id', menuController.deleteMenuItem)

export default router
