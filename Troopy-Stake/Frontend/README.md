# Troopy Stack Frontend

Industry-cleaned React frontend for the Troopy Stack institute management project.

## What was cleaned

- Removed `node_modules` from the project zip.
- Removed unwanted `src/Component/Supper_admin.zip` file.
- Added central route constants in `src/constants/routes.js`.
- Added API endpoint constants in `src/config/api.js`.
- Added auth storage helpers in `src/utils/storage.js`.
- Moved API calls into service files under `src/services`.
- Kept the same UI and same working behavior.

## Run project

```bash
npm install
npm run dev
```

## Run JSON Server

```bash
npm run server
```

## Backend auth API expected

Login and registration use:

```txt
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/register
```

JSON Server data uses:

```txt
http://localhost:3000/institutes
http://localhost:3000/courses
http://localhost:3000/companies
```
