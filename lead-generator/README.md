# LeadLift - AI-Powered Lead Generation App

LeadLift is an AI-powered lead generation application that captures, qualifies, and stores leads automatically.

## Features

- Lead capture through form or API input
- AI-powered lead qualification using Google Gemini API
- Automatic storage of leads into CSV files
- Clean and customizable UI for easy branding

## Tech Stack

- **Frontend**: Angular with SCSS
- **Backend**: Node.js with Express
- **AI Engine**: Google Gemini API
- **Data Storage**: CSV
- **Deployment**: Localhost server

## Project Structure

```
lead-generator/
├── frontend/                 # Angular frontend application
│   ├── src/                  # Source files
│   │   ├── app/              # Angular components
│   │   ├── assets/           # Static assets
│   │   └── environments/     # Environment configurations
├── backend/                  # Node.js backend application
│   ├── src/                  # Source files
│   │   ├── controllers/      # API controllers
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utility functions
│   └── data/                 # CSV storage
└── README.md                 # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Angular CLI
- Google Gemini API Key

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory with your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
2. Start the frontend application:
   ```
   cd frontend
   ng serve
   ```
3. Access the application at `http://localhost:4200`

## License

MIT
