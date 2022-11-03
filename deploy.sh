PUBLIC_URL="/app"
npm run build
cp -r website/build deploy
cp -r app/build deploy/app
