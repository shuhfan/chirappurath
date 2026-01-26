# Deploy edited files to VPS via SCP
# Server: 173.249.60.154 | User: root | Port: 22
# Target: /home/chirappurathfamily.org/public_html

$SERVER = "173.249.60.154"
$USER = "root"
$PORT = "22"
$REMOTE_PATH = "/home/chirappurathfamily.org/public_html"

Write-Host "Deploying files to $SERVER..." -ForegroundColor Cyan

# Upload edited files
scp -P $PORT "views\layouts\main.ejs" "${USER}@${SERVER}:${REMOTE_PATH}/views/layouts/main.ejs"
scp -P $PORT "routes\public.js" "${USER}@${SERVER}:${REMOTE_PATH}/routes/public.js"
scp -P $PORT "public\css\style.css" "${USER}@${SERVER}:${REMOTE_PATH}/public/css/style.css"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Restarting Node.js app on server..." -ForegroundColor Cyan

# Restart the app (adjust command based on your setup - PM2, systemctl, etc.)
ssh -p $PORT "${USER}@${SERVER}" "cd ${REMOTE_PATH} && pm2 restart all"

Write-Host "Done!" -ForegroundColor Green
