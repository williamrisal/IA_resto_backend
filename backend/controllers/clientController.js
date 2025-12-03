import Client from '../models/Client.js'

/**
 * Récupère tous les clients
 */
export const getAllClients = async (req, res) => {
    try {
        const { entrepriseId } = req.query
        const filter = entrepriseId ? { entrepriseId } : {}
        const clients = await Client.find(filter).populate('entrepriseId', 'name email')
        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des clients',
            error: error.message,
        })
    }
}

/**
 * Récupère un client par ID
 */
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate('entrepriseId', 'name email')
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé',
            })
        }
        res.status(200).json({
            success: true,
            data: client,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du client',
            error: error.message,
        })
    }
}

/**
 * Crée un nouveau client
 */
export const createClient = async (req, res) => {
    try {
        const client = await Client.create(req.body)
        await client.populate('entrepriseId', 'name email')
        res.status(201).json({
            success: true,
            message: 'Client créé avec succès',
            data: client,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création du client',
            error: error.message,
        })
    }
}

/**
 * Met à jour un client
 */
export const updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('entrepriseId', 'name email')
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Client mis à jour',
            data: client,
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
 * Supprime un client
 */
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id)
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Client supprimé',
            data: client,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message,
        })
    }
}

/**
 * Récupère les clients par entreprise
 */
export const getClientsByEntreprise = async (req, res) => {
    try {
        const clients = await Client.find({ entrepriseId: req.params.entrepriseId }).populate(
            'entrepriseId',
            'name email'
        )
        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des clients',
            error: error.message,
        })
    }
}

/**
 * Récupère les clients VIP
 */
export const getVIPClients = async (req, res) => {
    try {
        const clients = await Client.find({ isVIP: true }).populate('entrepriseId', 'name email')
        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des clients VIP',
            error: error.message,
        })
    }
}
