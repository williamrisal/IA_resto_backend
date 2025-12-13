import twilio from 'twilio'
import Order from '../models/Order.js'
import Client from '../models/Client.js'
import { response } from 'express'

/**
 * Contrôleur pour la gestion des SMS entrants et sortants via Twilio
 */

/**
 * Fonction pour parser une adresse complète et extraire les composants
 * Exemple: "12 rue de la Paix 75001 Paris" -> { street: "12 rue de la Paix", zipCode: "75001", city: "Paris" }
 */
function parseAddress(addressText) {
    const text = addressText.trim()
    
    // Regex pour trouver le code postal (5 chiffres)
    const zipCodeMatch = text.match(/\b(\d{5})\b/)
    
    if (zipCodeMatch) {
        const zipCode = zipCodeMatch[1]
        const zipCodeIndex = text.indexOf(zipCode)
        
        // Tout avant le code postal = rue
        const street = text.substring(0, zipCodeIndex).trim()
        
        // Tout après le code postal = ville
        const city = text.substring(zipCodeIndex + 5).trim()
        
        return {
            street: street,
            zipCode: zipCode,
            city: city,
            country: 'France'
        }
    }
    
    // Si pas de code postal trouvé, on met tout dans street
    return {
        street: text,
        zipCode: '',
        city: '',
        country: 'France'
    }
}

/**
 * Webhook pour recevoir les SMS entrants de Twilio
 * POST /api/sms/webhook
 */
export const receiveSMS = async (req, res) => {
    try {
        const { From, To, Body, MessageSid, NumMedia } = req.body

        console.log('📱 SMS reçu:')
        console.log('   De:', From)
        console.log('   Vers:', To)
        console.log('   Message:', Body)
        console.log('   Message SID:', MessageSid)
        console.log('   Médias:', NumMedia)

        // Nettoyer le numéro de téléphone
        const cleanPhone = From.replace(/[\s\-\.]/g, '')

        // Rechercher le client
        const client = await Client.findOne({
            $or: [
                { phoneNumber: From },
                { phoneNumber: cleanPhone },
                { phoneNumber: From.replace(/^\+33/, '0') },
                { phoneNumber: cleanPhone.replace(/^\+33/, '0') },
            ],
        })

        if (!client) {
            console.log('⚠️ Client non trouvé pour le numéro:', From)
            
            // Répondre avec TwiML
            const twiml = new twilio.twiml.MessagingResponse()
            twiml.message('Désolé, nous n\'avons pas trouvé votre compte. Veuillez contacter le restaurant.')
            
            res.type('text/xml')
            return res.send(twiml.toString())
        }

        // Sauvegarder le message (vous pouvez créer un modèle Message si nécessaire)
        console.log('✅ Client trouvé:', client.name)
        console.log('📝 Sauvegarde du message...')

        // Récupérer la dernière commande du client
        const lastOrder = await Order.findOne({ clientId: client._id })
            .sort({ createdAt: -1 })
            .populate('items.menuItemId')

        let response = 'Merci pour votre message. Nous reviendrons vers vous sous peu.'
        
        if (lastOrder) {
            console.log('📦 Dernière commande trouvée:', lastOrder._id)

            if (lastOrder.status === 'En attente') {
                // Détecter si c'est une adresse (contient des chiffres)
                const isAddress = /\d+/.test(Body)
                
                if (isAddress) {
                    // Parser l'adresse
                    const parsedAddress = parseAddress(Body)
                    
                    console.log('📍 Adresse parsée:', parsedAddress)
                    
                    // Mettre à jour l'adresse dans la commande (seulement les champs non vides)
                    if (parsedAddress.street) {
                        lastOrder.address.street = parsedAddress.street
                    }
                    if (parsedAddress.zipCode) {
                        lastOrder.address.zipCode = parsedAddress.zipCode
                    }
                    if (parsedAddress.city) {
                        lastOrder.address.city = parsedAddress.city
                    }
                    if (parsedAddress.country) {
                        lastOrder.address.country = parsedAddress.country
                    }
                    
                    // Mettre à jour le statut à "En cours" quand l'adresse est confirmée
                    lastOrder.status = 'En cours'
                    
                    await lastOrder.save()
                    await Client.findByIdAndUpdate(client._id, { address: lastOrder.address })
                    
                    console.log('✅ Adresse de livraison mise à jour pour la commande', lastOrder._id)
                    console.log('✅ Statut mis à jour: En cours')
                    
                    const orderNum = lastOrder.orderId || lastOrder._id.toString().slice(-6)

                    if (!lastOrder.address.zipCode && !lastOrder.address.city) {
                        response = `Merci ${client.name} ! Votre adresse a été partiellement mise à jour :\n📍 ${lastOrder.address.street}, veuillez préciser la ville  et/ou le  code postal.`
                    }
                    else {
                        response = `Merci ${client.name} ! Votre adresse a été mise à jour :\n📍 ${parsedAddress.street}\n${parsedAddress.zipCode} ${parsedAddress.city}\n\nCommande n°${orderNum}\n💰 ${lastOrder.total}€\n\nNous préparons votre commande ! 🍽️`
                    }
                } else {
                    response = `Merci ${client.name} ! Envoyez-nous votre adresse complète (ex: 12 rue de la Paix 75001 Paris)`
                }
            } else {
                response = `Bonjour ${client.name} ! Votre commande est déjà ${lastOrder.status}. Merci ! 🙏`
            }

        } else {
            console.log('⚠️ Aucune commande trouvée pour ce client')
            response = `Bonjour ${client.name} ! Aucune commande en attente trouvée.`
        }

        const twiml = new twilio.twiml.MessagingResponse()
        twiml.message(response)
        
        res.type('text/xml')
        res.send(twiml.toString())

    } catch (error) {
        console.error('❌ Erreur lors de la réception du SMS:', error.message)
        console.error('Stack:', error.stack)
        
        // Toujours répondre à Twilio, même en cas d'erreur
        const twiml = new twilio.twiml.MessagingResponse()
        twiml.message('Une erreur s\'est produite. Veuillez réessayer.')
        
        res.type('text/xml')
        res.send(twiml.toString())
    }
}

