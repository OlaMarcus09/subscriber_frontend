import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create the user account
      await axios.post(`${API_URL}/api/users/register/`, {
        email,
        username,
        password,
        password2: password,
      });

      // Step 2: Automatically log the user in
      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Step 3: Send to the "Select Plan" page
      Router.push('/plans'); // We will build this next

    } catch (err) {
      if (err.response?.data?.email) {
        setError('This email is already taken.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
      <Head>
        <title>Sign Up | Workspace Africa</title>
      </Head>
      <div className="w-full max-w-sm p-8">
        <h1 className="text-3xl font-bold text-center text-white">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-center text-neutral-400">
          Welcome to Workspace Africa
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-neutral-300">
              Your Name
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-neutral-800 border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-neutral-800 border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-neutral-800 border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && (
            <p className="text-xs text-center text-red-500">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-bold text-white transition-all bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-center text-neutral-400">
          Already have an account?{' '}
          <Link href="/login" legacyBehavior>
            <a className="font-medium text-teal-500 hover:text-teal-400">
              Log In
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
}
