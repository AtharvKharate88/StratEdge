# Backend API - Cricket Prediction + Auth

A Node.js/Express backend providing:

- CSV-based cricket match stats & prediction API
- Prediction history stored in MongoDB
- Behavior tracking (clicks/time spent)
- AI explanation for predictions (Gemini)
- JWT-based authentication

## Features

- User signup with email validation
- User login with password verification
- JWT access and refresh token generation
- Refresh token management
- User logout
- CSV loader + team stats (win rate, avg runs, matches played)
- Match prediction endpoint
- Prediction history endpoint (by user)
- Behavior tracking endpoint
- Player battle insights endpoint
- Player impact rankings endpoint
- Venue insight endpoint
- AI explanation endpoint (Gemini 1.5 Flash)
- Global error handling
- Request validation with Zod
- Async error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn
- Gemini API key (for `/api/explain`)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

3. **Ensure MongoDB is connected** before running the server.
4. **Ensure CSV files exist** in `backend/data/`:
   - `matches.csv`
   - `deliveries.csv` (or `deliveries (2).csv` as fallback)
5. **Venue source (optional but recommended)**:
   - `data/venue.json` or `data/venue.js`
   - If present, this is used as the primary venue metadata source.

## Running the Server

Start the development server:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

All routes are prefixed with `/api`.

### Authentication Routes

#### 1. Signup
- **Endpoint:** `POST /api/signup`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "User created successfully"
  }
  ```
- **Error (409):** User already exists
- **Error (400):** Validation failed

#### 2. Login
- **Endpoint:** `POST /api/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200):**
  ```json
  {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "userId": "user_id"
  }
  ```
- **Error (401):** Invalid credentials

#### 3. Refresh Token
- **Endpoint:** `POST /api/refresh`
- **Request Body:**
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response:** New access and refresh tokens

#### 4. Logout
- **Endpoint:** `POST /api/logout`
- **Response (200):** Logout successful

### Prediction

#### Predict match
- **Endpoint:** `POST /api/predict`
- **Request Body (example):**
  ```json
  {
    "teamA": "India",
    "teamB": "Australia",
    "venue": "Wankhede Stadium",
    "batter": "Virat Kohli",
    "bowler": "Jasprit Bumrah"
  }
  ```
- **Response includes:** prediction probabilities, trust score, `topPlayers`, optional `playerBattle`, optional `venueInsight`

### History

#### Get prediction history
- **Endpoint:** `GET /api/history`
- **Notes:** Linked to `userId` (depends on your history route implementation/auth).

### Behavior

#### Track behavior
- **Endpoint:** `POST /api/behavior`
- **Request Body (example):**
  ```json
  { "predictionId": "objectId", "timeSpent": 25, "clicks": 7 }
  ```

### Player Insights

#### Player battle
- **Endpoint:** `GET /api/player-battle?batter=Virat%20Kohli&bowler=Jasprit%20Bumrah`

#### Player impact
- **Endpoint:** `GET /api/player-impact?top=10`

### Venue

#### Venue insight
- **Endpoint:** `GET /api/venue-insight?venue=Wankhede%20Stadium`

### AI Explanation

#### Explain prediction (Gemini)
- **Endpoint:** `POST /api/explain`
- **Request Body (example):**
  ```json
  {
    "teamA": "India",
    "teamB": "Australia",
    "probability": { "India": "60", "Australia": "40" },
    "trustScore": "70",
    "stats": {
      "India": { "winRate": 0.6, "avgRuns": 280 },
      "Australia": { "winRate": 0.5, "avgRuns": 260 }
    }
  }
  ```

## Project Structure

