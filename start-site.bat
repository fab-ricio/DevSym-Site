@echo off
REM Lance le site localement depuis le dossier du projet
cd /d "%~dp0"

echo Vérification des dépendances...
call npm install

echo Démarrage du site sur http://localhost:3000 ...
call npm run dev

echo Le serveur a été arrêté.
pause
