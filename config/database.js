import mongoose from 'mongoose'

/**
 * Configuration de la connexion MongoDB
 * Établit la connexion avec la base de données MongoDB Atlas
 */
export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/resto-db'

        await mongoose.connect(mongoURI)

        console.log('✅ MongoDB connecté avec succès')
        return mongoose.connection
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message)
        process.exit(1)
    }
}

/**
 * Déconnexion de MongoDB
 */
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log('✅ Déconnexion MongoDB réussie')
    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error.message)
    }
}
