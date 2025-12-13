import express from 'express'
import {
    receiveSMS,
    getSMSHistory,
    SendSmS,
    getSMSStatus,
} from '../controllers/smsController.js'

const router = express.Router()

/**
 * @route   POST /api/sms/webhook
 * @desc    Webhook pour recevoir les SMS entrants de Twilio
 * @access  Public (appelé par Twilio)
 */
router.post('/webhook', receiveSMS)

/**
 * @route   GET /api/sms/history/:phoneNumber
 * @desc    Récupère l'historique des SMS d'un numéro
 * @access  Private (nécessite auth - à ajouter)
 */
router.get('/history/:phoneNumber', getSMSHistory)

/**
 * @route   POST /api/sms/send
 * @desc    Envoie un SMS manuel
 * @access  Private (nécessite auth - à ajouter)
 */
router.post('/send', SendSmS)

/**
 * @route   GET /api/sms/status/:messageSid
 * @desc    Vérifie le statut d'un SMS
 * @access  Private (nécessite auth - à ajouter)
 */
router.get('/status/:messageSid', getSMSStatus)

export default router
