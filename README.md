# Movie Review Platform (NestJS + Next.js)

A full-stack movie review platform built with NestJS, Next.js, and Prisma, featuring authentication, real-time notifications, and a rich user experience.

## 🎯 Features

### Authentication & Users

- Google OAuth integration
- JWT-based authentication
- User profiles and preferences
- Role-based access control

### Core Functionality

- Movie/TV Show cataloging
- Detailed Movie/Title information
- Cast and crew details
- User reviews and ratings
- Personalized watchlists
- Custom user lists
- Production company tracking
- Awards and certifications
- Genre categorization

### Advanced Features

- Real-time notifications
- Recommendation engine
- Caching system
- Email notifications (via Nodemailer)
- File uploads (via Cloudinary)
- Swagger API documentation

## 🛠 Tech Stack

### Backend (NestJS)

- **@nestjs/common**: Core NestJS functionalities
- **@nestjs/core**: NestJS core module
- **@nestjs/jwt**: JWT authentication support
- **@nestjs/passport**: Passport.js integration for authentication
- **@nestjs/config**: Configuration management
- **@nestjs-modules/mailer**: Email sending capabilities
- **@nestjs/graphql**: GraphQL support
- **@prisma/client**: Database ORM
- **jose**: JWT creation and verification
- **passport-google-oauth20**: Google OAuth strategy for Passport.js
- **passport-jwt**: JWT strategy for Passport.js
- **zod**: Schema validation
- **@nestjs/mapped-types**: Utility for creating mapped types
- **@nestjs/testing**: Testing utilities for NestJS

### Frontend (Next.js)

- **Next.js 14**: A React framework for building server-rendered applications with features like static site generation and API routes.
- **React**: A JavaScript library for building user interfaces.
- **React Query**: A data-fetching library for managing server state in React applications.
- **ShadCN**: A component library for building accessible and customizable UI components.
- **Radix UI**: A set of unstyled, accessible components for building high-quality design systems and web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Framer Motion**: A library for creating animations and transitions in React applications.
- **Zustand**: A small, fast state management solution for React applications.
- **@tanstack/react-query-devtools**: DevTools for React Query to help visualize and debug queries.
- **@hookform/resolvers**: Resolver for integrating React Hook Form with validation libraries.
- **Axios**: A promise-based HTTP client for making requests to APIs.
- **date-fns**: A modern JavaScript date utility library for parsing, formatting, and manipulating dates.
- **clsx**: A utility for constructing className strings conditionally.
- **framer-motion**: A library for animations and transitions in React applications.

## 📦 Project Structure

```
movie-review-platform/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/             # Source code
│   │   ├── prisma/          # Database schema and migrations
│   │   └── test/            # Test cases
│   └── web/                 # Next.js frontend
│       ├── app/             # App router pages
│       ├── components/      # React components
│       └── providers/       # Context providers
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── eslint-config/       # ESLint configuration
│   └── typescript-config/   # TypeScript configuration

```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 10.8.1
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd movie-review-platform
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# apps/api/.env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
JWT_SECRET="..."

# apps/web/.env
NEXT_PUBLIC_API_URL="http://localhost:8001"
```

4. Initialize the database:

```bash
cd apps/api
npm run db:migrate
npm run db:seed
```

### Development

Start the development servers:

```bash
# Root directory
npm run dev
```

- Backend: [http://localhost:8001](http://localhost:8001)
- Frontend: [http://localhost:3000](http://localhost:3000)
- API Documentation: [http://localhost:8001/api](http://localhost:8001/api)

## 🧪 Testing

```bash
# Backend tests
cd apps/api
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Coverage reports

# Frontend tests
cd apps/web
npm run test
```

## 📚 Documentation

- Backend API documentation is available at `/api` when running the development server
- Frontend component documentation (coming soon)

## 🔧 Scripts

### Backend

```typescript:apps/api/package.json
Adding soon!
```

### Frontend

```typescript:apps/web/package.json
Adding soon!
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- Md. Jidanul Hakim Jitu - Initial work

## 🙏 Acknowledgments

- NestJS team for the excellent backend framework
- Vercel team for Next.js and the deployment platform
