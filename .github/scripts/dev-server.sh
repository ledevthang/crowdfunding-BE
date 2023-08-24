cd ~/crowdfunding-BE/
git checkout main
git pull
pnpm install
pnpm exec prisma generate
pnpm build
pm2 restart crowd-dev-api
