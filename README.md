### Tickify

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

-   Create a PostgreSQL database
-   Run the migration:

```bash
psql -U your_username -d your_database -f migrations/001_init.sql
```

### 3. Configure Environment Variables

-   Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

-   Update `.env` with your actual values:
    -   `DATABASE_URL`: Your PostgreSQL connection string
    -   `JWT_SECRET`: A strong secret key for JWT signing
    -   `JWT_EXPIRES_IN`: Token expiration (default: 7d)
    -   `SALT_ROUNDS`: Bcrypt salt rounds (default: 10)
    -   `PORT`: Server port (default: 3000)

## Testing the Application

### Start the Server

```bash
npm run dev
```

The server should start on port 3000 (or your configured PORT).

### Test Endpoints

#### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "1234567890",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

**Expected Response:**

```json
{
	"user": {
		"id": "...",
		"full_name": "John Doe",
		"email": "john@example.com",
		"phone_number": "1234567890",
		"role": "user",
		"created_at": "..."
	},
	"token": "jwt_token_here"
}
```

#### 2. Login with Email

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

```json
{
	"user": {
		"id": "...",
		"full_name": "John Doe",
		"email": "john@example.com",
		"phone_number": "1234567890",
		"role": "user"
	},
	"token": "jwt_token_here"
}
```
### User Endpoints

#### 1. Get Current User Profile
Retrieves the profile of the currently logged-in user.

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2. Update Profile Picture
Uploads a new profile picture. Expects a file field named `file`.

```bash
curl -X PATCH http://localhost:3000/api/users/profile-picture \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/image.jpg"
```

#### 3. Remove Profile Picture
Deletes the current user's profile picture.

```bash
curl -X DELETE http://localhost:3000/api/users/profile-picture \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Update Profile Details
Updates user information like name or phone number.

```bash
curl -X PATCH http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "New Name",
    "phone_number": "0987654321"
  }'
```

#### 5. Change Password
Updates the user's password.

```bash
curl -X PATCH http://localhost:3000/api/users/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "oldPassword123",
    "new_password": "newPassword123",
    "confirm_new_password": "newPassword123"
  }'
```
