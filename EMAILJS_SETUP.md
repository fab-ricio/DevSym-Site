# Configuration EmailJS - Formulaire de Contact

## 🔧 Comment configurer EmailJS

### Étape 1: Créer un compte EmailJS
1. Allez sur https://www.emailjs.com
2. Cliquez sur **Sign Up** (gratuit)
3. Connectez-vous avec votre email

### Étape 2: Récupérer vos identifiants

#### 📌 Service ID
1. Dashboard → **Email Services** (gauche)
2. Cliquez sur **Add Service**
3. Choisissez votre provider:
   - **Gmail**: Choisissez Gmail, suivez les instructions
   - **Outlook/Hotmail**: Choisissez Outlook, suivez les instructions
4. Une fois configuré, vous aurez un **Service ID** (ex: `service_abc123def`)
5. Notez-le!

#### 🔑 Public Key
1. Dashboard → **Account** (en haut à droite)
2. Onglet **General**
3. Copiez votre **Public Key** (commence par `pk_`)
4. Notez-la!

#### 📧 Template ID
1. Dashboard → **Email Templates** (gauche)
2. Cliquez sur **Create New Template**
3. Nommez-le: `contact_form` (ou ce que vous voulez)
4. **Body du template** (obligatoire):
   ```
   Nom: {{from_name}}
   Email: {{from_email}}
   Objet: {{subject}}
   
   Message:
   {{message}}
   ```
5. Sauvegardez
6. Copiez l'ID du template affiché en haut

---

## 🎯 Mettre vos clés dans le code

### Dans le fichier `contact.js`:

Ouvrez `contact.js` et remplacez ces lignes:

```javascript
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";  // ← Mettez votre Service ID ici
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";   // ← Mettez votre Public Key ici
const EMAILJS_TEMPLATE_ID = "contact_form";    // ← Changez si vous avez choisi un autre nom
```

**Exemple:**
```javascript
const EMAILJS_SERVICE_ID = "service_a1b2c3d4e5f6g7";
const EMAILJS_PUBLIC_KEY = "pk_xyz123abc456def789";
const EMAILJS_TEMPLATE_ID = "contact_form";
```

---

## 📨 Email de réception

Par défaut, l'email est envoyé à: `coopdevsym1@gmail.com`

**Pour changer l'email de réception:**

Option A: Dans `contact.js`, ligne ~42:
```javascript
to_email: "votre-email@example.com", // Changez ici
```

Option B (mieux): Dans le template EmailJS, ajoutez une variable `{{to_email}}` dans le body.

---

## ✅ Tester le formulaire

1. Lancez le serveur local: `npm run dev`
2. Allez sur http://localhost:3000/contact.html
3. Remplissez et envoyez un test
4. Vous devriez recevoir l'email dans votre boîte

---

## 🐛 Dépannage

**"Erreur - Réessayez"**
- Vérifiez vos clés (Service ID, Public Key)
- Vérifiez que votre service email est activé
- Console browser (F12) → onglet Console pour voir l'erreur exacte

**Email non reçu**
- Vérifiez votre template ID
- Vérifiez que le service email est bien connecté dans EmailJS

**Le formulaire ne réagit pas**
- Vérifiez que `contact.js` est chargé (F12 → Network)
- Vérifiez la console pour les erreurs

---

## 💡 Notes

- ✅ EmailJS est **gratuit et illimité** pour les particuliers
- ✅ Pas de backend nécessaire - tout fonctionne côté client
- ✅ Vos clés publiques sont sûres (pas d'accès aux données sensibles)
- 🔒 Ne partagez jamais votre **clé privée** (il n'y en a pas ici)

---

**Besoin d'aide?** Consultez la doc officielle: https://www.emailjs.com/docs/
