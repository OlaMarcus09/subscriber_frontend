import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Router from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// This is our new "shadcn-style" Plan Card
const PlanCard = ({ plan, onSelect, isSelected }) => (
  <Card 
    onClick={() => onSelect(plan)}
    className={`
      w-full text-left transition-all cursor-pointer
      ${isSelected 
        ? 'border-primary ring-2 ring-primary' 
        : 'hover:border-neutral-300'
      }
    `}
  >
    <CardHeader>
      <CardTitle>{plan.name}</CardTitle>
      <CardDescription>
        <span className="text-3xl font-bold text-foreground">
          ₦{Number(plan.price_ngn).toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground"> / mo</span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <span className="text-muted-foreground">
            {plan.included_days > 900 ? 'Unlimited' : plan.included_days} check-ins / month
          </span>
        </li>
        <li className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <span className="text-muted-foreground">
            Access to {plan.access_tier === 'STANDARD' ? 'Standard' : 'All'} Spaces
          </span>
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch plans from our live API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/plans/`);
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleContinue = () => {
    if (!selectedPlan) return;
    console.log("Redirecting to payment for:", selectedPlan.name);
    // TODO: Add Paystack integration here
    
    // For now, let's just send them to the main app page
    Router.push('/app');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>Select a Plan | Workspace Africa</title>
      </Head>

      {/* --- Header with our Logo --- */}
      <header className="py-5 border-b">
        <div className="container flex items-center justify-between px-6 mx-auto max-w-5xl">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="h-8"
          />
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container px-6 py-12 mx-auto max-w-5xl">
        <h1 className="text-4xl font-extrabold md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You've successfully created your account. Select a plan to get started.
        </p>

        {/* --- Plans Grid --- */}
        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
          {loading ? (
            <p className="text-muted-foreground">Loading plans...</p>
          ) : (
            plans.map(plan => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onSelect={setSelectedPlan}
                isSelected={selectedPlan?.id === plan.id}
              />
            ))
          )}
        </div>
        
        {/* --- Continue Button --- */}
        <div className="mt-10 text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="w-full max-w-md h-12 text-lg"
          >
            {selectedPlan 
              ? `Continue with ${selectedPlan.name}` 
              : 'Select a Plan to Continue'}
          </Button>
        </div>
      </main>
    </div>
  );
}
