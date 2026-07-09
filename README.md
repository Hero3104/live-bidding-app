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

3. Backend setup:
```bash
cd server
npm install
npm run dev
```

4. Frontend setup (in another terminal):
```bash
cd client
npm install
npm start
```

5. Access the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

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

## Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://bidding_user:bidding_pass@postgres:5432/bidding_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Auctions
- `GET /api/auctions` - List all auctions
- `GET /api/auctions/:id` - Get auction details
- `POST /api/auctions` - Create new auction (admin only)
- `PUT /api/auctions/:id` - Update auction (admin only)
- `DELETE /api/auctions/:id` - Delete auction (admin only)

### Bids
- `GET /api/bids/:auctionId` - Get bids for auction
- `POST /api/bids` - Place a bid (via WebSocket in real-time)
- `GET /api/bids/history/:userId` - Get user's bid history

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user details

## WebSocket Events

### Client -> Server
- `join-auction` - Join an auction room
- `place-bid` - Place a new bid
- `leave-auction` - Leave an auction room

### Server -> Client
- `bid-placed` - New bid received
- `auction-updated` - Auction status changed
- `user-joined` - New user joined auction
- `user-left` - User left auction
- `bid-error` - Bid validation error

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Auctions Table
```sql
CREATE TABLE auctions (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  starting_price DECIMAL(10, 2) NOT NULL,
  current_highest_bid DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_by UUID REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bids Table
```sql
CREATE TABLE bids (
  id UUID PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id),
  user_id UUID REFERENCES users(id),
  bid_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

### Docker Deployment

1. Build images:
```bash
docker-compose build
```

2. Deploy to production:
```bash
docker-compose -f docker-compose.yml up -d
```

### AWS Deployment (Recommended for 300+ users)

1. Use ECS Fargate for backend containers
2. RDS for PostgreSQL with Multi-AZ
3. ElastiCache for Redis
4. Application Load Balancer with sticky sessions
5. CloudFront for static assets

## Load Testing

Test the app with 300+ concurrent connections:

```bash
# Using Artillery
npm install -g artillery
artillery run load-test.yml
```

## Monitoring & Logging

- Backend logs: `docker-compose logs server`
- Frontend console: Browser DevTools
- Database: `docker-compose logs postgres`
- Redis: `docker-compose logs redis`

## Performance Optimization

- Connection pooling with PgBouncer
- Redis caching for frequently accessed data
- WebSocket room broadcasting instead of individual messages
- Database query optimization with indexes
- CDN for static assets

## Security Considerations

- JWT tokens for stateless authentication
- HTTPS in production
- CORS configuration
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Rate limiting on API endpoints
- WebSocket authentication

## Contributing

Please follow the existing code style and create a new branch for each feature.

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
