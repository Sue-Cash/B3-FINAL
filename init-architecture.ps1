# --------------------------------------------------------------------------------------------------
# Script : init-architecture.ps1
# Objet  : Créer l'arborescence src/app/... décrite dans la demande
# Usage   : Placez ce script à la racine de votre projet (au même niveau que src/)
#           Puis exécutez : .\init-architecture.ps1
# --------------------------------------------------------------------------------------------------

# 1. Se placer dans le dossier src
$root = Join-Path $PSScriptRoot 'src'
if (!(Test-Path $root)) {
    Write-Error "Le dossier 'src' est introuvable sous $PSScriptRoot"
    exit 1
}
Set-Location $root

# 2. Définir les répertoires à créer
$dirs = @(
    'app\components\auth\register',
    'app\components\auth\login',
    'app\components\dashboard',
    'app\services',
    'app\guards',
    'app\interceptors',
    'app',                # pour les fichiers à la racine de app
    'environments'
)

# 3. Définir les fichiers à créer
$files = @(
    # Composants auth/register
    'app\components\auth\register\register.component.ts',
    'app\components\auth\register\register.component.html',
    'app\components\auth\register\register.component.scss',

    # Composants auth/login
    'app\components\auth\login\login.component.ts',
    'app\components\auth\login\login.component.html',
    'app\components\auth\login\login.component.scss',

    # Composant dashboard
    'app\components\dashboard\dashboard.component.ts',
    'app\components\dashboard\dashboard.component.html',
    'app\components\dashboard\dashboard.component.scss',

    # Services
    'app\services\auth.service.ts',
    'app\services\task.service.ts',
    'app\services\objective.service.ts',
    'app\services\user.service.ts',

    # Guards
    'app\guards\auth.guard.ts',
    'app\guards\no-auth.guard.ts',

    # Interceptors
    'app\interceptors\auth.interceptor.ts',
    'app\interceptors\error.interceptor.ts',

    # Fichiers à la racine de app
    'app\app-routing.module.ts',
    'app\app.module.ts',
    'app\app.component.ts',

    # Environnements
    'environments\environment.ts',
    'environments\environment.prod.ts',

    # Styles global
    'styles.scss'
)

# 4. Création des répertoires
foreach ($d in $dirs) {
    $fullPath = Join-Path $root $d
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Création du dossier : $d"
    } else {
        Write-Host "Existe déjà : $d"
    }
}

# 5. Création des fichiers vides
foreach ($f in $files) {
    $fullFile = Join-Path $root $f
    if (!(Test-Path $fullFile)) {
        # S’assure que le dossier parent existe
        $parent = Split-Path $fullFile -Parent
        if (!(Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        New-Item -ItemType File -Path $fullFile -Force | Out-Null
        Write-Host "Fichier créé : $f"
    } else {
        Write-Host "Fichier existe : $f"
    }
}

# 6. Confirmation finale
Write-Host "`n✅ Arborescence initialisée avec succès !`n"
# Optionnel : afficher l’arborescence
Get-ChildItem -Recurse -Force
