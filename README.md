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

est-ce qu'entre le controller et le service je dois toujours utiliser un dto ?
export const findMeHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const { userId } = UserIdSchema.parse(request.body);
    //const userId = request.user?.id;

    if (!userId) {
      throw new UserNotFoundError();
    }

    const user = await userService.findByIdToPublic(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

Est-ce qu'un service doit retourner la partie privée d'un entité ou retourner la partie public ?
Par exemple avoir toujours une methode toPublic ?

Je dois passer un model à un service qui prend un password en clair mais le model contient seulement le password crypté comment organiser les models et les service/controller/repository? 
Par exemple j'ai le model suivant qui represente ma table en base de donnée et celle que j'ai besoin pour travailler
export type User = {
  name: string;
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

Les utilisateurs de l'application ne vont jamais me passer cette structure mais seulement que certains champs ou des autres qui n'existent pas:

Par exemple pour la creation:
export type User = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

Pour l'update:
export type User = {
  name: string;
  email?: string;
  password?: string;
  role: UserRole;
}

J'ai une interface de base pour les repository
export interface IBaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  OrderByInput,
  FilterOptions extends BaseFilterOptions,
> {
  findAll(
    paginationOptions?: Partial<PaginationOptions>,
    filterOptions?: FilterOptions,
    select?: any,
  ): Promise<PaginatedResult<T>>;
  findById(id: string, select?: any): Promise<T | null>;
  findByEmail(id: string, select?: any): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: WhereInput): Promise<number>;
}
