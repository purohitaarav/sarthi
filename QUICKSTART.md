# Sarthi - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd /Users/aaravpurohit/sarthi
npm run install-deps
```

This will install all dependencies for both backend and frontend.

### Step 2: Set Up Database
```bash
npm run setup-db
```

This creates the SQLite database with sample data.

### Step 3: Start Development
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) servers.

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
sarthi/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx    # Main layout with navigation
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Dashboard/home page
│   │   │   ├── Users.jsx     # User management
│   │   │   ├── Items.jsx     # Item management
│   │   │   └── About.jsx     # About page
│   │   ├── services/
│   │   │   └── api.js        # Axios API client
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   └── package.json
│
├── server/                    # Express Backend
│   ├── config/
│   │   └── database.js       # SQLite connection
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Item.js           # Item model
│   ├── routes/
│   │   ├── userRoutes.js     # User API endpoints
│   │   └── itemRoutes.js     # Item API endpoints
│   ├── scripts/
│   │   └── setupDatabase.js  # Database initialization
│   └── index.js              # Express server
│
├── .env.example              # Environment variables template
├── .gitignore
├── package.json              # Root package.json with scripts
└── README.md                 # Full documentation
```

## 🛠️ Available Scripts

- `npm run dev` - Run both frontend and backend in development mode
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run build` - Build frontend for production
- `npm start` - Run production server
- `npm run setup-db` - Initialize database

## 🔑 Key Features

✅ Full CRUD operations for Users and Items
✅ RESTful API with Express
✅ React with React Router
✅ Tailwind CSS for styling
✅ SQLite database
✅ Modern UI with Lucide icons
✅ Hot reload for development

## 📝 Next Steps

1. **Customize the UI**: Edit components in `client/src/`
2. **Add new routes**: Create new files in `server/routes/` and `client/src/pages/`
3. **Extend database**: Modify `server/scripts/setupDatabase.js`
4. **Add authentication**: JWT setup is already included

## 🐛 Troubleshooting

**Port already in use?**
- Change PORT in `.env` file (copy from `.env.example`)

**Database errors?**
- Run `npm run setup-db` again
- Delete `server/database/sarthi.db` and recreate

**Module not found?**
- Run `npm run install-deps` again

## 📚 Learn More

See `README.md` for detailed documentation including:
- API endpoints
- Database schema
- Deployment instructions
- Customization guide

---

**Happy coding! 🎉**
