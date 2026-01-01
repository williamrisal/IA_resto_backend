# Backend - Panel Admin Restaurant

API REST pour le panel d'administration du restaurant avec MongoDB et Mongoose.

## 🚀 Installation

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Configurer MongoDB

#### Option A : MongoDB Atlas (Cloud - Recommandé)
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Récupérer la connection string
4. Copier `.env.example` en `.env` et remplir:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resto-db?retryWrites=true&w=majority
```

#### Option B : MongoDB Locale
```bash
MONGODB_URI=mongodb://0.0.0.0:27017/resto-db
```

### 3. Lancer le serveur

**Mode développement** (avec rechargement automatique):
```bash
npm run dev
```

**Mode production**:
```bash
npm start
```

Le serveur démarre sur `http://0.0.0.0:5001`

## 📚 API Endpoints

### Commandes (`/api/orders`)
- `GET /api/orders` - Récupère toutes les commandes
- `GET /api/orders/:id` - Récupère une commande par ID
- `GET /api/orders/status/:status` - Récupère les commandes par statut
- `POST /api/orders` - Crée une nouvelle commande
- `PUT /api/orders/:id` - Met à jour une commande
- `DELETE /api/orders/:id` - Supprime une commande

### Menu (`/api/menu`)
- `GET /api/menu` - Récupère tous les articles
- `GET /api/menu/:id` - Récupère un article par ID
- `GET /api/menu/category/:category` - Récupère les articles par catégorie
- `POST /api/menu` - Crée un nouvel article
- `PUT /api/menu/:id` - Met à jour un article
- `DELETE /api/menu/:id` - Supprime un article

### Santé
- `GET /api/health` - Vérifie l'état du serveur

## 📦 Structure

```
backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── models/
│   ├── MenuItem.js          # Schéma des articles du menu
│   └── Order.js             # Schéma des commandes
├── controllers/
│   ├── menuController.js    # Logique du menu
│   └── orderController.js   # Logique des commandes
├── routes/
│   ├── menu.js              # Routes du menu
│   └── orders.js            # Routes des commandes
├── server.js                # Serveur principal
├── package.json
├── .env.example
└── .gitignore
```

## 🔧 Variables d'environnement

Créer un fichier `.env`:
```env
MONGODB_URI=votre_url_mongodb
PORT=5001
NODE_ENV=development
CLIENT_URL=http://0.0.0.0:8080
```

## 📝 Exemple d'utilisation avec cURL

### Créer une commande
```bash
curl -X POST http://0.0.0.0:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "CMD-001",
    "type": "Livraison",
    "customer": {
      "name": "Jean Dupont",
      "phone": "0612345678",
      "email": "jean@email.com"
    },
    "address": {
      "street": "123 Rue de Paris",
      "city": "Paris",
      "zipCode": "75001"
    },
    "items": [],
    "total": 45.50,
    "status": "En attente"
  }'
```

### Récupérer tous les articles du menu
```bash
curl http://0.0.0.0:5001/api/menu
```

## 🔗 Connecter le frontend

Ajouter l'URL du backend dans votre `.env` du frontend:
```env
VITE_API_URL=http://0.0.0.0:5001
```

Puis utiliser dans React:
```javascript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
```

## 📖 Documentation MongoDB/Mongoose

- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## ⚙️ Dépendances

- **express** - Framework web
- **mongoose** - ODM pour MongoDB
- **cors** - Gestion des requêtes CORS
- **dotenv** - Gestion des variables d'environnement
- **nodemon** (dev) - Rechargement automatique

## 📄 Licence

ISC
