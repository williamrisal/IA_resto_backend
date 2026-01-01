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

#### 4. Demander l'adresse de livraison (NOUVEAU ✨)
```
POST /api/sms/request-address
Body: {
  "phoneNumber": "0699766246",
  "orderId": "optional_order_id"
}
```

**Exemple de requête :**
```bash
curl -X POST http://localhost:5001/api/sms/request-address \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0699766246",
    "orderId": "65abc123def456..."
  }'
```

**Le client recevra :**
```
👋 Jean Dupont

Pour votre commande n°123456 (35.50€)

📍 Votre adresse actuelle:
12 rue de la Paix, 75001 Paris

✅ Répondez OUI pour confirmer
❌ Ou envoyez-nous votre nouvelle adresse complète
```

#### 5. Vérifier le statut d'un SMS
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

# Dans un autre terminal, exposez le port 5001
ngrok http 5001
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

Le système détecte automatiquement la dernière commande du client et répond intelligemment :

- **"OUI"** / **"OK"** / **"CONFIRME"** → Confirmation de commande + mise à jour du statut
- **"NON"** / **"ANNULE"** → Annulation de la commande
- **"AIDE"** / **"HELP"** → Menu d'aide avec toutes les options
- **"ADRESSE"** → Affiche l'adresse actuelle de livraison
- **"STATUT"** / **"COMMANDE"** → Affiche le statut de la dernière commande
- **Adresse complète** (ex: "12 rue de la Paix 75001 Paris") → Met à jour l'adresse de la commande
- **Autre message** → Accusé de réception générique

### Workflow complet - Demande d'adresse :

#### 1. Vous demandez l'adresse au client via l'API :
```bash
curl -X POST http://localhost:5001/api/sms/request-address \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "0699766246"}'
```

#### 2. Le client reçoit :
```
👋 Jean Dupont

Pour votre commande n°123456 (35.50€)

📍 Votre adresse actuelle:
12 rue de la Paix, 75001 Paris

✅ Répondez OUI pour confirmer
❌ Ou envoyez-nous votre nouvelle adresse complète
```

#### 3. Le client répond de plusieurs façons possibles :

**Option A - Confirme l'adresse :**
```
Client: "OUI"
```
```
Bot: Merci Jean Dupont ! Votre commande n°123456 est confirmée 🎉

📍 12 rue de la Paix, 75001 Paris
💰 35.5€
⏱️ Livraison: 30-45 min

Bon appétit ! 🍽️
```

**Option B - Envoie une nouvelle adresse :**
```
Client: "25 avenue des Champs-Élysées 75008 Paris"
```
```
Bot: Merci Jean Dupont ! Votre adresse a été mise à jour :
📍 25 avenue des Champs-Élysées 75008 Paris

Commande n°123456
💰 35.5€
⏱️ Livraison estimée: 30-45 min

Bon appétit ! 🍽️
```

**Option C - Demande le statut :**
```
Client: "STATUT"
```
```
Bot: ✅ Commande n°123456

Statut: confirmed
Total: 35.5€
Type: livraison

Merci pour votre commande ! 🙏
```

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
