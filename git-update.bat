@echo off
REM Ajoute les fichiers, fait un commit et pousse vers la branche distante
cd /d "%~dp0"

echo Ajout des fichiers au commit...
call git add .

echo Saisissez le message du commit :
set /p COMMIT_MESSAGE=Message du commit: 

if "%COMMIT_MESSAGE%"=="" (
  echo Message du commit vide. Annulation.
  pause
  exit /b 1
)

echo Commit en cours...
call git commit -m "%COMMIT_MESSAGE%"
if errorlevel 1 (
  echo Commit annulé ou aucune modification à committer.
) else (
  echo Push vers le dépôt distant...
  call git push
)

pause
