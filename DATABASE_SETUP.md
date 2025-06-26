# Database Setup and Migration Guide

This guide explains how to set up the database and run migrations after cloning the repository.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Step 1: Install Dependencies

First, install all required dependencies:

```bash
npm install
# OR
yarn install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/alms_db?schema=public"
```

Replace `username`, `password`, and `alms_db` with your PostgreSQL credentials and database name.

## Step 3: Run Migrations

Execute the following command to apply all migrations to your database:

```bash
npx prisma migrate deploy
```

This command will apply all the migrations in the `prisma/migrations` directory to your database.

## Step 4: Generate Prisma Client

After running migrations, generate the Prisma client:

```bash
npx prisma generate
```

## Step 5: Seed the Database (Optional)

To populate your database with initial data:

```bash
npm run prisma:seed
# OR
yarn prisma:seed
```

## Additional Prisma Commands

- **Check database status**: `npx prisma db pull`
- **Create a new migration**: `npx prisma migrate dev --name migration_name`
- **Reset the database**: `npx prisma migrate reset` (⚠️ This will delete all data)
- **View database in Prisma Studio**: `npx prisma studio`

## Troubleshooting

- If you encounter issues with PostgreSQL connection, verify your DATABASE_URL and ensure PostgreSQL is running.
- For migration conflicts, you may need to reset the database using `npx prisma migrate reset`.
- For permissions issues, ensure your PostgreSQL user has the necessary privileges.

## Schema Changes

If you need to make changes to the database schema:

1. Edit the `prisma/schema.prisma` file
2. Run `npx prisma migrate dev --name descriptive_name` to create a new migration
3. Commit the new migration files to version control
