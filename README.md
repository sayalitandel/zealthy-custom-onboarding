# Zealthy — Custom Onboarding Flow

This small full-stack "Custom Onboarding Flow" app lets admins configure which onboarding components appear on Step 2 and Step 3 of a user sign-up wizard. Users submit email + password (Step 1) and then complete the configurable steps. A Data page lists collected users for review/testing.

## Demo

Frontend: https://zealthy-frontend-9alq.onrender.com

Backend health: https://zealthy-backend-bkn4.onrender.com/healthz

Admin section is intentionally unauthenticated for this exercise (as requested).

## Features

- **Three-step Onboarding Wizard:** Step 1 collects email + password, steps 2–3 are configurable. Includes progress indicator, Next/Back, and a final success state.

- **Admin Configuration (no auth for demo):** Choose which components (`aboutMe`, `address`, `birthdate`) appear on Page 2 or Page 3. Prevents empty pages and duplicates.

- **Resume Where You Left Off:** LocalStorage draft saving restores the user’s step and partial inputs when they return.

- **Live Data Table (no auth):** `/data` shows collected user records (with address) and updates as submissions are made.

## Technologies Used

- **Frontend**
    - React + Vite
    - Vanilla CSS (single App.css)
    - Render
- **Backend**
    - Node.js + Express
    - Sequelize ORM
    - PostgreSQL (e.g., Neon or Render Managed Postgres)
    - Render

## Project Structure
```bash
.
├── README.md
├── backend
│   ├── config
│   │   └── databaseConfig.js
│   ├── controllers
│   │   ├── dataController.js
│   │   └── flowController.js
│   ├── index.js
│   ├── middleware
│   │   └── authz.js
│   ├── models
│   │   ├── FlowConfig.js
│   │   ├── User.js
│   │   └── UserAddress.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── favicon.png
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── dataRoutes.js
│   │   ├── flowAdminRoutes.js
│   │   └── userFlowRoutes.js
│   └── utils
│       └── logUtil.js
├── frontend
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.png
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   └── utils
│   └── vite.config.js
├── render.yaml
└── structure.txt


16 directories, 31 files
Environment Variables

```

## Installation

### Backend Setup

1. Clone the repository and navigate to the backend directory:

   ```sh
   git clone https://github.com/sayalitandel/zealthy-custom-onboarding.git
   cd zealthy-custom-onboarding/backend
   ```
2. Install backend dependencies:

   ```sh
   npm install
   ```
3. Create backend/.env:

   ```sh
   POSTGRES_URL=<your_postgres_url>
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=<your_jwt_secret>
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:

   ```sh
   npm run dev
   ```
### Frontend Setup

1. Navigate to the frontend directory and install frontend dependencies:

   ```sh
   cd ../frontend
   npm install
   ```
2. Create frontend/.env:

   ```sh
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the frontend server:

   ```sh
   npm run dev
   ```
## Hosting & Deployment

This project is deployed on **Render** (frontend + backend) with a **Neon PostgreSQL** database.

## Routes

- **/ – Onboarding wizard**
- **/admin – Configure Page 2 & 3 components (no auth)**
- **/data – Collected users (no auth)**
-**Backend health: /healthz**

## API Endpoints

- `GET /` - health text (“Custom Onboarding API is alive”)
- `GET /healthz` - { ok: true } when DB is reachable
- `GET /api/flow-admin/config` - current component config
- `PUT /api/flow-admin/config` - update component config (page2/page3)
- `POST /api/user-flow/register` - create user { email, password }
- `PATCH /api/user-flow/:userId` - update onboarding fields (aboutMe, birthdate, address)
- `GET /api/data/users` - list users with joined address

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please reach out to [sayalisuniltandelk@gmail.com](mailto:sayalisuniltandelk@gmail.com).