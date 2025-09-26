# Script para ejecutar todos los tests del Sistema de Gestión de Gimnasio
# Autor: Sistema de Tests Automatizado
# Fecha: Diciembre 2024

param(
    [string]$TestType = "all",  # all, backend, frontend
    [switch]$Coverage = $false,
    [switch]$Verbose = $false,
    [switch]$Watch = $false
)

# Colores para output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Magenta = "`e[35m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

# Función para mostrar encabezados
function Show-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "$Cyan========================================$Reset" -ForegroundColor Cyan
    Write-Host "$Cyan $Title $Reset" -ForegroundColor Cyan
    Write-Host "$Cyan========================================$Reset" -ForegroundColor Cyan
    Write-Host ""
}

# Función para mostrar resultados
function Show-Result {
    param([string]$TestName, [bool]$Success, [string]$Details = "")
    if ($Success) {
        Write-Host "$Green✅ $TestName - PASSED$Reset" -ForegroundColor Green
    } else {
        Write-Host "$Red❌ $TestName - FAILED$Reset" -ForegroundColor Red
    }
    if ($Details) {
        Write-Host "$Yellow   $Details$Reset" -ForegroundColor Yellow
    }
}

# Variables para tracking de resultados
$Results = @{
    Backend = @{ Success = $false; Details = "" }
    Frontend = @{ Success = $false; Details = "" }
}

# Función para ejecutar tests del backend
function Run-BackendTests {
    Show-Header "TESTS DEL BACKEND (Django)"
    
    $BackendPath = Join-Path $PSScriptRoot "..\backend"
    $TestPath = Join-Path $PSScriptRoot "backend"
    
    if (-not (Test-Path $BackendPath)) {
        Write-Host "$Red❌ Directorio backend no encontrado: $BackendPath$Reset" -ForegroundColor Red
        $Results.Backend.Success = $false
        $Results.Backend.Details = "Directorio no encontrado"
        return
    }
    
    Push-Location $BackendPath
    
    try {
        Write-Host "$Blue🔍 Verificando dependencias...$Reset" -ForegroundColor Blue
        
        # Verificar si existe requirements.txt
        if (Test-Path "requirements.txt") {
            Write-Host "$Yellow📦 Instalando dependencias de Python...$Reset" -ForegroundColor Yellow
            pip install -r requirements.txt | Out-Null
        }
        
        # Verificar si existe requirements-test.txt
        $TestRequirements = Join-Path $TestPath "requirements-test.txt"
        if (Test-Path $TestRequirements) {
            Write-Host "$Yellow📦 Instalando dependencias de test...$Reset" -ForegroundColor Yellow
            pip install -r $TestRequirements | Out-Null
        }
        
        Write-Host "$Blue🧪 Ejecutando tests del backend...$Reset" -ForegroundColor Blue
        
        # Construir comando pytest
        $PytestCmd = "python -m pytest $TestPath"
        if ($Verbose) { $PytestCmd += " -v" }
        if ($Coverage) { $PytestCmd += " --cov=apps --cov-report=html --cov-report=term" }
        
        Write-Host "$Magenta💻 Comando: $PytestCmd$Reset" -ForegroundColor Magenta
        
        # Ejecutar tests
        $Output = Invoke-Expression $PytestCmd 2>&1
        $ExitCode = $LASTEXITCODE
        
        if ($ExitCode -eq 0) {
            $Results.Backend.Success = $true
            $Results.Backend.Details = "Todos los tests pasaron correctamente"
            Show-Result "Tests del Backend" $true $Results.Backend.Details
        } else {
            $Results.Backend.Success = $false
            $Results.Backend.Details = "Algunos tests fallaron (Exit Code: $ExitCode)"
            Show-Result "Tests del Backend" $false $Results.Backend.Details
            
            if ($Verbose) {
                Write-Host "$Red📋 Output detallado:$Reset" -ForegroundColor Red
                Write-Host $Output
            }
        }
        
    } catch {
        $Results.Backend.Success = $false
        $Results.Backend.Details = "Error al ejecutar: $($_.Exception.Message)"
        Show-Result "Tests del Backend" $false $Results.Backend.Details
    } finally {
        Pop-Location
    }
}

