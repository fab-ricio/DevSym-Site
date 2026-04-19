# 📚 Guide: Workflow Admin → JSON → Git

## Flux de travail complet

```
admindev.html (formulaire)
    ↓
localStorage (données locales)
    ↓
Bouton "💾 Sauvegarder → JSON"
    ↓
API Server (api-server.js)
    ↓
projets.json / portfolio.json (fichiers)
    ↓
git commit & git push
```

---

## 🚀 Instructions d'utilisation

### **1. Démarrer le serveur API**

Ouvre un **terminal** et lance:

```bash
npm run api
```

Vous devriez voir:
```
🚀 API Server démarré sur http://localhost:3001
📝 Endpoint: POST /api/save-data
💾 Les données seront sauvegardées dans les fichiers JSON
```

### **2. Démarrer le site local**

Dans un **autre terminal**, lance:

```bash
npm run dev
```

Le site sera accessible sur http://localhost:3000

### **3. Éditer dans l'Admin**

1. Ouvre http://localhost:3000/admindev.html
2. Crée/modifie tes projets et portfolio
3. Clique sur **"Enregistrer"** pour sauvegarder dans localStorage

### **4. Sauvegarder dans les fichiers JSON**

Dans l'onglet **"Export/Import"** de l'admin:

- Clique sur **"💾 Sauvegarder Projets → JSON"** pour projets.json
- Clique sur **"💾 Sauvegarder Portfolio → JSON"** pour portfolio.json

Tu verras un message: ✅ projets.json sauvegardé avec succès

### **5. Committer et Pusher**

Une fois tes données sauvegardées dans les fichiers JSON:

```bash
git status                  # Voir les fichiers modifiés
git add projets.json portfolio.json
git commit -m "Mise à jour projets/portfolio"
git push origin main
```

---

## 📋 Workflow complet en 1 exemple

**Scénario**: Ajouter un nouveau projet

```bash
# Terminal 1: Démarrer l'API
npm run api

# Terminal 2: Démarrer le site
npm run dev

# Navigateur:
# 1. Va à http://localhost:3000/admindev.html
# 2. Onglet "Projets"
# 3. Clique "Ajouter un nouveau projet"
# 4. Remplis le formulaire
# 5. Clique "Enregistrer"
# 6. Va à "Export/Import"
# 7. Clique "💾 Sauvegarder Projets → JSON"
# 8. Vérifie le message ✅

# Terminal 3: Commit & Push
git add projets.json
git commit -m "Ajouter nouveau projet"
git push origin main
```

---

## ✅ Vérification

Pour vérifier que c'est bien sauvegardé:

1. **Localement**: Rafraîchis portfolio.html/projet.html - tu dois voir les changements
2. **Git**: `git diff projets.json` - tu dois voir les modifications
3. **GitHub**: Va sur https://github.com/fab-ricio/DevSym-Site pour voir le commit

---

## 🆘 Troubleshooting

### "Erreur de connexion au serveur API"

- ✅ Vérifies que `npm run api` est en cours d'exécution
- ✅ Vérifies que le port 3001 est disponible
- ✅ Regarde la console du navigateur (F12) pour les erreurs

### "JSON invalide"

- ✅ Vérifie que tu n'as pas des caractères spéciaux dans tes données
- ✅ Essaie d'exporter et de recharger l'import

### Les changements ne s'affichent pas sur le site

1. Lis l'onglet "Export/Import"
2. Clique "💾 Sauvegarder Projets → JSON"
3. Rafraîchis portfolio.html/projet.html
4. Les changements doivent apparaître

---

## 🔄 Processus récurrent

**Chaque fois que tu veux faire une mise à jour:**

1. Modifie dans admindev.html
2. Clique "💾 Sauvegarder → JSON"
3. Commit & Push via Git
4. Les changements s'appliquent sur GitHub Pages automatiquement ✨

---

**Questions?** Consulte le code dans:
- `admindev.html` - UI des formulaires
- `admindev.js` - Logique de formulaire + `saveProjectsToFile()` / `savePortfolioToFile()`
- `api-server.js` - Serveur qui écrit les fichiers JSON
