#!/bin/bash
echo "🚀 Déploiement du backend..."

# Nettoyage
echo "🧹 Nettoyage Docker..."
docker-compose down --remove-orphans 2>/dev/null || true
docker system prune -f

# Lancement
echo "🔨 Rebuild et démarrage..."
docker-compose up -d --build

echo "📊 Statut :"
docker ps