# Función para ejecutar tests del frontend
function Run-FrontendTests {
    Show-Header "TESTS DEL FRONTEND (React)"
    
    $FrontendTestPath = Join-Path $PSScriptRoot "frontend"
    
    if (-not (Test-Path $FrontendTestPath)) {
        Write-Host "$Red❌ Directorio de tests frontend no encontrado: $FrontendTestPath$Reset" -ForegroundColor Red
        $Results.Frontend.Success = $false
        $Results.Frontend.Details = "Directorio no encontrado"
        return
    }
    
    Push-Location $FrontendTestPath
    
    try {
        Write-Host "$Blue🔍 Verificando dependencias...$Reset" -ForegroundColor Blue
        
        # Verificar si existe package.json
        if (Test-Path "package.json") {
            Write-Host "$Yellow📦 Instalando dependencias de Node.js...$Reset" -ForegroundColor Yellow
            npm install | Out-Null
        }
        
        Write-Host "$Blue🧪 Ejecutando tests del frontend...$Reset" -ForegroundColor Blue
        
        # Construir comando vitest
        $VitestCmd = "npx vitest run"
        if ($Coverage) { $VitestCmd += " --coverage" }
        if ($Watch) { $VitestCmd = "npx vitest" }
        
        Write-Host "$Magenta💻 Comando: $VitestCmd$Reset" -ForegroundColor Magenta
        
        # Ejecutar tests
        if ($Watch) {
            Write-Host "$Yellow⏱️  Modo watch activado - presiona 'q' para salir$Reset" -ForegroundColor Yellow
            Invoke-Expression $VitestCmd
        } else {
            $Output = Invoke-Expression $VitestCmd 2>&1
            $ExitCode = $LASTEXITCODE
            
            if ($ExitCode -eq 0) {
                $Results.Frontend.Success = $true
                $Results.Frontend.Details = "Todos los tests pasaron correctamente"
                Show-Result "Tests del Frontend" $true $Results.Frontend.Details
            } else {
                $Results.Frontend.Success = $false
                $Results.Frontend.Details = "Algunos tests fallaron (Exit Code: $ExitCode)"
                Show-Result "Tests del Frontend" $false $Results.Frontend.Details
                
                if ($Verbose) {
                    Write-Host "$Red📋 Output detallado:$Reset" -ForegroundColor Red
                    Write-Host $Output
                }
            }
        }
        
    } catch {
        $Results.Frontend.Success = $false
        $Results.Frontend.Details = "Error al ejecutar: $($_.Exception.Message)"
        Show-Result "Tests del Frontend" $false $Results.Frontend.Details
    } finally {
        Pop-Location
    }
}



# Función para mostrar resumen final
function Show-Summary {
    Show-Header "RESUMEN DE RESULTADOS"
    
    $TotalTests = 0
    $PassedTests = 0
    
    foreach ($TestType in $Results.Keys) {
        $TotalTests++
        if ($Results[$TestType].Success) {
            $PassedTests++
        }
        Show-Result $TestType $Results[$TestType].Success $Results[$TestType].Details
    }
    
    Write-Host ""
    Write-Host "$Cyan📊 ESTADÍSTICAS FINALES:$Reset" -ForegroundColor Cyan
    Write-Host "$Green   ✅ Tests Pasados: $PassedTests$Reset" -ForegroundColor Green
    Write-Host "$Red   ❌ Tests Fallidos: $($TotalTests - $PassedTests)$Reset" -ForegroundColor Red
    Write-Host "$Blue   📈 Porcentaje de Éxito: $([math]::Round(($PassedTests / $TotalTests) * 100, 2))%$Reset" -ForegroundColor Blue
    
    if ($Coverage) {
        Write-Host ""
        Write-Host "$Yellow📋 Reportes de cobertura generados en:$Reset" -ForegroundColor Yellow
        Write-Host "$Yellow   - Backend: backend/htmlcov/index.html$Reset" -ForegroundColor Yellow
        Write-Host "$Yellow   - Frontend: test/frontend/coverage/index.html$Reset" -ForegroundColor Yellow
    }
    
    Write-Host ""
    if ($PassedTests -eq $TotalTests) {
        Write-Host "$Green🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE! 🎉$Reset" -ForegroundColor Green
    } else {
        Write-Host "$Red⚠️  ALGUNOS TESTS FALLARON - REVISAR DETALLES ARRIBA ⚠️$Reset" -ForegroundColor Red
    }
}