/**
 * Récupère l'historique des SMS d'un client
 * GET /api/sms/history/:phoneNumber
 */
export const getSMSHistory = async (req, res) => {
    try {
        const { phoneNumber } = req.params
        const accountSid = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN

        if (!accountSid || !authToken) {
            return res.status(500).json({
                success: false,
                message: 'Identifiants Twilio non configurés',
            })
        }

        const client = twilio(accountSid, authToken)

        // Récupérer les messages de ce numéro
        const messages = await client.messages.list({
            to: phoneNumber,
            limit: 50,
        })

        const messagesFrom = await client.messages.list({
            from: phoneNumber,
            limit: 50,
        })

        const allMessages = [...messages, ...messagesFrom]
            .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))

        res.status(200).json({
            success: true,
            count: allMessages.length,
            data: allMessages.map((msg) => ({
                sid: msg.sid,
                from: msg.from,
                to: msg.to,
                body: msg.body,
                status: msg.status,
                direction: msg.direction,
                dateCreated: msg.dateCreated,
            })),
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'historique SMS',
            error: error.message,
        })
    }
}

/**
 * Envoie un SMS manuel à un client
 * POST /api/sms/send
 */
export const SendSmS = async (messageData) => {
    try {
        const accountSid = 'AC595c4dab477bf49373df06196a43f77f';
        const authToken = 'a274289866551edc13826306dfe90c09';
        const client = twilio(accountSid, authToken);
        
        const message = await client.messages.create({
            body: messageData.message,
            from: '+33939036568',
            to: '+33699766246' 
        })
        
        console.log('✅ SMS envoyé:', message.sid)
        return message
    } catch (error) {
        console.error('❌ Erreur Twilio:', error.message)
        throw error
    }
}


/**
 * Vérifie le statut d'un SMS envoyé
 * GET /api/sms/status/:messageSid
 */
export const getSMSStatus = async (req, res) => {
    try {
        const { messageSid } = req.params
        const accountSid = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN

        if (!accountSid || !authToken) {
            return res.status(500).json({
                success: false,
                message: 'Identifiants Twilio non configurés',
            })
        }

        const client = twilio(accountSid, authToken)
        const message = await client.messages(messageSid).fetch()

        res.status(200).json({
            success: true,
            data: {
                sid: message.sid,
                status: message.status,
                from: message.from,
                to: message.to,
                dateCreated: message.dateCreated,
                dateSent: message.dateSent,
                errorCode: message.errorCode,
                errorMessage: message.errorMessage,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du statut SMS',
            error: error.message,
        })
    }
}


export const sendConfirmationSMS = async (order) => {
    try {
        // Message avec l'adresse
        const orderNum = order.orderId || order._id.toString().slice(-6)
        const address = `${order.address.street}, ${order.address.zipCode} ${order.address.city}`
        
        const message = `👋 ${order.customer.name}\n\n✅ Commande n°${orderNum} enregistree !\n\n📦 ${order.type}\n📍 ${address}\n💰 ${order.total}€\n💳 ${order.paymentMethod}\n\n⏱️ Preparation: ~20 min\n\nMerci ! 🙏`
        
        const confirmationMessage = {
            to: order.customer.phone,
            message: message,
        }

        console.log('📱 Message de confirmation:', confirmationMessage)
        console.log('📏 Longueur du message:', message.length, 'caractères')
        console.log('🔍 Debug - customer.phone:', order.customer.phone)
        console.log('🔍 Debug - type:', order.type)
        console.log('🔍 Debug - total:', order.total)
        
        await SendSmS(confirmationMessage)
        console.log('✅ SendSmS appelé avec succès')
    } catch (error) {
        console.error('❌ Erreur envoi SMS:', error.message)
        console.error('❌ Stack:', error.stack)
        // Ne pas bloquer la création de commande si le SMS échoue
    }
}