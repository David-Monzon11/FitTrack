# FitTrack - Modern Fitness Tracking Application

A modern, responsive fitness tracking web application built with React.js and Tailwind CSS. Track your weight, sleep, water intake, calories, exercise, and more with an intuitive and beautiful user interface.

## Features

- 🔐 **User Authentication**: Secure login and registration with Firebase Authentication (Email/Password and Google Sign-In)
- 📊 **Health Metrics Tracking**: 
  - Weight tracking with daily comparisons
  - Sleep duration monitoring
  - Water intake logging
  - Calorie intake and burned calories
  - Height tracking
  - Exercise scheduling and completion
  - Automatic BMI calculation
- 📱 **Fully Responsive**: Mobile-first design that works beautifully on all devices
- 🗺️ **Step Tracker**: GPS-based step tracking with real-time map visualization
- 📈 **History Log**: View your complete health data history in an organized table
- 🎨 **Modern UI/UX**: Clean, accessible, and user-friendly interface with Tailwind CSS

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication and Realtime Database
- **Vite** - Fast build tool and development server
- **Leaflet** - Interactive maps for step tracking
- **Font Awesome** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FitTrack
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
