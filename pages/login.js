import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Get tokens
      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email,
        password,
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Step 2: Send them to the main app dashboard
      Router.push('/app'); // We'll create this page next

    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
      <Head>
        <title>Log In | Workspace Africa</title>
      </Head>
      <div className="w-full max-w-sm p-8">
        <h1 className="text-3xl font-bold text-center text-white">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-center text-neutral-400">
          Sign in to your Workspace Africa account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-white bg-neutral-800 border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {error && <p className="text-xs text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-bold text-white transition-all bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-center text-neutral-400">
          No account yet?{' '}
          <Link href="/signup" legacyBehavior>
            <a className="font-medium text-teal-500 hover:text-teal-400">
              Sign Up
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
}
