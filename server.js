import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import orderRoutes from './routes/orders.js'
import menuRoutes from './routes/menu.js'
import entrepriseRoutes from './routes/entreprises.js'
import clientRoutes from './routes/clients.js'
import seedRoutes from './routes/seed.js'
import authRoutes from './routes/auth.js'
import smsRoutes from './routes/sms.js'

// Chargement des variables d'environnement
dotenv.config()

/**
 * Initialisation du serveur Express
 * Gère l'API REST pour le panel d'administration restaurant
 */
const app = express()

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://0.0.0.0:8080',
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connexion à la base de données
await connectDB()

/**
 * Routes API
 */
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/entreprises', entrepriseRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/seed', seedRoutes)
app.use('/api/sms', smsRoutes)

/**
 * Route de santé - Vérifie si le serveur est opérationnel
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Serveur en bonne santé ✅',
        timestamp: new Date().toISOString(),
    })
})

/**
 * Gestion des erreurs 404
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl,
    })
})

/**
 * Démarrage du serveur
 */
const PORT = process.env.PORT || 5001
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0'
app.listen(PORT, HOST, () => {
    console.log(`🚀 Serveur lancé sur http://${HOST}:${PORT}`)
    console.log(`📊 Dashboard: http://0.0.0.0:8080`)
})

export default app