# Función principal
function Main {
    $StartTime = Get-Date
    
    Show-Header "SISTEMA DE TESTS - GESTIÓN DE GIMNASIO"
    Write-Host "$Blue🚀 Iniciando ejecución de tests...$Reset" -ForegroundColor Blue
    Write-Host "$Yellow📅 Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')$Reset" -ForegroundColor Yellow
    Write-Host "$Yellow🎯 Tipo de test: $TestType$Reset" -ForegroundColor Yellow
    if ($Coverage) { Write-Host "$Yellow📊 Cobertura: Habilitada$Reset" -ForegroundColor Yellow }
    if ($Verbose) { Write-Host "$Yellow🔍 Modo verbose: Habilitado$Reset" -ForegroundColor Yellow }
    if ($Watch) { Write-Host "$Yellow⏱️  Modo watch: Habilitado$Reset" -ForegroundColor Yellow }
    
    # Ejecutar tests según el tipo especificado
    switch ($TestType.ToLower()) {
        "backend" { Run-BackendTests }
        "frontend" { Run-FrontendTests }
        "all" {
            Run-BackendTests
            Run-FrontendTests
        }
        default {
            Write-Host "$Red❌ Tipo de test no válido: $TestType$Reset" -ForegroundColor Red
            Write-Host "$Yellow💡 Tipos válidos: all, backend, frontend$Reset" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Mostrar resumen si no estamos en modo watch
    if (-not $Watch) {
        Show-Summary
        
        $EndTime = Get-Date
        $Duration = $EndTime - $StartTime
        Write-Host ""
        Write-Host "$Cyan⏱️  Tiempo total de ejecución: $($Duration.ToString('mm\:ss'))$Reset" -ForegroundColor Cyan
    }
}

# Mostrar ayuda si se solicita
if ($args -contains "-h" -or $args -contains "--help") {
    Write-Host ""
    Write-Host "$Cyan=== AYUDA - SCRIPT DE TESTS ===$Reset" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "$Yellow📖 Uso:$Reset" -ForegroundColor Yellow
    Write-Host "  .\run-tests.ps1 [-TestType <tipo>] [-Coverage] [-Verbose] [-Watch]"
    Write-Host ""
    Write-Host "$Yellow📋 Parámetros:$Reset" -ForegroundColor Yellow
    Write-Host "  -TestType    Tipo de tests a ejecutar (all, backend, frontend)"
    Write-Host "  -Coverage    Generar reportes de cobertura"
    Write-Host "  -Verbose     Mostrar output detallado"
    Write-Host "  -Watch       Ejecutar en modo watch (solo frontend)"
    Write-Host ""
    Write-Host "$Yellow💡 Ejemplos:$Reset" -ForegroundColor Yellow
    Write-Host "  .\run-tests.ps1                          # Ejecutar todos los tests"
    Write-Host "  .\run-tests.ps1 -TestType backend        # Solo tests del backend"
    Write-Host "  .\run-tests.ps1 -Coverage -Verbose       # Con cobertura y verbose"
    Write-Host "  .\run-tests.ps1 -TestType frontend -Watch # Frontend en modo watch"
    Write-Host ""
    exit 0
}

# Ejecutar función principal
Main