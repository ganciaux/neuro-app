# Création du projet
mkdir neuro-app && cd neuro-app

# Initialisation du backend
mkdir backend && cd backend
npm init -y
npm install typescript ts-node @types/node --save-dev
tsc --init
cd ..

# Initialisation du frontend
ng new frontend --directory frontend --style=scss --routing=true

# Création des dossiers supplémentaires
mkdir -p backend/src/{controllers,services,models,middlewares,utils,config,tests}
mkdir -p frontend/src/app/{components,services,models,utils}
mkdir -p frontend/src/assets frontend/src/environments docker/{backend,frontend}

# Fichiers Backend
touch backend/.env.example

# Fichiers Docker et config
touch docker-compose.yml
touch backend/Dockerfile frontend/Dockerfile

# Autres fichiers
touch README.md .gitignore

docker-compose up --build

npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
npx prisma migrate dev --name init
npx prisma generate

npm run test:setup
npm run test

npx kill-port 3000

psql -U neuro -d neuro_db
psql -U neuro -d neuro_db_test