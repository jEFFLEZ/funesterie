# A11 Launchers

Ce dossier contient l'orchestration locale transverse de `A11`.

## Fichiers principaux

- `start-all-a11.bat` / `start-all-a11.ps1`
  Lance la stack locale complete.
- `start-prod-a11.bat` / `start-prod-a11.ps1`
  Lance le mode "full en ligne" avec le minimum de local.

## Comportement

Les lanceurs essayent d'eviter l'effet "15 terminaux ouverts":

- lancement discret des processus quand c'est possible
- verification des ports avant de relancer un service
- logs centralises dans `launchers\runtime\logs`
- wrappers legacy conserves seulement pour compatibilite

## Raison d'etre

Ces scripts vivent ici pour eviter de melanger l'orchestration globale avec:

- `a11backendrailway` pour le backend
- `a11frontendnetlify` pour le frontend
- `a11llm` pour le LLM local
- `a11qflushrailway` pour qflush

## Compatibilite

Les anciens scripts dans `a11backendrailway` restent presents comme wrappers de compatibilite et redirigent vers ce dossier.
