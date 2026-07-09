# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

All responses are JSON with the following structure:

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "details": {}
}
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "user"
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "user"
  }
}
```

#### Logout
```
POST /auth/logout
```
Required: Authentication

### Auctions

#### List Auctions
```
GET /auctions?status=active&limit=50&offset=0
```

**Query Parameters:**
- `status` (optional): pending, active, ended, cancelled
- `limit` (optional): Items per page (default: 50)
- `offset` (optional): Page offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Vintage Watch",
      "description": "...",
      "starting_price": 100.00,
      "current_highest_bid": 150.00,
      "status": "active",
      "total_bids": 5,
      "start_time": "2026-07-09T10:00:00Z",
      "end_time": "2026-07-10T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100
  }
}
```

#### Get Auction
```
GET /auctions/:id
```

#### Create Auction
```
POST /auctions
```
Required: Authentication (admin only)

**Request Body:**
```json
{
  "title": "Auction Title",
  "description": "Description...",
  "starting_price": 100.00,
  "start_time": "2026-07-09T10:00:00Z",
  "end_time": "2026-07-10T10:00:00Z",
  "category": "Electronics",
  "image_url": "https://..."
}
```

#### Get Auction Bids
```
GET /auctions/:id/bids
```

### Bids

#### Place Bid
```
POST /bids
```
Required: Authentication

**Request Body:**
```json
{
  "auction_id": "uuid",
  "bid_amount": 150.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "auction_id": "uuid",
    "user_id": "uuid",
    "bid_amount": 150.00,
    "created_at": "2026-07-09T10:30:00Z"
  }
}
```

#### Get User Bids
```
GET /bids/user/history?limit=50&offset=0
```
Required: Authentication

### Users

#### Get Profile
```
GET /users/profile
```
Required: Authentication

#### Update Profile
```
PUT /users/profile
```
Required: Authentication

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Get User
```
GET /users/:id
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Client Events

#### Join Auction
```javascript
socket.emit('join-auction', auctionId);
```

#### Place Bid
```javascript
socket.emit('place-bid', {
  auctionId: 'uuid',
  bidAmount: 150.00
});
```

#### Leave Auction
```javascript
socket.emit('leave-auction', auctionId);
```

### Server Events

#### Bid Placed
```javascript
socket.on('bid-placed', (data) => {
  console.log('New bid:', data.bidAmount);
});
```

#### User Joined
```javascript
socket.on('user-joined', (data) => {
  console.log('Active users:', data.activeUsers);
});
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

None implemented in v1.0. Add in production deployment.

## Pagination

List endpoints support pagination:
- `limit`: Items per page (max 100, default 50)
- `offset`: Number of items to skip (default 0)

## Filtering

Auctions can be filtered by status:
- `pending` - Not yet started
- `active` - Currently accepting bids
- `ended` - Bidding has ended
- `cancelled` - Auction cancelled

## Error Handling

All errors return appropriate HTTP status codes with error details:

```json
{
  "success": false,
  "message": "Invalid bid amount",
  "details": {
    "field": "bid_amount",
    "issue": "must be greater than current bid"
  }
}
```
