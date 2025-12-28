#!/bin/bash

# Script de déploiement optimisé pour Amazon Linux 2023
# Fichier de config : docker-compose.backend.yml

echo "🚀 Déploiement du backend..."

# 1. Récupérer les dernières modifications
echo "📥 Git pull..."
git pull origin main

# 2. Définir la commande de base (pour éviter les répétitions et gérer le fichier spécifique)
# On utilise 'docker compose' (espace) qui est le standard AL2023
DOCKER_CMD="docker compose -f docker-compose.backend.yml"

# 3. Nettoyer proprement
echo "🧹 Nettoyage Docker..."
$DOCKER_CMD down --remove-orphans 2>/dev/null || true
docker system prune -f

# 4. Rebuild et redémarrer
# Note : on utilise 'up --build' pour tout faire en une étape
echo "🔨 Rebuild et démarrage de l'image Docker..."
$DOCKER_CMD up -d --build

# 5. Attendre que le conteneur démarre
echo "⏳ Démarrage du conteneur en cours..."
sleep 5

# 6. Vérifier le statut
echo ""
echo "📊 Statut des conteneurs:"
$DOCKER_CMD ps

echo ""
echo "📋 Derniers logs (5 dernières lignes):"
$DOCKER_CMD logs --tail 5

echo ""
echo "✅ Déploiement terminé!"
echo "🔗 Test local: curl http://localhost:5000/api/health"
