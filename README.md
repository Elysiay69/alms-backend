# ALMS Backend

This is the backend service for the ALMS (Application Lifecycle Management System) project.

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alms-backend
```

2. Install dependencies:
```bash
npm install
# OR
yarn install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the required environment variables (see `.env.example` if available)

### Database Setup

For database setup and migration instructions, please refer to the [Database Setup Guide](DATABASE_SETUP.md).

### Running the Application

To run the application in development mode:

```bash
npm run dev
# OR
yarn dev
```

This will start the Serverless offline environment.

## Project Structure

- `prisma/`: Contains Prisma schema and migrations
- `src/`: Source code
  - `handlers/`: API route handlers
  - `middleware/`: Express middleware
  - `repositories/`: Database access layer
  - `services/`: Business logic
  - `utils/`: Utility functions

## Documentation

- [API Documentation](API_DOCUMENTATION.md)
- [API List](API_LIST.md)
- [Project Documentation](PROJECT_DOCUMENTATION.md)
- [Database Setup](DATABASE_SETUP.md)

## License

[ISC License](LICENSE)
