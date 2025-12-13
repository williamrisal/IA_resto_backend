# Configuration Twilio - Réception de SMS

## 📱 Ce qui a été mis en place

### Fichiers créés :
- ✅ `controllers/smsController.js` - Contrôleur pour gérer les SMS
- ✅ `routes/sms.js` - Routes API pour les SMS
- ✅ Routes ajoutées dans `server.js`

### Routes disponibles :

#### 1. Webhook pour recevoir les SMS (appelé par Twilio)
```
POST /api/sms/webhook
```

#### 2. Récupérer l'historique des SMS d'un client
```
GET /api/sms/history/:phoneNumber
```

#### 3. Envoyer un SMS manuel
```
POST /api/sms/send
Body: {
  "to": "+33699766246",
  "message": "Votre message ici"
}
```

#### 4. Vérifier le statut d'un SMS
```
GET /api/sms/status/:messageSid
```

## 🔧 Configuration Twilio Console

Pour recevoir les SMS, vous devez configurer le webhook dans Twilio :

### Étapes :

1. **Connectez-vous à la console Twilio** : https://console.twilio.com/

2. **Allez dans Phone Numbers > Manage > Active numbers**

3. **Cliquez sur votre numéro de téléphone Twilio**

4. **Dans la section "Messaging"**, trouvez "A MESSAGE COMES IN"

5. **Configurez le webhook** :
   - **Webhook URL** : `https://votre-domaine.com/api/sms/webhook`
   - **HTTP Method** : POST
   - **Content Type** : application/x-www-form-urlencoded

6. **Sauvegardez** les modifications

### 🌐 Pour le développement local avec ngrok :

Si vous développez en local, utilisez **ngrok** pour exposer votre serveur :

```bash
# Installez ngrok
brew install ngrok

# Lancez votre serveur backend
npm start

# Dans un autre terminal, exposez le port 5000
ngrok http 5000
```

Ngrok vous donnera une URL publique comme : `https://abc123.ngrok.io`

Utilisez cette URL dans Twilio : `https://abc123.ngrok.io/api/sms/webhook`

### 🐳 Pour Docker en production :

Votre URL webhook sera : `https://votre-domaine.com/api/sms/webhook`

## 🧪 Test

### Tester la réception de SMS :

1. Configurez le webhook dans Twilio
2. Envoyez un SMS depuis votre téléphone au numéro Twilio
3. Le serveur recevra le SMS et répondra automatiquement

### Messages automatiques implémentés :

- Si le client envoie "OUI" → Confirmation de commande
- Si le client envoie "NON" → Message d'annulation
- Si le client envoie "AIDE" → Instructions
- Autre message → Accusé de réception

## 📝 Variables d'environnement nécessaires

Ajoutez ces variables dans votre `.env` :

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33xxxxxxxxx
```

## 🔐 Sécurité (optionnel mais recommandé)

Pour sécuriser le webhook et vérifier que les requêtes viennent bien de Twilio, ajoutez cette validation dans `smsController.js` :

```javascript
import twilio from 'twilio'

export const receiveSMS = async (req, res) => {
    // Vérifier la signature Twilio
    const twilioSignature = req.headers['x-twilio-signature']
    const url = `https://votre-domaine.com${req.originalUrl}`
    
    const isValid = twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN,
        twilioSignature,
        url,
        req.body
    )
    
    if (!isValid) {
        return res.status(403).send('Forbidden')
    }
    
    // ... reste du code
}
```

## 🚀 Démarrage rapide

1. Ajoutez vos identifiants Twilio dans `.env`
2. Redémarrez votre serveur
3. Configurez le webhook dans Twilio Console
4. Testez en envoyant un SMS !

## 📞 Support

Pour toute question sur Twilio : https://www.twilio.com/docs
