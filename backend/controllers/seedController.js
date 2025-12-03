import Entreprise from '../models/Entreprise.js'
import MenuItem from '../models/MenuItem.js'
import Client from '../models/Client.js'

/**
 * Crée une entreprise complète avec menus et clients pré-remplis
 */
export const createEntrepriseWithData = async (req, res) => {
    try {
        const { name, email, phone, address, city, postalCode, menus, clients } = req.body

        // Créer l'entreprise
        const entreprise = await Entreprise.create({
            name,
            email,
            phone,
            address,
            city,
            postalCode,
            menus: [],
            clients: [],
            commandes: [],
        })

        let createdMenus = []
        let createdClients = []

        // Créer les menus si fournis
        if (menus && menus.length > 0) {
            createdMenus = await MenuItem.insertMany(
                menus.map(menu => ({
                    ...menu,
                    entrepriseId: entreprise._id,
                }))
            )
            entreprise.menus = createdMenus.map(m => m._id)
        }

        // Créer les clients si fournis
        if (clients && clients.length > 0) {
            createdClients = await Client.insertMany(
                clients.map(client => ({
                    ...client,
                    entrepriseId: entreprise._id,
                }))
            )
            entreprise.clients = createdClients.map(c => c._id)
        }

        // Sauvegarder l'entreprise avec les références
        await entreprise.save()

        res.status(201).json({
            success: true,
            message: 'Entreprise créée avec menus et clients',
            data: {
                entreprise,
                menus: createdMenus,
                clients: createdClients,
            },
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
 * Crée plusieurs entreprises d'un coup
 */
export const seedMultipleEntreprises = async (req, res) => {
    try {
        const { entreprises } = req.body

        if (!Array.isArray(entreprises) || entreprises.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir un tableau d\'entreprises',
            })
        }

        const results = []

        for (const entrepriseData of entreprises) {
            const entreprise = await Entreprise.create({
                name: entrepriseData.name,
                email: entrepriseData.email,
                phone: entrepriseData.phone,
                address: entrepriseData.address,
                city: entrepriseData.city,
                postalCode: entrepriseData.postalCode,
                menus: [],
                clients: [],
                commandes: [],
            })

            let createdMenus = []
            let createdClients = []

            // Créer les menus
            if (entrepriseData.menus && entrepriseData.menus.length > 0) {
                createdMenus = await MenuItem.insertMany(
                    entrepriseData.menus.map(menu => ({
                        ...menu,
                        entrepriseId: entreprise._id,
                    }))
                )
                entreprise.menus = createdMenus.map(m => m._id)
            }

            // Créer les clients
            if (entrepriseData.clients && entrepriseData.clients.length > 0) {
                createdClients = await Client.insertMany(
                    entrepriseData.clients.map(client => ({
                        ...client,
                        entrepriseId: entreprise._id,
                    }))
                )
                entreprise.clients = createdClients.map(c => c._id)
            }

            await entreprise.save()

            results.push({
                entreprise,
                menus: createdMenus.length,
                clients: createdClients.length,
            })
        }

        res.status(201).json({
            success: true,
            message: `${results.length} entreprises créées avec succès`,
            data: results,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création des entreprises',
            error: error.message,
        })
    }
}
