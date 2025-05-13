# TrackMasterPro

A production-ready task management application with a React frontend and FastAPI backend.

## Project Structure

- `/backend` - FastAPI backend
- `/webapp` - React frontend

## Production Deployment Guide

### Backend Deployment

1. Set up a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if not already done)
   - Update the values in `.env` for production:
     - Set a strong `JWT_SECRET_KEY`
     - Configure a production database URL
     - Set `ENVIRONMENT=production`
     - Add your production domain to `CORS_ORIGINS` in `app/config.py`

4. Initialize the database:
```bash
python init_db.py
```

5. Start the server:
```bash
python run.py
```

For production deployment, consider using:
- Gunicorn as a WSGI server
- Nginx as a reverse proxy
- Supervisor or systemd for process management

Example Gunicorn command:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Frontend Deployment

1. Install dependencies:
```bash
cd webapp
npm install
```

2. Build for production:
```bash
npm run build
```

3. Deploy the contents of the `build` directory to your web server

For production deployment, consider:
- Nginx or Apache for serving static files
- CDN for improved performance
- Environment-specific configuration

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Register: `POST /auth/register`
- Login: `POST /auth/login/json`

Default admin credentials:
- Email: admin@trackmaster.com
- Password: admin123

**Important:** Change the default admin password in production!

## WebSocket Support

Real-time updates are supported via WebSocket connections:

- WebSocket endpoint: `ws://your-domain/ws/{user_id}`
- Notifications are sent when tasks are created, updated, or deleted

## Production Checklist

Before deploying to production, ensure:

- [ ] Strong JWT secret key is set
- [ ] Production database is configured
- [ ] CORS is properly configured
- [ ] Default admin password is changed
- [ ] Debug mode is disabled
- [ ] Proper error handling is in place
- [ ] Logging is configured
- [ ] SSL/TLS is set up for secure connections
- [ ] Rate limiting is implemented
- [ ] Database backups are configured