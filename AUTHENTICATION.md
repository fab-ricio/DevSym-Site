# 🔐 Authentification Admin & Accès à distance

## 🔑 Mot de passe Admin

**Par défaut:** `devsym2026`

### Changer le mot de passe

Édite [admindev.js](admindev.js) ligne 16:

```javascript
const ADMIN_PASSWORD = "devsym2026"; // Change this to your password
```

Remplace par ton mot de passe:

```javascript
const ADMIN_PASSWORD = "votreMotDePasse123"; // Plus sûr
```

**⚠️ Important:**
- Le mot de passe est stocké dans le code source (visible à tous qui clonent le repo)
- Utilise un mot de passe différent de tes autres comptes
- Change-le régulièrement

---

## 🔒 Sécurité

### Local (recommandé) ✅
```
Client → http://localhost:3000/admindev.html
         (authentification requise)
```

### À distance (3 options)

---

## 📱 Option 1: Sur le même réseau (LAN)

### Serveur (ta machine):

```bash
npm run api
npm run dev  # Dans un autre terminal
```

### Client (autre machine sur le même réseau):

1. Trouve l'IP de ta machine Windows:
```bash
ipconfig
```
Cherche: `Adresse IPv4: 192.168.x.x`

2. Dans le navigateur du client:
```
http://192.168.x.x:3000/admindev.html
```

3. Entre le mot de passe: `devsym2026`

**Avantages:** ✅ Simple, pas de config
**Inconvénients:** ❌ Seulement sur le LAN local

---

## 🌐 Option 2: Via Ngrok (partout dans le monde)

### Installer Ngrok

1. Va sur https://ngrok.com/download
2. Télécharge et installe
3. Crée un compte gratuit

### Utiliser Ngrok

**Terminal 1** - API Server:
```bash
npm run api
```

**Terminal 2** - Site local:
```bash
npm run dev
```

**Terminal 3** - Ngrok tunnel:
```bash
ngrok http 3000
```

Tu verras:
```
Forwarding    https://abc123def456.ngrok.io -> http://localhost:3000
```

**Accès distant:**
```
https://abc123def456.ngrok.io/admindev.html
```

Entre le mot de passe et c'est bon! ✅

**Avantages:** ✅ Accessible partout, facile
**Inconvénients:** ❌ URL change à chaque redémarrage, ngrok gratuit a limites

---

## ☁️ Option 3: Déployer sur un serveur cloud

Pour une vraie solution production:

### Services recommandés:
- **Railway.app** - Gratuit/payant
- **Render.com** - Gratuit/payant  
- **Heroku** - Payant (gratuit fermé)
- **AWS** - Gratuit/payant

### Exemple: Déployer sur Railway

1. Crée un compte sur https://railway.app
2. Connecte ton repo GitHub
3. Railway déploie automatiquement
4. Tu accèdes via: `https://ton-app.railway.app/admindev.html`

**Avantages:** ✅ Production ready, scalable, URL stable
**Inconvénients:** ❌ Plus complexe à setup, nécessite créer compte

---

## 📝 Résumé des accès

| Situation | Commande | URL | Sécurité |
|-----------|----------|-----|----------|
| **Même PC** | `npm run api + npm run dev` | `http://localhost:3000/admindev.html` | 🟢 Local |
| **Même réseau** | Pareil | `http://192.168.x.x:3000/admindev.html` | 🟡 LAN |
| **Partout (ngrok)** | + `ngrok http 3000` | `https://abc123.ngrok.io/admindev.html` | 🟡 Public |
| **Production** | Railway/Render | `https://ton-app.com/admindev.html` | 🟢 Professionnel |

---

## 🔐 Session

- La session dure tant que le navigateur est ouvert
- Ferme le navigateur = déconnexion automatique
- Ou clique "Déconnexion" en haut à droite

**Clé de session:** `sessionStorage.admin_authenticated`

---

## ❓ Questions courantes

### Q: Le mot de passe est en clair dans le code, c'est sûr?

**R:** Non, c'est juste pour une protection basique. Pour vraie sécurité:
- Option 1: Utilise une authentification backend (OAuth, JWT)
- Option 2: Utilise un `.env` non committé
- Option 3: Pour ta thèse/MVP, ça suffit

### Q: Accès depuis mon téléphone?

**R:** Oui, même procédure que "Même réseau":
1. Trouve l'IP: `ipconfig` sur ta machine
2. Sur ton tel WiFi: `http://192.168.x.x:3000/admindev.html`

### Q: Comment cacher l'URL admin?

**R:** Actuellement c'est `/admindev.html`. Tu peux:
- Renommer en quelque chose d'obscur `/admin-devsym-panel-123456.html`
- Ajouter un `.htaccess` pour protéger (Apache)
- Déployer sur serveur avec reverse proxy

---

## 🚀 Recommandation

**Pour développement:** Option 1 (localhost) ou Option 2 (ngrok)
**Pour production:** Option 3 (serveur cloud)
