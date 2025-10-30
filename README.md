 # Mini Project Manager

 This repository contains a full-stack mini project manager application.

 Backend: .NET 8, EF Core (SQLite), JWT auth
 Frontend: React + TypeScript (Vite), Axios, TailwindCSS

 Folders:
 - `backend/` - .NET Web API
 - `frontend/` - React + TypeScript app

 How to run (Windows / PowerShell)

 1) Backend

 Open PowerShell in `backend` and run:

 ```powershell
 cd backend
 dotnet restore
 dotnet run
 ```

 This will start the API. By default the app creates `app.db` using SQLite in the backend folder.

 2) Frontend

 Open PowerShell in `frontend` and run:

 ```powershell
 cd frontend
 npm install
 npm run dev
 ```

 The frontend dev server runs on http://localhost:5173 and is configured to call the API at http://localhost:5000 (see `src/services/api.ts`).

 Notes
 - Change `Jwt:Key` in `backend/appsettings.json` for production; prefer environment variables.
 - If ports differ, update `src/services/api.ts` and CORS policy in `backend/Program.cs`.
