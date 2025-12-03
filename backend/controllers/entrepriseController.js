import Entreprise from '../models/Entreprise.js'

/**
 * Récupère toutes les entreprises
 */
export const getAllEntreprises = async (req, res) => {
    try {
        const entreprises = await Entreprise.find()
        res.status(200).json({
            success: true,
            count: entreprises.length,
            data: entreprises,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des entreprises',
            error: error.message,
        })
    }
}

/**
 * Récupère une entreprise par ID
 */
export const getEntrepriseById = async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.params.id)
        if (!entreprise) {
            return res.status(404).json({
                success: false,
                message: 'Entreprise non trouvée',
            })
        }
        res.status(200).json({
            success: true,
            data: entreprise,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'entreprise',
            error: error.message,
        })
    }
}

/**
 * Crée une nouvelle entreprise
 */
export const createEntreprise = async (req, res) => {
    try {
        const entreprise = await Entreprise.create(req.body)
        res.status(201).json({
            success: true,
            message: 'Entreprise créée avec succès',
            data: entreprise,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création de l\'entreprise',
            error: error.message,
        })
    }
}

/**
 * Met à jour une entreprise
 */
export const updateEntreprise = async (req, res) => {
    try {
        const entreprise = await Entreprise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!entreprise) {
            return res.status(404).json({
                success: false,
                message: 'Entreprise non trouvée',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Entreprise mise à jour',
            data: entreprise,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error.message,
        })
    }
}

/**
 * Supprime une entreprise
 */
export const deleteEntreprise = async (req, res) => {
    try {
        const entreprise = await Entreprise.findByIdAndDelete(req.params.id)
        if (!entreprise) {
            return res.status(404).json({
                success: false,
                message: 'Entreprise non trouvée',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Entreprise supprimée',
            data: entreprise,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message,
        })
    }
}
