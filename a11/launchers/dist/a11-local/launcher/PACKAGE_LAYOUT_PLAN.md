# A11 Local Package Plan

Aucun dossier source n'est deplace.
Le packaging cible est un staging propre, pret a zipper ensuite.

| Element | Emplacement actuel | Emplacement cible | Raison |
| --- | --- | --- | --- |
| Backend API | `a11backendrailway\apps\server` | `/backend` | Garder la couche API A11 separee du reste. |
| TTS | `a11backendrailway\apps\tts` | `/tts` | Isoler le service audio local. |
| LLM | `a11llm` | `/llm` | Conserver le runtime local et ses assets hors du backend. |
| Qflush | `a11qflushrailway` | `/qflush` | Garder l'orchestration dans son domaine dedie. |
| Launcher | `launchers` | `/launcher` | Fournir le demarrage `one-click`, le stop, le status et les logs. |
| Frontend build | `a11frontendnetlify\apps\web\dist` | `/backend/web/dist` | Servir l'UI embarquee localement sans process frontend obligatoire. |

Notes:
- Le package local vise un demarrage en 1 clic.
- Le frontend n'est pas un dossier top-level du ZIP: il est embarque comme build statique dans le backend local.
- Les scripts de staging copient, ils ne deplacent rien dans le workspace source.
