# Local Development Setup Guide

## Prerequisites
- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- VS Code
- Git

## Database Migration from MySQL
1. Export your MySQL data:
   ```bash
   mysqldump -u [username] -p [old_database_name] > storage_manager_dump.sql
   ```

2. Convert MySQL dump to PostgreSQL format using pgloader:
   ```bash
   pgloader mysql://user:pass@localhost/mysql_db postgresql://user:pass@localhost/postgres_db
   ```

## Setting Up the Project Locally

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd storage-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables Setup:
   Create a `.env` file in the root directory with these variables:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
   PGUSER=[your-pg-user]
   PGHOST=[your-pg-host]
   PGPASSWORD=[your-pg-password]
   PGPORT=[your-pg-port]
   PGDATABASE=[your-pg-database]
   ```

4. VS Code Configuration:
   Add these recommended extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   
   Create `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "typescript.tsdk": "node_modules/typescript/lib"
   }
   ```

5. Database Setup:
   ```bash
   npm run db:push
   ```

6. Start the Development Server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Common Issues and Solutions

1. Database Connection Issues:
   - Verify PostgreSQL is running
   - Check connection credentials in `.env`
   - Ensure database exists and user has proper permissions

2. TypeScript Errors:
   - Run `npm install` to ensure all type definitions are installed
   - Check `tsconfig.json` paths match your project structure

3. Port Conflicts:
   - If port 5000 is in use, modify the port in `server/index.ts`

## VS Code Debugging

1. Add this to `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Debug Server",
         "skipFiles": ["<node_internals>/**"],
         "program": "${workspaceFolder}/server/index.ts",
         "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/tsx",
         "outFiles": ["${workspaceFolder}/**/*.js"]
       }
     ]
   }
   ```

2. Start debugging:
   - Set breakpoints in your code
   - Press F5 or use the Run and Debug sidebar

## Project Structure
See `FILE_STRUCTURE.md` for detailed project organization.
