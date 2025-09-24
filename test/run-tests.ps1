# Script de PowerShell para ejecutar tests del Sistema de Gestión de Gimnasio
# Uso: .\run-tests.ps1 [backend|frontend|integration|all]

param(
    [Parameter(Position=0)]
    [ValidateSet("backend", "frontend", "integration", "all", "coverage", "ci")]
    [string]$TestType = "all"
)

# Colores para output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Blue"

# Función para mostrar mensajes con colores
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Función para verificar si un comando existe
function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Verificar prerrequisitos
function Test-Prerequisites {
    Write-ColorOutput "🔍 Verificando prerrequisitos..." $Blue
    
    if (-not (Test-Command "python")) {
        Write-ColorOutput "❌ Python no está instalado o no está en PATH" $Red
        return $false
    }
    
    if (-not (Test-Command "npm")) {
        Write-ColorOutput "❌ Node.js/npm no está instalado o no está en PATH" $Red
        return $false
    }
    
    Write-ColorOutput "✅ Prerrequisitos verificados" $Green
    return $true
}

# Función para verificar servidores
function Test-Servers {
    Write-ColorOutput "🌐 Verificando servidores..." $Blue
    
    # Verificar backend
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/health/" -TimeoutSec 5 -ErrorAction Stop
        Write-ColorOutput "✅ Backend server está corriendo" $Green
    } catch {
        Write-ColorOutput "⚠️  Backend server no está disponible en http://127.0.0.1:8000" $Yellow
        Write-ColorOutput "   Asegúrate de ejecutar: cd backend && python manage.py runserver" $Yellow
    }
    
    # Verificar frontend (opcional para algunos tests)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -ErrorAction Stop
        Write-ColorOutput "✅ Frontend server está corriendo" $Green
    } catch {
        Write-ColorOutput "⚠️  Frontend server no está disponible en http://localhost:5173" $Yellow
        Write-ColorOutput "   Para tests de integración, ejecuta: cd gymfront && npm run dev" $Yellow
    }
}

# Función para ejecutar tests del backend
function Invoke-BackendTests {
    Write-ColorOutput "🐍 Ejecutando tests del backend..." $Blue
    
    Push-Location "backend"
    
    # Verificar si pytest está instalado
    $pytestInstalled = python -c "import pytest" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "📦 Instalando dependencias de testing..." $Yellow
        pip install -r "../test/backend/requirements-test.txt"
    }
    
    # Ejecutar tests
    python -m pytest "../test/backend/" -v --tb=short
    $backendResult = $LASTEXITCODE
    
    Pop-Location
    
    if ($backendResult -eq 0) {
        Write-ColorOutput "✅ Tests del backend completados exitosamente" $Green
    } else {
        Write-ColorOutput "❌ Tests del backend fallaron" $Red
    }
    
    return $backendResult
}

# Función para ejecutar tests del frontend
function Invoke-FrontendTests {
    Write-ColorOutput "⚛️  Ejecutando tests del frontend..." $Blue
    
    # Verificar si node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput "📦 Instalando dependencias..." $Yellow
        npm install
    }
    
    # Ejecutar tests
    Set-Location "frontend"
    npx vitest run
    $frontendResult = $LASTEXITCODE
    Set-Location ".."
    
    if ($frontendResult -eq 0) {
        Write-ColorOutput "✅ Tests del frontend completados exitosamente" $Green
    } else {
        Write-ColorOutput "❌ Tests del frontend fallaron" $Red
    }
    
    return $frontendResult
}

# Función para ejecutar tests de integración
function Invoke-IntegrationTests {
    Write-ColorOutput "🔗 Ejecutando tests de integración..." $Blue
    
    # Verificar servidores antes de tests de integración
    Test-Servers
    
    # Verificar si node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput "📦 Instalando dependencias..." $Yellow
        npm install
    }
    
    # Ejecutar tests
    Set-Location "integration"
    npx vitest run
    $integrationResult = $LASTEXITCODE
    Set-Location ".."
    
    if ($integrationResult -eq 0) {
        Write-ColorOutput "✅ Tests de integración completados exitosamente" $Green
    } else {
        Write-ColorOutput "❌ Tests de integración fallaron" $Red
    }
    
    return $integrationResult
}

# Función para ejecutar tests con cobertura
function Invoke-CoverageTests {
    Write-ColorOutput "📊 Ejecutando tests con cobertura..." $Blue
    
    # Backend con cobertura
    Write-ColorOutput "🐍 Cobertura del backend..." $Blue
    Push-Location "backend"
    python -m pytest "../test/backend/" --cov=. --cov-report=html --cov-report=term
    $backendCoverage = $LASTEXITCODE
    Pop-Location
    
    # Frontend con cobertura
    Write-ColorOutput "⚛️  Cobertura del frontend..." $Blue
    if (-not (Test-Path "node_modules")) {
        npm install
    }
    Set-Location "frontend"
    npx vitest run --coverage
    $frontendCoverage = $LASTEXITCODE
    Set-Location ".."
    
    if ($backendCoverage -eq 0 -and $frontendCoverage -eq 0) {
        Write-ColorOutput "✅ Tests de cobertura completados exitosamente" $Green
        Write-ColorOutput "📊 Reportes de cobertura:" $Blue
        Write-ColorOutput "   Backend: backend/htmlcov/index.html" $Blue
        Write-ColorOutput "   Frontend: frontend/coverage/index.html" $Blue
    } else {
        Write-ColorOutput "❌ Tests de cobertura fallaron" $Red
    }
    
    return ($backendCoverage + $frontendCoverage)
}

# Función principal
function Main {
    Write-ColorOutput "🧪 Sistema de Tests - Gestión de Gimnasio" $Blue
    Write-ColorOutput "===========================================" $Blue
    
    # Verificar prerrequisitos
    if (-not (Test-Prerequisites)) {
        exit 1
    }
    
    # Cambiar al directorio de tests
    $testDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $testDir
    
    $totalResult = 0
    
    switch ($TestType) {
        "backend" {
            $totalResult = Invoke-BackendTests
        }
        "frontend" {
            $totalResult = Invoke-FrontendTests
        }
        "integration" {
            $totalResult = Invoke-IntegrationTests
        }
        "coverage" {
            $totalResult = Invoke-CoverageTests
        }
        "ci" {
            Write-ColorOutput "🚀 Ejecutando suite completa para CI/CD..." $Blue
            $backendResult = Invoke-BackendTests
            $frontendResult = Invoke-FrontendTests
            $integrationResult = Invoke-IntegrationTests
            $totalResult = $backendResult + $frontendResult + $integrationResult
        }
        "all" {
            Write-ColorOutput "🚀 Ejecutando todos los tests..." $Blue
            $backendResult = Invoke-BackendTests
            $frontendResult = Invoke-FrontendTests
            $integrationResult = Invoke-IntegrationTests
            $totalResult = $backendResult + $frontendResult + $integrationResult
        }
    }
    
    Write-ColorOutput "===========================================" $Blue
    if ($totalResult -eq 0) {
        Write-ColorOutput "🎉 ¡Todos los tests pasaron exitosamente!" $Green
    } else {
        Write-ColorOutput "💥 Algunos tests fallaron. Revisa los logs arriba." $Red
    }
    
    exit $totalResult
}

# Ejecutar función principal
Main