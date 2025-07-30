# Yoti KYC Web App

A modern, full-stack React application for KYC (Know Your Customer) verification using [Yoti](https://www.yoti.com/) Age Estimation Verify services.  
This project features a React 18 frontend styled with Material-UI and a Node.js/Express backend with SQLite for user management and Yoti API integration.

---

## Features

- **User Registration**: Secure sign-up with hashed passwords.
- **Face Capture**: Integrated with Yoti's Face Capture Module (FCM).
- **KYC Verification**: Automated age and identity verification via Yoti.
- **Material-UI Design**: Clean, modern UI inspired by Yoti's branding.
- **SQLite Database**: Lightweight, file-based storage for user data.
- **API Routes**: Modular Express routes for user registration, verification flow, and session management.
- **HTTPS by Default**: Uses self-signed certificates for local development.

---

## Prerequisites

- **Node.js** v20 or higher
- **npm** (comes with Node.js)
- **Yarn** (optional)
- **Yoti API credentials** (SDK ID, API Key, PEM file)

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/excelsiorNT/yoti-kyc-webapp.git
cd yoti-kyc-webapp
```

### 2. Install Dependencies

Install both frontend and backend dependencies:

```sh
yarn
cd server
yarn
cd ..
```

### 3. Environment Variables

Create a `.env` file in the project root (see `.env` example below):

```env
HTTPS=true
PEM_FILE_PATH=<PATH_TO_YOUR_PEM_FILE>
VITE_SDK_ID=<Age_Estimation_SDK_ID>
VITE_WEB_SDK_ID=<AVS_SDK_ID>
ENDPOINT=https://api.yoti.com/ai/v1
API_ENDPOINT=https://age.yoti.com
PORT=3000
YOTI_API_KEY=your-yoti-api-key
```


### 4. Generate Self-Signed Certificates (for HTTPS)

If you don't have SSL certificates, generate them:

```sh
mkdir -p server/credentials
openssl req -nodes -new -x509 -keyout server/credentials/selfsigned.key -out server/credentials/selfsigned.crt -days 365
```

### 5. Build the Frontend (Optional)

```sh
yarn build
```

This will output the static frontend to `build/client` .

### 6. Build the Frontend and Start the Server

```sh
yarn serve
```

The app will be available at [https://localhost:3000](https://localhost:3000).

---

## Project Structure

```
yoti-kyc-webapp/
├── app/                # React frontend source code
│   └── users/          # Registration, Face Capture, Verificaation Result pages
├── build/              # Production build output
│   ├── client/         # Static frontend assets
├── server/             # Express backend
│   ├── routes/         # Modular API routes (users, verification, session management)
│   ├── credentials/    # SSL certificates
│   └── index.js        # Main server entry
├── .env                # Environment variables
├── package.json        # Project config (frontend)
├── server/package.json # Project config (backend)
└── README.md           # This file
```

---

## Useful Scripts

- `yarn dev` — Start the frontend in development mode (hot reload)
- `yarn build` — Build the frontend for production
- `yarn serve` - Build the frontend for production and start the backend server
- `yarn start` (in `/server`) — Start the backend server

---

## Notes

- **Database**: SQLite database file is created as `server/db.sqlite`.
- **HTTPS**: The server runs with HTTPS using self-signed certificates for local development.
- **API Endpoints**: All backend API endpoints are prefixed with `/api/`.
- **Static Files**: The frontend is served from `build/client`.

---

## Troubleshooting

- If you see SSL errors, ensure your browser trusts the self-signed certificate or use HTTP for local testing.
- If you change `.env` or certificates, restart the server.
- For Yoti API errors, double-check your credentials and PEM file.

---

## License

MIT

---

## Credits

- [Yoti](https://www.yoti.com/)
- [React](https://react.dev/)