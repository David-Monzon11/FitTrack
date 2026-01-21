import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { auth, db } from '../config/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const snapshot = await get(child(ref(db), `UsersAuthList/${credentials.user.uid}`));
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        sessionStorage.setItem(
          'user-info',
          JSON.stringify({
            firstname: userData.firstname,
            lastname: userData.lastname,
          })
        );
        sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));
        navigate('/today');
      } else {
        setError('User data not found. Please register again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      sessionStorage.setItem(
        'user-info',
        JSON.stringify({
          firstname: user.displayName || '',
          lastname: '',
        })
      );
      sessionStorage.setItem('user-creds', JSON.stringify(user));

      const userRef = ref(db, `UsersAuthList/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // User doesn't exist in database, create entry
        // This will be handled by the Register component or we can do it here
        await import('firebase/database').then(({ set }) => {
          set(userRef, {
            firstname: user.displayName || '',
            lastname: '',
          });
        });
      }

      navigate('/today');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-primary-400 to-primary-600 p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-large p-8 md:p-10 w-full">
          <div className="text-center mb-8">
            <img
              src="https://img.icons8.com/ios/100/heart-with-pulse.png"
              alt="FitTrack Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Vital<span className="text-primary-500">Track</span>
            </h1>
            <p className="text-gray-600">Welcome back! Sign in to continue your health journey.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              to="/login"
              className="flex-1 btn-primary text-center py-2.5"
            >
              Sign In
            </Link>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 border-2 border-red-500 text-gray-700 hover:bg-red-50 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <img
                src="https://img.icons8.com/color/24/google-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>
            <Link
              to="/register"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-center"
            >
              Sign Up
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Image Container */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/img1.webp"
            alt="Fitness Motivation"
            className="w-full max-w-lg rounded-2xl shadow-large"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x800?text=FitTrack';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
