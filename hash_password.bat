@echo off
echo Outil de hashage des mots de passe
echo ==================================
echo.
if "%1"=="" (
    echo Usage: hash_password.bat <mot_de_passe>
    echo Exemple: hash_password.bat Admin123
    echo.
    pause
    exit /b 1
)

echo Hashage du mot de passe: %1
echo.

cd /d c:\PFA\backend
mvn exec:java -Dexec.mainClass="com.example.recruitment.util.PasswordUtil" -Dexec.args="%1" -q

echo.
echo Copiez le mot de passe hashe ci-dessus pour l'utiliser dans votre base de donnees.
echo.
pause