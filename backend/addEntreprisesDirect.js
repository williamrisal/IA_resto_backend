import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Entreprise from './models/Entreprise.js'
import { connectDB } from './config/database.js'

dotenv.config()

/**
 * Script pour ajouter des entreprises en base de données
 * Les passwords sont automatiquement hashés par le middleware pre-save
 * 
 * Usage: node addEntreprisesDirect.js
 */

const entreprisesAjouJuli = [
    {
        name: 'Pizza Palace',
        email: 'pizza.palace@resto.fr',
        password: 'password123',
        phone: '01 23 45 67 89',
        address: '123 Rue de Paris',
        city: 'Paris',
        postalCode: '75001',
    },
    {
        name: 'Pâtes Italienne',
        email: 'pates.italienne@resto.fr',
        password: 'password123',
        phone: '01 11 22 33 44',
        address: '789 Rue Italia',
        city: 'Marseille',
        postalCode: '13000',
    },
    {
        name: 'Kebab Palace',
        email: 'kebab.palace@resto.fr',
        password: 'password123',
        phone: '01 22 33 44 55',
        address: '555 Rue Kebab',
        city: 'Toulouse',
        postalCode: '31000',
    },
]

async function addEntreprises() {
    try {
        // Connexion à MongoDB
        await connectDB()
        console.log('✅ Connecté à MongoDB\n')

        console.log('📝 Ajout des entreprises...')

        for (const data of entreprisesAjouJuli) {
            // Vérifier si l'entreprise existe déjà
            const existe = await Entreprise.findOne({ email: data.email })

            if (existe) {
                console.log(`⏭️  ${data.name} existe déjà`)
            } else {
                // Créer la nouvelle entreprise (password sera hashé automatiquement)
                const entreprise = await Entreprise.create(data)
                console.log(`✅ ${data.name} ajoutée (ID: ${entreprise._id})`)
            }
        }

        console.log('\n✅ Opération terminée avec succès')
        console.log('\n📊 Entreprises disponibles pour le login:')
        console.log('━'.repeat(60))
        entreprisesAjouJuli.forEach((e) => {
            console.log(`📧 ${e.email}`)
            console.log(`🔐 ${e.password}`)
            console.log('─'.repeat(60))
        })

        await mongoose.disconnect()
        console.log('\n✅ Déconnexion MongoDB réussie')
        process.exit(0)
    } catch (error) {
        console.error('❌ Erreur:', error.message)
        process.exit(1)
    }
}

addEntreprises()
