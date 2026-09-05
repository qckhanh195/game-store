## 🛠️ Technologies Used

### Frontend:
* **React** (Version 19)
* **Vite** (Super-fast build tool)
* **Tailwind CSS** (Convenient CSS Framework)
* **Axios** (Library for sending HTTP Requests & managing Interceptors to automatically attach tokens)
* **Lucide React** (Modern icon set)
* **React Router DOM** (Routing and navigation management)
* **Context API** (Global state management for Login and Cart)

### Backend:
* **Node.js** & **Express**
* **MongoDB** & **Mongoose** (ODM to connect to MongoDB)
* **BcryptJS** (One-way hashing for user passwords)
* **JsonWebToken** (Authentication & authorization security)
* **Cors** (Security configuration for Cross-Origin Resource Sharing)
* **Dotenv** (Environment variables management)

---

## 🚀 Installation & Setup

### Step 1: Clone the repository
Open your Terminal and run the following command:
```bash
git clone https://github.com/qckhanh195/game-store.git
cd GamesStore
```

---

### Step 2: Install and configure Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment configuration file `.env` from the `.env.example` file:
   * Create a new file named `.env` directly in the `backend` folder.
   * Copy all content from the `.env.example` file to the newly created `.env` file.
   * Make sure to configure the correct MongoDB connection string `MONGO_URI` and secret key `JWT_SECRET` in the `.env` file:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_uri
     JWT_SECRET=your_secret_key_here
     JWT_EXPIRES_IN=7d
     ```
4. Start the Backend Server:
   ```bash
   npm run dev
   # Or run: npm start
   ```
   * *By default, the Backend will run at:* `http://localhost:5000`

---

### Step 3: Install and configure Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Frontend:
   ```bash
   npm run dev
   ```
   * *By default, the Frontend runs at:* `http://localhost:5173` (or the port shown in the terminal). You can open your browser and navigate to this address to use the application.