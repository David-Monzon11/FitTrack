import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/firebase';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await set(ref(db, `UsersAuthList/${credentials.user.uid}`), {
        firstname: formData.firstname,
        lastname: formData.lastname,
      });

      sessionStorage.setItem(
        'user-info',
        JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
        })
      );
      sessionStorage.setItem('user-creds', JSON.stringify(credentials.user));

      navigate('/today');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
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
            <p className="text-gray-600">Create your account and start your complete health tracking journey today.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              to="/login"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex-1 btn-primary text-center py-2.5"
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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                required
                minLength={6}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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

export default Register;
