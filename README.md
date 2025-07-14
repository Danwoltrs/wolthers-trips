# Wolthers & Associates Travel Management System

A comprehensive travel itinerary management system built with modern web technologies.

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Multi-method)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **Email**: Hostinger SMTP
- **Hosting**: Hostinger (Frontend) + Supabase (Backend)

## Features

- Multi-method authentication (SSO, OTP, Trip codes)
- Real-time collaborative trip planning
- AI-powered trip summarization
- File management with CDN delivery
- Mobile-responsive design
- Multi-tenant architecture

## Development

This project is developed using Claude Code for AI-assisted development.

## Legacy System

The legacy/ folder contains the previous implementation for reference and feature comparison.

## Getting Started

`powershell
npm install
npm run dev
`

Visit http://localhost:3000 to view the application.

## Development Setup

1. Clone this repository
2. Install dependencies: 
pm install
3. Copy .env.example to .env.local and fill in your environment variables
4. Run development server: 
pm run dev

## Contributing

This project uses conventional commits. Please follow the format:
- eat: for new features
- ix: for bug fixes
- docs: for documentation
- style: for formatting
- efactor: for code refactoring
- 	est: for tests
- chore: for maintenance
