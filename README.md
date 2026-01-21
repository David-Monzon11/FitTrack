# VitalTrack - Complete Health & Fitness Platform

A modern, comprehensive health and fitness tracking web application built with React.js and Tailwind CSS. VitalTrack helps you monitor your health metrics, set goals, track progress, and gain valuable insights into your wellness journey.

## ✨ Features

### 🔐 Authentication & Security
- Secure login and registration with Firebase Authentication
- Email/Password and Google Sign-In support
- Protected routes and session management

### 📊 Comprehensive Health Tracking
- **Weight tracking** with daily comparisons and trends
- **Sleep duration** monitoring and analysis
- **Water intake** logging and reminders
- **Calorie intake** and burned calories tracking
- **Height tracking** with automatic BMI calculation
- **Exercise scheduling** and completion tracking
- **Step counting** with GPS-based tracking and map visualization

### 📈 Advanced Analytics & Insights
- **Visual Progress Charts**: Interactive line and bar charts showing trends over time
- **Weekly Insights Dashboard**: Track averages and changes across all metrics
- **Health Trends**: See your progress with week-over-week comparisons
- **Data Visualization**: Beautiful charts powered by Recharts

### 🎯 Goal Setting & Tracking
- **Personalized Goals**: Set custom goals for weight, calories, steps, water, sleep, and exercise
- **Progress Tracking**: Real-time progress bars and percentage completion
- **Goal Management**: Create, edit, and delete goals with ease
- **Achievement System**: Celebrate milestones and accomplishments

### 📱 User Experience
- **Fully Responsive**: Mobile-first design optimized for all devices
- **Modern UI/UX**: Clean, accessible interface with Tailwind CSS
- **Dark Mode Ready**: Prepared for future dark mode implementation
- **Intuitive Navigation**: Easy-to-use sidebar (desktop) and bottom nav (mobile)

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication and Realtime Database
- **Vite** - Fast build tool and development server
- **Recharts** - Beautiful, responsive charts and data visualization
- **Leaflet** - Interactive maps for step tracking
- **Font Awesome** - Comprehensive icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VitalTrack
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - The Firebase configuration is already set up in `src/config/firebase.js`
   - Make sure your Firebase project has Authentication and Realtime Database enabled

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BottomNav.jsx   # Mobile bottom navigation
│   ├── HealthCard.jsx  # Health metric card component
│   ├── InputModal.jsx  # Modal for data input
│   ├── Modal.jsx       # Base modal component
│   ├── ProtectedRoute.jsx  # Route protection component
│   ├── Sidebar.jsx     # Desktop sidebar navigation
│   └── StepTracker.jsx # GPS-based step tracking
├── config/
│   └── firebase.js     # Firebase configuration
├── context/
│   └── AuthContext.jsx # Authentication context provider
├── pages/              # Page components
│   ├── HealthDataInput.jsx  # Health data input page
│   ├── History.jsx     # History log page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   └── Today.jsx       # Main dashboard
├── App.jsx             # Main app component with routing
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

## Features in Detail

### Authentication
- Email/password authentication
- Google Sign-In integration
- Protected routes for authenticated users
- Session management

### Health Tracking
- Real-time data synchronization with Firebase
- Daily comparisons (today vs yesterday)
- Data validation and error handling
- Intuitive modal-based input forms

### Step Tracker
- GPS-based location tracking
- Real-time step counting
- Distance calculation
- Interactive map visualization
- Movement filtering to prevent false step counts

### Goal Management
- Set personalized goals for any health metric
- Track progress with visual progress bars
- Get notifications when goals are achieved
- Flexible goal types and units

### Insights & Analytics
- Weekly and monthly trend analysis
- Average calculations across all metrics
- Percentage change indicators
- Interactive charts for better understanding

### Responsive Design
- Mobile-first approach
- Tablet-optimized layouts
- Desktop sidebar navigation
- Mobile bottom navigation bar
- Adaptive card grids

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
