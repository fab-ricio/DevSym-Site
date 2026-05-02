#NoEnv
SendMode Input
SetWorkingDir, %A_ScriptDir%

pidDev := 0
pidApi := 0

Gui, Font, s10, Segoe UI
Gui, Add, Text, x10 y10 w380 h20, DevSym Launcher — démarrage site + mise à jour Git
Gui, Add, Button, x10 y40 w110 h32 gStartServers, Start
Gui, Add, Button, x130 y40 w110 h32 gStopServers, Stop
Gui, Add, Button, x250 y40 w110 h32 gUpdateGit, Update
Gui, Add, Edit, x10 y84 w370 h180 vLog ReadOnly +WantReturn +WantTab,
Gui, Add, Text, x10 y275 w370 h20 cGray, Remarque : npm et git doivent être installés et disponibles dans le PATH.
Gui, Show, w390 h310, DevSym Launcher

return

StartServers:
    if (pidDev || pidApi) {
        Log("Le site ou l'API sont déjà démarrés.")
        return
    }

    Log("Démarrage du site...")
    Run, %ComSpec% /k "cd /d %A_ScriptDir% && npm run dev", , , pidDev
    Sleep, 400
    Log("Démarrage de l'API...")
    Run, %ComSpec% /k "cd /d %A_ScriptDir% && npm run api", , , pidApi
    Sleep, 400
    Log("Site et API démarrés.")
return

StopServers:
    if !(pidDev || pidApi) {
        Log("Aucun serveur n'est en cours d'exécution.")
        return
    }

    if (pidDev) {
        RunWait, %ComSpec% /c taskkill /PID %pidDev% /F /T, , Hide
        Log("Arrêt du serveur site (npm run dev)")
        pidDev := 0
    }
    if (pidApi) {
        RunWait, %ComSpec% /c taskkill /PID %pidApi% /F /T, , Hide
        Log("Arrêt du serveur API (npm run api)")
        pidApi := 0
    }
    Log("Tous les serveurs ont été arrêtés.")
return

UpdateGit:
    InputBox, CommitMsg, Git Update, Message du commit :, , 320, 140
    if (ErrorLevel) {
        Log("Mise à jour Git annulée.")
        return
    }

    if (CommitMsg = "") {
        MsgBox, 48, Erreur, Le message de commit ne peut pas être vide.
        return
    }

    quoted := Chr(34) . CommitMsg . Chr(34)
    Log("Ajout des fichiers au commit...")
    RunWait, %ComSpec% /c "cd /d %A_ScriptDir% && git add . && git commit -m %quoted% && git push", , Hide, exitCode
    if (exitCode = 0) {
        Log("Mise à jour Git réussie.")
    } else {
        Log("Échec de la mise à jour Git. Vérifie les erreurs dans le terminal.")
    }
return

GuiClose:
GuiEscape:
    ExitApp
return

Log(text) {
    GuiControlGet, current, , Log
    if (current != "")
        current .= "`n"
    current .= text
    GuiControl,, Log, %current%
}
