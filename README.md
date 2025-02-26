# Storytime - AI-Powered Story-to-Video Platform

Transform written stories into engaging video content using advanced AI technology. Storytime combines natural language processing with video generation to create a seamless storytelling experience.

## 🌟 Features

### Core Functionality
- **AI Story Processing**: Convert any text story into a visual narrative
- **Video Generation**
  - Multiple style options and themes
  - Custom background music selection
  - Professional voice-over options
  - Real-time progress tracking
  - AI automatic story generator

### User Systems
- **Authentication**
  - Email/Password with secure verification
  - Google Sign-in integration
  - Password reset functionality
- **User Dashboard**
  - Video history and management
  - Usage tracking and analytics
  - Subscription management

### Subscription Plans
- **Free Tier**: Basic features with 3 videos/month
- **Pro Plan**: Enhanced features with 45 videos/month
- **Elite Plan**: Unlimited access with premium features
- **Payment Integration**: Secure Paystack payment processing

### Technical Features
- Responsive design with dark/light mode
- Real-time video processing
- Email notifications
- Progressive Web App support

## 🛠️ Tech Stack

### Frontend
- Next.js 14 with App Router
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations

### Backend & Services
- Firebase Authentication
- Firestore Database
- Email service via SMTP
- Google Gemini API for AI
- Paystack payment processing

### Security
- Content Security Policy (CSP)
- Cross-Origin Resource Sharing (CORS)
- Email verification system
- Secure authentication flows

### This README provides:
1. Clear project overview and features
2. Detailed setup instructions
3. Comprehensive tech stack details
4. Security considerations
5. Deployment guide
6. Testing information
7. API documentation
8. Contribution guidelines
9. Support channels
10. Version history

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Firebase project
- Paystack account
- SMTP server access

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd storytime
```

2. Install dependencies:
```bash
 npm install 
 ```

3. Set up environment variables:

### Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

### Email Configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

### Payment Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=

### Application Configuration
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_GEMINI_API_KEY=

4. Run development server
```bash
npm run dev
```

### 📦 Project Structure

storytime/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   └── dashboard/     # User dashboard
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── sections/     # Page sections
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
├── public/           # Static assets
└── styles/          # Global styles

### 🔒 Security Features
Content Security Policy implementation
Cross-Origin Resource Sharing configuration
Email verification system
Rate limiting on API routes
Input sanitization
Secure authentication flows

### 🚀 Deployment

Build the application:
```bash
npm run build
```
Start production server:
```bash
npm start
```

🧪 Testing
Run the test suite:
```bash
npm test
```
Alternatively, use pnpm

### 📝 API Documentation

Story Processing
POST /api/story/process
GET /api/story/status/:id
GET /api/story/result/:id
User Management
POST /api/auth/register
POST /api/auth/verify
POST /api/auth/login
Subscription
POST /api/subscription/create
GET /api/subscription/status
POST /api/subscription/cancel

### 🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open a Pull Request

### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

### 🆘 Support
For support:

Email: support@ericfranzee.com
        ericfranzee@gmail.com

Create an issue in the repository
Documentation: docs.storytime.africa (coming soon)

### 🙏 Acknowledgments
- Next.js team for the amazing framework
- Firebase team for authentication and database
- Paystack team for payment processing
- All contributors and users of the platform
- Mostly importantly mistral AI, Gemini, and Claude
    - most of the code was written by AI 
        - Me Ericfranzee the prompt enginer "smiles"

### 🔄 Version History
1.0.0: Initial release
1.1.0: Added Google authentication
1.2.0: Implemented subscription system
1.3.0: Enhanced video processing
Built with ❤️ by the Storytime Team (Ericfranzee)

