import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Entreprise from './models/Entreprise.js'
import Client from './models/Client.js'
import MenuItem from './models/MenuItem.js'
import { connectDB } from './config/database.js'

// Chargement des variables d'environnement
dotenv.config()

/**
 * Script pour remplir la base de données avec des données de test
 * Crée une entreprise, puis importe les clients
 */

// Données des clients directement dans le script
const clientsData = [
    { orderNumber: '1001', phoneNumber: '06 12 34 56 78', name: 'Jean Dupont', address: '123 Rue de Paris', city: 'Paris', postalCode: '75001', houseNumber: '123', apartment: '', deliveryNotes: 'Appeler à l\'arrivée', status: 'Actif', orderCount: 5, totalSpent: 145.50 },
    { orderNumber: '1002', phoneNumber: '06 23 45 67 89', name: 'Marie Martin', address: '456 Avenue Victor Hugo', city: 'Lyon', postalCode: '69000', houseNumber: '456', apartment: 'Apt 3B', deliveryNotes: 'Laisser au portail', status: 'Actif', orderCount: 12, totalSpent: 380.25 },
    { orderNumber: '1003', phoneNumber: '06 34 56 78 90', name: 'Pierre Bernard', address: '789 Boulevard Saint-Germain', city: 'Paris', postalCode: '75005', houseNumber: '789', apartment: '', deliveryNotes: 'Pas de sonnette', status: 'Actif', orderCount: 3, totalSpent: 92.00 },
    { orderNumber: '1004', phoneNumber: '06 45 67 89 01', name: 'Sophie Laurent', address: '321 Rue de Rivoli', city: 'Marseille', postalCode: '13000', houseNumber: '321', apartment: 'Rez-de-chaussée', deliveryNotes: 'Laisser devant la porte', status: 'Inactif', orderCount: 8, totalSpent: 267.80 },
    { orderNumber: '1005', phoneNumber: '06 56 78 90 12', name: 'Luc Dubois', address: '654 Chemin des Écoles', city: 'Toulouse', postalCode: '31000', houseNumber: '654', apartment: 'Apt 5C', deliveryNotes: 'Appeler 10 min avant', status: 'Actif', orderCount: 15, totalSpent: 520.40 },
    { orderNumber: '1006', phoneNumber: '06 67 89 01 23', name: 'Caroline Moreau', address: '987 Place de la Concorde', city: 'Paris', postalCode: '75008', houseNumber: '987', apartment: '', deliveryNotes: 'Interphone code 1234', status: 'Actif', orderCount: 2, totalSpent: 58.50 },
    { orderNumber: '1007', phoneNumber: '06 78 90 12 34', name: 'Michel Lefevre', address: '135 Rue Lepic', city: 'Paris', postalCode: '75018', houseNumber: '135', apartment: 'Apt 2A', deliveryNotes: 'Sonnette cassée', status: 'Bloqué', orderCount: 0, totalSpent: 0.00 },
    { orderNumber: '1008', phoneNumber: '06 89 01 23 45', name: 'Isabelle Girard', address: '246 Avenue Foch', city: 'Paris', postalCode: '75016', houseNumber: '246', apartment: '', deliveryNotes: 'Très urgentissime', status: 'Actif', orderCount: 25, totalSpent: 890.75 },
    { orderNumber: '1009', phoneNumber: '06 90 12 34 56', name: 'François Durand', address: '357 Boulevard Haussmann', city: 'Paris', postalCode: '75009', houseNumber: '357', apartment: 'Apt 7D', deliveryNotes: 'Sonnette à gauche', status: 'Actif', orderCount: 7, totalSpent: 201.30 },
    { orderNumber: '1010', phoneNumber: '07 01 23 45 67', name: 'Nathalie Petit', address: '468 Quai de la Seine', city: 'Paris', postalCode: '75004', houseNumber: '468', apartment: '', deliveryNotes: 'Livraison rapide SVP', status: 'Actif', orderCount: 18, totalSpent: 650.20 },
]

