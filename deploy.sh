#!/bin/bash

# Script de déploiement rapide pour le backend
# Usage: ./deploy.sh

echo "🚀 Déploiement du backend..."

# Récupérer les dernières modifications
echo "📥 Git pull..."
git pull origin main

# Rebuild et redémarrer le conteneur
echo "🔨 Rebuild de l'image Docker..."
docker-compose up -d --build --force-recreate backend

# Attendre que le conteneur démarre
echo "⏳ Démarrage du conteneur..."
sleep 3

# Vérifier le statut
echo ""
echo "📊 Statut des conteneurs:"
docker ps

echo ""
echo "📋 Derniers logs:"
docker logs paneladmin_backend --tail 20

echo ""
echo "✅ Déploiement terminé!"
echo "🔗 Test: curl http://localhost:5000/api/health"
