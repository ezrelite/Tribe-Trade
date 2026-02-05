@echo off
SETLOCAL
echo ==========================================
echo    TRIBE TRADE - THE MARKETPLACE (FRONTEND)
echo ==========================================
echo.
echo [Marketplace] Entering the field...
cd frontend

echo [Marketplace] Opening The Drop (npm run dev --host)...
call npm.cmd run dev -- --host

echo.
echo ==========================================
echo    MARKETPLACE CLOSED
echo ==========================================
pause
