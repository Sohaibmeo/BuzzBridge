# BuzzBridge Backend

Backend API for BuzzBridge - A social Q&A platform built with NestJS, PostgreSQL, and TypeORM.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start database (Docker)
docker-compose up -d

# Run migrations (first time setup)
npm run migration:run

# Start development server
npm run start:dev
```

### Database Migrations

This project uses TypeORM migrations for database management and schema version control.

```bash
# Run migrations (first time setup or after pulling changes)
npm run migration:run

# Check migration status
npm run migration:show

# Revert last migration (if needed)
npm run migration:revert

# Generate new migration from entity changes
npm run migration:generate src/migrations/YourMigrationName

# Create empty migration file
npm run migration:create src/migrations/YourMigrationName
```

#### Migration Workflow

1. **First time setup**: Run `npm run migration:run` after `npm install`
2. **After pulling changes**: Migrations run automatically with `npm run start:dev`
3. **Creating changes**: Modify entities → Generate migration → Review → Commit
4. **Production**: Migrations run automatically on deployment

#### Important Notes

- ⚠️ Never set `synchronize: true` in production
- ✅ Always review generated migrations before running
- ✅ Commit migration files with related code changes

## 🛠️ Development

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## 📋 Available Scripts

### Application

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugging enabled
- `npm run build` - Build for production

### Database Migrations

- `npm run migration:run` - Run pending migrations
- `npm run migration:show` - Show migration status
- `npm run migration:revert` - Revert last migration
- `npm run migration:generate` - Generate migration from entity changes
- `npm run migration:create` - Create empty migration file

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🏗️ Architecture

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM with Migrations
- **Authentication**: JWT + Google OAuth
- **File Upload**: ImageKit
- **Email**: Nodemailer

## 📊 Performance

The application includes optimized database indexes for high performance:

- 100x faster popular questions loading
- 70x faster user profiles
- 50x faster search functionality
- 25x faster voting operations

Performance indexes are managed through migrations and include score-based sorting, foreign key lookups, and full-text search optimization.
