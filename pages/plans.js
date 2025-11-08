import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Router from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { usePaystackPayment } from 'react-paystack'; // <-- Import Paystack
import { useToast } from "@/components/ui/use-toast"; // <-- We'll add this for notifications
import { Toaster } from "@/components/ui/toaster"; // <-- We'll add this

// --- Our Live Plan Codes ---
const PLAN_CODES = {
  'Flex Basic': 'PLN_mu2w42h302kwhs4',
  'Flex Pro': 'PLN_rlctlj6pkky8t94',
  'Flex Unlimited': 'PLN_bn2p2x82io1fooy',
};

const PlanCard = ({ plan, onSelect, isSelected }) => (
  <Card 
    onClick={() => onSelect(plan)}
    className={`w-full text-left transition-all cursor-pointer ${isSelected ? 'border-primary ring-2 ring-primary' : 'hover:border-neutral-300'}`}
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
          <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
          <span className="text-muted-foreground">
            {plan.included_days > 900 ? 'Unlimited' : plan.included_days} check-ins / month
          </span>
        </li>
        <li className="flex items-center">
          <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
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
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  // --- Paystack Config ---
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: userEmail,
    amount: selectedPlan ? Math.round(selectedPlan.price_ngn * 100) : 0, // Paystack wants kobo
    publicKey: PAYSTACK_KEY,
    plan: selectedPlan ? PLAN_CODES[selectedPlan.name] : '',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // --- Fetch Plans and User Email ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { Router.push('/login'); return; }

        const [plansRes, userRes] = await Promise.all([
          axios.get(`${API_URL}/api/plans/`),
          axios.get(`${API_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setPlans(plansRes.data);
        setUserEmail(userRes.data.email);

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // --- Handle Payment Success ---
  const onPaymentSuccess = (reference) => {
    console.log("Payment successful!", reference);
    // NOW, we tell our backend to create the subscription
    
    const token = localStorage.getItem('accessToken');
    axios.post(`${API_URL}/api/subscriptions/create/`, 
      { 
        plan_id: selectedPlan.id,
        paystack_reference: reference.reference 
        // We'll build this backend endpoint next
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      toast({
        title: "Subscription Activated!",
        description: "Welcome to Workspace Africa.",
      });
      // Send them to the app
      Router.push('/app');
    })
    .catch(err => {
      console.error(err);
      toast({
        title: "Error activating plan",
        description: "Your payment was successful but we couldn't activate your plan. Please contact support.",
        variant: "destructive",
      });
    });
  };

  const onPaymentClose = () => {
    console.log("Payment popup closed");
  };

  const handleContinue = () => {
    if (!selectedPlan) return;
    initializePayment(onPaymentSuccess, onPaymentClose);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>Select a Plan | Workspace Africa</title>
      </Head>
      <Toaster /> {/* Add Toaster for notifications */}

      <header className="py-5 border-b">
        <div className="container flex items-center justify-between px-6 mx-auto max-w-5xl">
          <img 
            src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" 
            alt="Workspace Africa Logo"
            className="h-8"
          />
        </div>
      </header>

      <main className="container px-6 py-12 mx-auto max-w-5xl">
        <h1 className="text-4xl font-extrabold md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You've successfully created your account. Select a plan to get started.
        </p>

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
        
        <div className="mt-10 text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan || !userEmail}
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

// Helper Icon
const CheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