```
backend/
├── index.js                    # Entry point
├── package.json               # Dependencies
├── .env                        # Environment variables
├── config/
│   └── db.js                  # MongoDB connection
├── controller/
│   ├── auth.controller.js      # Authentication logic
│   ├── behaviorController.js   # Behavior tracking
│   ├── explanationController.js# AI explanation
│   ├── historyController.js    # Prediction history
│   ├── playerController.js     # Player battle insights
│   ├── playerImpactController.js # Player impact leaderboard
│   ├── predictionController.js # Match prediction
│   ├── playerRoutes.js         # Player routes
│   └── venueController.js      # Venue insights
├── middleware/
│   ├── asyncHandler.js        # Async error wrapper
│   ├── auth.js                # Authentication middleware
│   ├── error.middleware.js    # Global error handler
│   └── validate.middleware.js # Request validation
├── models/
│   └── User.js                # User schema
├── routes/
│   ├── auth.routes.js         # Auth routes
│   ├── predictionRoutes       # Prediction routes
│   ├── historyRoutes          # History routes
│   ├── behaviorRoutes.js      # Behavior routes
│   ├── explanationRoutes.js   # AI explanation routes
│   └── venueRoutes.js         # Venue routes
├── utils/
│   ├── AppError.js            # Custom error class
│   ├── aiClient.js            # Gemini client for explanations
│   ├── csvLoader.js           # CSV loader
│   ├── logger.js              # Logger utility
│   ├── playerBattle.js        # Batter vs bowler stats
│   ├── playerImpact.js        # Player impact scoring
│   ├── statsCalculator.js     # Team stats calculator
│   ├── venueAnalysis.js       # Venue analysis/normalization
│   └── token.js               # JWT token generation
├── data/
│   ├── matches.csv
│   ├── deliveries.csv (or deliveries (2).csv)
│   └── venue.json / venue.js
└── validation/
    └── auth.schema.js         # Zod validation schemas
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=dbname` |
| `JWT_SECRET` | Secret key for access tokens | `your_secret_key_min_32_chars` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `your_refresh_secret_min_32_chars` |
| `GEMINI_API_KEY` | Gemini API key for `/api/explain` | `AIza...` |
| `NODE_ENV` | Environment | `development` or `production` |

## Token Expiration

- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `409` - Conflict (User exists)
- `500` - Server Error

## Calculation Formulas (PPT Ready)

### 1) Team Stats (CSV Prediction Engine)

- **Matches Played (team):**  
  `matchesPlayed = total matches where team appeared`

- **Win Rate (team):**  
  `winRate = wins / matchesPlayed`

- **Average Runs (team):**  
  `avgRuns = totalRunsScored / matchesPlayed`

### 2) Match Prediction

- Prediction compares both teams using calculated team stats (win rate + average runs).
- Output is normalized into:
  - `probability[teamA]`
  - `probability[teamB]`
- **Trust score** is derived from how strongly team stats separate the two teams (larger separation => higher trust).

### 3) Behavior Tracking

Current classification logic:

- **Confused:** `timeSpent >= 20 && clicks >= 5`
- **Confident:** `timeSpent > 60 && clicks < 5`
- **Neutral:** otherwise

### 4) Player Battle (`/api/player-battle`)

For selected `batter` vs `bowler`:

- **Runs:**  
  `runs = sum(batsman_runs for all matching deliveries)`

- **Balls:**  
  `balls = count(matching deliveries)`

- **Dismissals:**  
  `dismissals = count(deliveries where player_dismissed == batter and is_wicket == 1)`

- **Strike Rate:**  
  `strikeRate = (runs / balls) * 100`

- **Data Quality Tag:**  
  `if balls < 10 -> "Not enough data"` else `"Sufficient data"`

- **Dominance Tag:**  
  - `if strikeRate > 140 -> "Batter Dominates"`
  - `if dismissals > 2 -> "Bowler Dominates"`
  - else `"Balanced"`

### 5) Player Impact (`/api/player-impact`)

Per player:

- `avgRuns = totalRuns / matches`
- `strikeRate = (totalRuns / totalBalls) * 100`
- `consistency = matches`

Recent form (recency proxy):

- Dataset has no explicit year/date field, so match recency is approximated using sorted `match_id`.
- Latest bucket of matches -> **thisYearForm**
- Previous bucket -> **lastYearForm**

Form calculations:

- `thisYearForm = (thisYearRuns / thisYearBalls) * 100`
- `lastYearForm = (lastYearRuns / lastYearBalls) * 100`
- `formFactor = thisYearForm * 0.6 + lastYearForm * 0.4`

Final impact score:

- `impactScore = avgRuns * 0.4 + strikeRate * 0.25 + consistency * 0.15 + formFactor * 0.2`

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

## Development Notes

- All errors are caught and passed to the global error handler
- Validation happens at the route middleware level
- Passwords are hashed with bcrypt before storage
- Refresh tokens are stored in the database for token management
- Access tokens contain userId payload
- Venue metadata can come from `data/venue.json` or `data/venue.js`

## Future Enhancements

- Email verification
- Password reset functionality
- Rate limiting
- Two-factor authentication
- Role-based access control
