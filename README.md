# Live Bidding App

A real-time bidding platform designed to handle 300+ concurrent users with live bid updates, user authentication, and comprehensive bid management.

## Features

- **Real-time Bidding**: WebSocket-based live bid updates
- **User Authentication**: JWT-based auth with role-based access control
- **Auction Management**: Create, view, and manage auctions
- **Bid History**: Complete audit trail of all bids
- **Admin Dashboard**: Monitor active auctions and users
- **Responsive Design**: Works on desktop and mobile
- **Scalable Architecture**: Load-balanced backend with database connection pooling

## Tech Stack

**Backend:**
- Node.js 18+
- Express.js
- Socket.io (WebSockets)
- PostgreSQL
- Redis (for caching and session management)

**Frontend:**
- React 18+
- TypeScript
- Socket.io-client
- Tailwind CSS
- Redux Toolkit

**DevOps:**
- Docker & Docker Compose
- PostgreSQL
- Redis

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Hero3104/live-bidding-app.git
cd live-bidding-app
```

2. Start services with Docker Compose:
```bash
docker-compose up
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 5000
- Frontend on port 3000

3. Access the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
live-bidding-app/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── sockets/       # WebSocket handlers
│   │   ├── utils/         # Utility functions
│   │   └── app.ts         # Express app
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.js
├── database/               # Database scripts
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── docker-compose.yml     # Docker Compose config
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Auctions
- `GET /api/auctions` - List all auctions
- `GET /api/auctions/:id` - Get auction details
- `POST /api/auctions` - Create new auction (admin only)

### Bids
- `GET /api/bids/:auctionId` - Get bids for auction
- `POST /api/bids` - Place a bid (via WebSocket)

## WebSocket Events

### Client -> Server
- `join-auction` - Join an auction room
- `place-bid` - Place a new bid
- `leave-auction` - Leave an auction room

### Server -> Client
- `bid-placed` - New bid received
- `auction-updated` - Auction status changed
- `user-joined` - New user joined auction
- `bid-error` - Bid validation error

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guidelines.

## License

MIT
