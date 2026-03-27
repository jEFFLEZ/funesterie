# A11 Local Package Plan

Aucun dossier source n'est deplace par ce process.
Le packaging copie dans un staging propre, pret a zipper.

Package root: D:\funesterie\a11\launchers\dist\a11-local

| Element | Emplacement actuel | Emplacement cible | Raison |
| --- | --- | --- | --- |
| backend | D:\funesterie\a11\a11backendrailway\apps\server | D:\funesterie\a11\launchers\dist\a11-local\backend | API locale A11 |
| tts | D:\funesterie\a11\a11backendrailway\apps\tts | D:\funesterie\a11\launchers\dist\a11-local\tts | Service audio local |
| llm | D:\funesterie\a11\a11llm | D:\funesterie\a11\launchers\dist\a11-local\llm | Runtime local + modeles |
| qflush | D:\funesterie\a11\a11qflushrailway | D:\funesterie\a11\launchers\dist\a11-local\qflush | Orchestration separee optionnelle |
| launcher | D:\funesterie\a11\launchers | D:\funesterie\a11\launchers\dist\a11-local\launcher | Demarrage one-click et supervision locale |
| frontend-dist | D:\funesterie\a11\a11frontendnetlify\apps\web\dist | D:\funesterie\a11\launchers\dist\a11-local\backend\web\dist | UI web embarquee servie par le backend local |
