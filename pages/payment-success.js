import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  
  // After 3 seconds, send them to the app
  useEffect(() => {
    setTimeout(() => {
      Router.push('/app');
    }, 3000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head>
        <title>Payment Successful | Workspace Africa</title>
      </Head>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CheckIcon className="w-16 h-16 mx-auto text-green-500" />
          <CardTitle className="text-2xl pt-4">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your subscription is now active. Welcome to Workspace Africa!
          </p>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Redirecting you to the app...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const CheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
