import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

// Import our new shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const validateForm = () => {
    // ... (rest of our validation logic is the same)
    setError('');
    if (/\s/.test(username)) {
      setError('Username cannot contain spaces. Please try again.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/users/register/`, {
        email, username, password, password2: password,
      });
      const response = await axios.post(`${API_URL}/api/auth/token/`, {
        email, password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      Router.push('/plans');
    } catch (err) {
      console.error(err);
      if (err.response) {
        const data = err.response.data;
        if (data.email) setError(`Email: ${data.email[0]}`);
        else if (data.username) setError(`Username: ${data.username[0]}`);
        else if (data.password) setError(`Password: ${data.password[0]}`);
        else if (data.detail) setError(data.detail);
        else setError('An unknown error occurred. Please try again.');
      } else {
        setError('Could not connect to the server. Please try again in 30 seconds.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // We are now using the "light" theme from globals.css
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head>
        <title>Sign Up | Workspace Africa</title>
      </Head>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Welcome to Workspace Africa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                type="text"
                placeholder="OlaMarcus"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="ola@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <p className="text-xs text-center text-red-600">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="w-full text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" legacyBehavior>
              <a className="font-medium text-primary hover:underline">
                Log In
              </a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
