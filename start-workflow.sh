#!/bin/bash
# ============================================
# Quick Start: Admin Workflow
# ============================================

echo "🚀 DevSym Admin Workflow - Quick Start"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm n'est pas installé"
    exit 1
fi

echo "═══════════════════════════════════════"
echo "📋 Instructions:"
echo "═══════════════════════════════════════"
echo ""
echo "1️⃣  Ouvre 2 TERMINAUX"
echo ""
echo "   Terminal 1 (API Server):"
echo "   $ npm run api"
echo ""
echo "   Terminal 2 (Site Local):"
echo "   $ npm run dev"
echo ""
echo "2️⃣  Ouvre http://localhost:3000/admindev.html"
echo ""
echo "3️⃣  Édite tes projets/portfolio"
echo ""
echo "4️⃣  Clique 'Sauvegarder → JSON' dans Export/Import"
echo ""
echo "5️⃣  Commit & Push:"
echo "   $ git add projets.json portfolio.json"
echo "   $ git commit -m 'Maj: projets/portfolio'"
echo "   $ git push origin main"
echo ""
echo "═══════════════════════════════════════"
echo "🔗 Flux d'données:"
echo "═══════════════════════════════════════"
echo ""
echo "admindev.html → localStorage → API Server → JSON files → Git Push"
echo ""
echo "   📝 Remplir le formulaire"
echo "   💾 Sauvegarder en localStorage"
echo "   ☁️  Envoyer à l'API (sur port 3001)"
echo "   📄 Écrire les fichiers JSON"
echo "   📤 Pusher sur GitHub"
echo "   🌐 Synchroniser sur GitHub Pages"
echo ""
