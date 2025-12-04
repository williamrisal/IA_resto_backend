import MenuItem from '../models/MenuItem.js'

/**
 * Contrôleur pour la gestion du menu
 */

/**
 * Récupère tous les articles du menu
 */
export const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ category: 1 })
        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du menu',
            error: error.message,
        })
    }
}

/**
 * Récupère un article par ID
 */
export const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id)
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé',
            })
        }
        res.status(200).json({
            success: true,
            data: menuItem,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'article',
            error: error.message,
        })
    }
}

/**
 * Crée un nouvel article du menu
 */
export const createMenuItem = async (req, res) => {
    try {
        console.log('📥 Données reçues pour création menu:', req.body)
        const newItem = new MenuItem(req.body)
        const savedItem = await newItem.save()
        console.log('✅ Article créé avec succès:', savedItem._id)
        res.status(201).json({
            success: true,
            message: 'Article créé avec succès',
            data: savedItem,
        })
    } catch (error) {
        console.error('❌ Erreur création menu:', error.message)
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de l\'article',
            error: error.message,
        })
    }
}

/**
 * Met à jour un article du menu
 */
export const updateMenuItem = async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: updatedItem,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'article',
            error: error.message,
        })
    }
}

/**
 * Supprime un article du menu
 */
export const deleteMenuItem = async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id)
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Article supprimé avec succès',
            data: deletedItem,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'article',
            error: error.message,
        })
    }
}

/**
 * Récupère les articles par catégorie
 */
export const getMenuItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params
        const items = await MenuItem.find({ category })
        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des articles',
            error: error.message,
        })
    }
}
