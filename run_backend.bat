@echo off
SETLOCAL
echo ==========================================
echo    TRIBE TRADE - HUSTLE HQ STARTUP
echo ==========================================
echo.
echo [TribeGuard] Activating Shields (Virtual Env)...
call venv\Scripts\activate.bat

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Shield activation failed! Is the venv directory missing?
    pause
    exit /b %ERRORLEVEL%
)

echo [Tribe Council] Broadcasting to Network...
:: The 0.0.0.0:8000 allows your phone to see the server
python manage.py runserver 0.0.0.0:8000

echo.
echo ==========================================
echo    HQ SESSION ENDED
echo ==========================================
pause