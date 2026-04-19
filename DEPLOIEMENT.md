# Guide de Déploiement - DevSym Site Statique

## Architecture

Ce site est maintenant **100% statique** et ne requiert aucun backend. 

**Fichiers clés:**
- Pages HTML: `index.html`, `portfolio.html`, `services.html`, `projet.html`, `contact.html`, `about.html`, `media.html`
- Données statiques (JSON): `portfolio.json`, `services.json`, `projets.json`, `partners.json`, `social-links.json`
- Styles: `style.css`
- Scripts frontend: `main.js`, `services.js`, `projet.js`, `portfolio.js`, `social-feeds.js`

## Développement Local

### Installation
```bash
npm install
```

### Lancer le serveur local
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## Déploiement sur Vercel

### Option 1: Déploiement automatique (recommandé)
1. Connectez votre repo GitHub/GitLab à Vercel
2. Vercel détectera automatiquement qu'il s'agit d'un site statique
3. À chaque push, le site sera redéployé

### Option 2: Déploiement manuel
```bash
npm install -g vercel
vercel
```

Suivez les instructions et confirmez la configuration.

## Édition du Contenu

Comme le site est statique, **éditez le contenu directement dans les fichiers JSON**:

### Ajouter/modifier des services
→ Modifiez `services.json`

### Ajouter/modifier des projets
→ Modifiez `projets.json`

### Ajouter/modifier le portfolio
→ Modifiez `portfolio.json` ou le HTML dans `portfolio.html`

### Ajouter/modifier les partenaires
→ Modifiez `partners.json`

### Réseaux sociaux
→ Modifiez `social-links.json`

## Performance

- ✅ Très rapide (pas de backend à interroger)
- ✅ Facile à cacher (CDN edge Vercel)
- ✅ Pas de sécurité à gérer (pas d'authentification)
- ✅ Zéro maintenance du serveur

## Notes

- Les images sont stockées dans le dossier `images/`
- Tous les chemins d'images dans les JSON utilisent le préfixe `images/`
- Le site supporte les lazy loading des images pour optimiser le chargement

---

**Besoin d'ajouter un formulaire de contact dynamique?** Vous pouvez utiliser des services externes comme Formspree, Netlify Forms, ou SendGrid sans backend.
