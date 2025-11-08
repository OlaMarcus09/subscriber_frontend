import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';

// --- FORCING A VERCEL RE-BUILD ---

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Head>
        <title>Workspace Africa | Your Key to the City</title>
        <meta 
          name="description" 
          content="Get one pass for a network of co-working spaces in Ibadan and across Nigeria. Flexible plans for individuals and teams." 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* --- Header --- */}
      <header className="py-5">
        <nav className="container flex items-center justify-between px-6 mx-auto max-w-6xl">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="h-8"
          />
          <div className="space-x-2 flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-1 flex items-center">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold md:text-7xl">
              Your City, Your Office.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Stop being locked into one location. Workspace Africa is your single, flexible pass to a network of premium co-working spaces across Ibadan and beyond.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="py-12">
        <div className="container px-6 mx-auto text-center text-muted-foreground max-w-6xl">
          <p>&copy; {new Date().getFullYear()} Workspace Africa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
