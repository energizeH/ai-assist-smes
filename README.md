# AI-Assist for SMEs

> Production-ready SaaS platform for AI automation consultancy services targeting small and medium-sized businesses.

## Overview

AI-Assist for SMEs is a comprehensive AI automation consultancy platform designed to help small and medium-sized businesses save time, reduce administrative workload, and increase efficiency through intelligent automation solutions.

## Features

### Core Services
- **AI Receptionist System** - Automated phone answering with appointment booking
- **WhatsApp Automation** - Automated customer communications and responses
- **Lead Management** - Intelligent lead capture and qualification
- **Email Automation** - Automated follow-ups and nurture sequences
- **Appointment Scheduling** - Smart calendar management and reminders
- **Custom Integrations** - Connect with existing business tools

### Platform Features
- **User Authentication** - Secure login and registration system
- **Admin Dashboard** - Comprehensive business management interface
- **Client Management** - Track and manage all your clients
- **Analytics & Reporting** - Real-time business insights
- **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/energizeH/ai-assist-smes.git
cd ai-assist-smes
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-assist-smes/
├── app/
│   ├── api/           # API routes
│   │   └── auth/      # Authentication endpoints
│   ├── dashboard/     # Dashboard pages
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── public/            # Static assets
└── package.json       # Dependencies
```

## Key Pages

- `/` - Landing page with service overview
- `/login` - User authentication
- `/register` - New user registration
- `/dashboard` - Main admin interface

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Deployment

The application is optimized for deployment on Vercel:

```bash
vercel --prod
```

## Development Roadmap

- [ ] Database integration (PostgreSQL/Supabase)
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Payment integration (Stripe)
- [ ] Advanced analytics dashboard
- [ ] API integrations (Twilio, WhatsApp Business API)
- [ ] Multi-language support

## License

MIT License - see LICENSE file for details

## Contact

For inquiries about AI automation services for your business, visit our website or contact us directly.

---

Built with ❤️ for small and medium-sized businesses
