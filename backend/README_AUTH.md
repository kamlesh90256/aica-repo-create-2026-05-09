Authentication

Backend provides JWT-based auth routes:

- `POST /api/auth/register` — body: `{ name?, email, password }` — creates user
- `POST /api/auth/login` — body: `{ email, password }` — returns `{ token, user }`

Use the returned `token` as `Authorization: Bearer <token>` when calling protected endpoints such as `/api/history`.

Notes:
- Passwords are hashed using `bcryptjs`.
- For production, use secure JWT secret, HTTPS, and stronger session handling.