async function seedDatabase() {
    try {
        // Connexion à MongoDB
        await connectDB()
        console.log('✅ Connexion à MongoDB réussie\n')

        // Vider les collections existantes
        console.log('🗑️ Nettoyage des collections...')
        await Entreprise.deleteMany({})
        await Client.deleteMany({})
        await MenuItem.deleteMany({})
        console.log('✅ Collections nettoyées\n')

        // Créer une entreprise de test
        console.log('📝 Création de l\'entreprise...')
        const entreprise = await Entreprise.create({
            name: 'Pizza Palace',
            email: 'pizza.palace@resto.fr',
            password: 'password123',
            phone: '01 23 45 67 89',
            address: '123 Rue de Paris',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
            currency: 'EUR',
            timezone: 'Europe/Paris',
            description: 'Meilleure pizzeria de Paris',
            isActive: true,
            menus: [],
            clients: [],
            commandes: [],
        })
        console.log(`✅ Entreprise créée : ${entreprise.name}`)
        console.log(`   ID: ${entreprise._id}\n`)

        // Créer les menus de l'entreprise
        console.log('📝 Création des articles du menu...')
        const menuItems = await MenuItem.create([
            {
                entrepriseId: entreprise._id,
                name: 'Pizza Margherita',
                category: 'Pizza',
                description: 'Tomate, mozzarella, basilic',
                price: 12.50,
                available: true,
                preparationTime: 15,
            },
            {
                entrepriseId: entreprise._id,
                name: 'Pizza Pepperoni',
                category: 'Pizza',
                description: 'Tomate, mozzarella, pepperoni',
                price: 14.00,
                available: true,
                preparationTime: 15,
            },
            {
                entrepriseId: entreprise._id,
                name: 'Pâtes Carbonara',
                category: 'Pâtes',
                description: 'Pâtes, lardons, œufs, parmesan',
                price: 13.50,
                available: true,
                preparationTime: 12,
            },
            {
                entrepriseId: entreprise._id,
                name: 'Salade César',
                category: 'Salade',
                description: 'Laitue, parmesan, croutons, sauce César',
                price: 9.50,
                available: true,
                preparationTime: 5,
            },
            {
                entrepriseId: entreprise._id,
                name: 'Tiramisu',
                category: 'Dessert',
                description: 'Dessert italien classique',
                price: 6.50,
                available: true,
                preparationTime: 1,
            },
        ])
        console.log(`✅ ${menuItems.length} articles du menu créés`)
        menuItems.forEach(item => {
            console.log(`   - ${item.name} (${item.category}) - €${item.price}`)
        })
        console.log()

        // Mettre à jour l'entreprise avec les références aux menus
        entreprise.menus = menuItems.map(item => item._id)
        await entreprise.save()

        // Créer les clients
        console.log('📝 Création des clients...')
        const createdClients = await Client.insertMany(
            clientsData.map(client => ({
                ...client,
                entrepriseId: entreprise._id,
            }))
        )
        console.log(`✅ ${createdClients.length} clients créés`)
        createdClients.forEach(client => {
            console.log(`   - ${client.name} (${client.phoneNumber})`)
        })
        console.log()

        // Mettre à jour l'entreprise avec les références aux clients
        entreprise.clients = createdClients.map(client => client._id)
        await entreprise.save()
        console.log('✅ Références aux clients mises à jour dans l\'entreprise\n')

        // Résumé final
        console.log('='.repeat(60))
        console.log('📊 DONNÉES IMPORTÉES AVEC SUCCÈS')
        console.log('='.repeat(60))
        console.log(`\n🏪 Entreprise: ${entreprise.name}`)
        console.log(`   ID: ${entreprise._id}`)
        console.log(`   📍 ${entreprise.address}, ${entreprise.postalCode} ${entreprise.city}`)
        console.log(`\n🍕 Articles de menu: ${menuItems.length}`)
        console.log(`\n👥 Clients: ${createdClients.length}`)
        console.log('\n' + '='.repeat(60))
        console.log('✅ Toutes les données sont maintenant dans MongoDB')
        console.log('📍 Regarde dans MongoDB Compass pour vérifier !')
        console.log('='.repeat(60) + '\n')

        // Fermer la connexion
        await mongoose.disconnect()
        console.log('✅ Déconnexion MongoDB réussie\n')
        process.exit(0)
    } catch (error) {
        console.error('❌ Erreur:', error.message)
        await mongoose.disconnect()
        process.exit(1)
    }
}

// Lancer le script
seedDatabase()
