import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Router from 'next/router';

// This is our "Raptor-style" dark-themed Plan Card
const PlanCard = ({ plan, onSelect, isSelected }) => (
  <button
    onClick={() => onSelect(plan)}
    className={`
      p-6 text-left w-full bg-neutral-800 rounded-2xl border-2
      transition-all
      ${isSelected 
        ? 'border-teal-500' 
        : 'border-neutral-700 hover:border-neutral-600'
      }
    `}
  >
    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
    <p className="mt-4 text-4xl font-bold text-white">
      ₦{Number(plan.price_ngn).toLocaleString()}
      <span className="text-lg font-medium text-neutral-400"> / mo</span>
    </p>
    <ul className="mt-6 space-y-3">
      <li className="flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        <span className="text-neutral-300">
          {plan.included_days > 900 ? 'Unlimited' : plan.included_days} check-ins / month
        </span>
      </li>
      <li className="flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        <span className="text-neutral-300">
          Access to {plan.access_tier === 'STANDARD' ? 'Standard' : 'All'} Spaces
        </span>
      </li>
    </ul>
  </button>
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
        // If plans fail, we can't do anything
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleContinue = () => {
    if (!selectedPlan) return;
    
    // In a real app, this is where we'd send the user to Paystack
    // We pass the plan details in the query
    console.log("Redirecting to payment for:", selectedPlan.name);
    // For now, let's just send them to the main app page
    Router.push('/app');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Head>
        <title>Select a Plan | Workspace Africa</title>
      </Head>

      {/* --- Header with our Logo --- */}
      <header className="py-5 border-b border-neutral-800">
        <div className="container flex items-center justify-between px-6 mx-auto max-w-5xl">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="h-10" // You can adjust the height
          />
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container px-6 py-12 mx-auto max-w-5xl">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-neutral-300">
          You've successfully created your account. Select a plan to get started.
        </p>

        {/* --- Plans Grid --- */}
        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
          {loading ? (
            <p>Loading plans...</p>
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
          <button
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="w-full max-w-md px-8 py-4 text-lg font-bold text-white bg-teal-600 rounded-lg transition-all hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedPlan 
              ? `Continue with ${selectedPlan.name}` 
              : 'Select a Plan to Continue'}
          </button>
        </div>
      </main>
    </div>
  );
}
