# Live Bidding App - Full Stack Implementation

A production-ready real-time bidding platform built with modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Start with Docker

```bash
# Clone repository
git clone https://github.com/Hero3104/live-bidding-app.git
cd live-bidding-app

# Start all services
docker-compose up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432
- **Redis**: localhost:6379

### Local Development

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## 📁 Project Structure

```
live-bidding-app/
├── server/
│   ├── src/
│   │   ├── config/          # Database & Redis configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware (auth, errors)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic (Auth, Auction, Bid, User)
│   │   ├── sockets/          # WebSocket event handlers
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Helper functions (JWT, password, errors)
│   │   ├── app.ts            # Express app setup
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── client/
│   ├── src/
│   │   ├── components/       # React components (Header, Loading, etc.)
│   │   ├── pages/            # Page components (Home, Login, Auctions, etc.)
│   │   ├── services/         # API & Socket services
│   │   ├── store/            # Redux state management
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Main app component
│   │   ├── index.tsx         # React DOM render
│   │   └── index.css         # Tailwind CSS
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── database/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Sample data
├── docker-compose.yml
└── README.md
```

## 🏗️ Architecture

### Backend
- **Framework**: Express.js with TypeScript
- **Real-time**: Socket.io for WebSocket connections
- **Database**: PostgreSQL for data persistence
- **Cache**: Redis for session management and caching
- **Auth**: JWT tokens with bcrypt password hashing
- **Validation**: Express validator for input validation

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

## 🔐 Authentication

- User registration and login with email/password
- JWT-based authentication
- Role-based access control (user, admin, moderator)
- Secure password hashing with bcrypt
- Token stored in localStorage with auto-logout on 401

## 🎯 Core Features

### 1. Real-time Bidding
- Live bid updates via WebSocket
- Instant bid validation
- Current highest bidder tracking
- Real-time user count in auctions

### 2. Auction Management
- Create, view, and manage auctions
- Auction status tracking (pending, active, ended, cancelled)
- Auction filtering by status
- Pagination support

### 3. Bid History
- User bid history with timestamps
- Bid amount tracking
- Auction association
- Sorted by recency

### 4. User Management
- User profiles with customizable names
- User bid history
- Activity tracking

### 5. WebSocket Events

**Client → Server:**
- `join-auction` - Join auction room
- `place-bid` - Place a bid
- `leave-auction` - Leave auction room
- `watch-auction` - Watch auction
- `get-auction-update` - Get live auction data

**Server → Client:**
- `bid-placed` - New bid received
- `user-joined` - New user joined
- `user-left` - User left auction
- `auction-updated` - Auction status changed
- `bid-error` - Bid validation error
- `auction-update` - Live auction data

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Auctions
- `GET /api/auctions` - List all auctions (with filters)
- `GET /api/auctions/:id` - Get auction details
- `GET /api/auctions/:id/bids` - Get auction bids
- `GET /api/auctions/watched` - Get user's watched auctions
- `POST /api/auctions` - Create auction (admin only)
- `PUT /api/auctions/:id/status` - Update status (admin only)

### Bids
- `POST /api/bids` - Place a bid
- `GET /api/bids/user/history` - Get user's bid history

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user details

## 📊 Database Schema

### Users
- UUID primary key
- Email & username (unique)
- Password hash (bcrypt)
- Role-based access (user, admin, moderator)
- Profile information (first_name, last_name)
- Timestamps (created_at, updated_at, last_login)

### Auctions
- UUID primary key
- Title, description, category
- Starting price & current highest bid
- Status tracking (pending, active, ended, cancelled)
- Creator reference
- Time tracking (start_time, end_time)
- Bid count
- Image URL

### Bids
- UUID primary key
- Auction & user references
- Bid amount
- Timestamp
- Indexes for fast queries

### Additional Tables
- `auction_watchers` - Track watched auctions
- `activity_log` - Audit trail
- `notifications` - User notifications

## ⚡ Performance Optimizations

1. **Database**
   - Indexed queries on frequently accessed columns
   - Connection pooling (max 20 connections)
   - Optimized query patterns

2. **Caching**
   - Redis caching for auction data (5-minute TTL)
   - Session management via Redis

3. **WebSocket**
   - Room-based broadcasting
   - Automatic reconnection with backoff
   - Message buffering

4. **Frontend**
   - Code splitting with React Router
   - Redux state management
   - Memoization of expensive components

## 🔒 Security Features

1. **Authentication**
   - JWT tokens with configurable expiry
   - Bcrypt password hashing (10 salt rounds)
   - Secure token validation

2. **Authorization**
   - Role-based access control
   - Protected routes
   - Endpoint permission checks

3. **Data Protection**
   - CORS configuration
   - Helmet.js for security headers
   - Input validation & sanitization
   - Parameterized SQL queries

4. **WebSocket Security**
   - Token-based authentication
   - Connection validation
   - Automatic cleanup on disconnect

## 📈 Scalability

### Current Capacity
- **Concurrent Users**: 300+
- **WebSocket Connections**: Per-server scaling
- **Database**: Connection pooling (20 max)
- **Redis**: Session & cache storage

### Scaling Strategies

1. **Horizontal Scaling**
   - Load balancer (nginx/HAProxy)
   - Multiple backend instances
   - Redis cluster for session persistence

2. **Database Scaling**
   - Read replicas
   - Connection pooling with PgBouncer
   - Query optimization

3. **Cache Layer**
   - Redis cluster
   - Cache invalidation strategy
   - TTL management

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

### AWS Deployment
- ECS Fargate for containerized services
- RDS for PostgreSQL with Multi-AZ
- ElastiCache for Redis
- Application Load Balancer
- CloudFront for static assets
- CloudWatch for monitoring

### Environment Variables

**Backend (.env)**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secure-secret
JWT_EXPIRY=7d
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

**Frontend (.env)**
```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "details": { ... }
}
```

## 🧪 Testing

### Manual Testing
1. Register multiple user accounts
2. Create auctions as admin
3. Place bids in real-time
4. Monitor WebSocket events
5. Test authentication & authorization

### Load Testing
```bash
# Using Artillery
npm install -g artillery
artillery run load-test.yml
```

## 📚 Technology Stack

**Backend**
- Node.js 18+
- Express.js
- TypeScript
- Socket.io
- PostgreSQL
- Redis
- bcryptjs
- jsonwebtoken

**Frontend**
- React 18+
- TypeScript
- Redux Toolkit
- React Router v6
- Axios
- Socket.io-client
- Tailwind CSS
- React Icons

**DevOps**
- Docker
- Docker Compose
- PostgreSQL
- Redis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues, questions, or suggestions, please:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include error logs and steps to reproduce

## 🎉 Features Roadmap

- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Mobile app (React Native)
- [ ] Advanced search & filtering
- [ ] User ratings & reviews
- [ ] Multi-language support

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-09  
**Maintainer**: Hero3104
