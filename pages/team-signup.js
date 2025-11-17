import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building, Users, CreditCard, CheckCircle, ArrowRight, Sparkles, Zap, Calendar } from 'lucide-react';

export default function TeamSignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    
    // Team Size
    teamSize: '5',
    
    // Billing
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const plans = [
    {
      id: 'team-basic',
      name: 'Team Basic',
      price: '₦25,000',
      period: '/month',
      seats: 5,
      daysPerMember: 15,
      features: [
        '5 team members',
        '15 days per member/month',
        'Standard spaces access',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'team-pro',
      name: 'Team Pro',
      price: '₦45,000',
      period: '/month',
      seats: 10,
      daysPerMember: 18,
      features: [
        '10 team members',
        '18 days per member/month',
        'Standard + Premium spaces',
        'Advanced analytics',
        'Priority support',
        'Team management tools'
      ],
      popular: true
    },
    {
      id: 'team-enterprise',
      name: 'Team Enterprise',
      price: '₦80,000',
      period: '/month',
      seats: 20,
      daysPerMember: 22,
      features: [
        '20 team members',
        '22 days per member/month',
        'All spaces access',
        'Custom analytics',
        'Dedicated support',
        'API access',
        'Custom billing'
      ],
      popular: false
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/team/signup/`, {
        ...formData,
        plan: selectedPlanData,
        user_type: 'TEAM_ADMIN'
      });

      if (response.status === 201) {
        setStep(4); // Success step
        
        // Redirect to payment if Paystack integration is ready
        // Router.push(response.data.payment_url);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ number, title, active, completed }) => (
    <div className="flex items-center space-x-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
      }`}>
        {completed ? <CheckCircle className="w-4 h-4" /> : number}
      </div>
      <span className={`text-sm ${active ? 'text-white font-medium' : 'text-gray-400'}`}>
        {title}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Team Signup | Workspace Africa</title>
      </Head>

      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container px-4 mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Workspace
              </span>
            </div>
            <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link href="/login">Already have a team? Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 mx-auto py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Start Your Team Plan
          </h1>
          <p className="text-gray-400 text-lg">
            Give your team flexible access to amazing workspaces across Nigeria
          </p>
        </div>

        {/* Step Indicator */}
        <Card className="border-0 bg-gray-900/50 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <StepIndicator 
                number={1} 
                title="Choose Plan" 
                active={step === 1} 
                completed={step > 1}
              />
              <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
              <StepIndicator 
                number={2} 
                title="Company Info" 
                active={step === 2} 
                completed={step > 2}
              />
              <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
              <StepIndicator 
                number={3} 
                title="Payment" 
                active={step === 3} 
                completed={step > 3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div>
            <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-400" />
                  Choose Your Team Plan
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Select the plan that best fits your team's needs
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`border-0 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPlan === plan.id 
                      ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30' 
                      : 'bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-purple-500/30'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <CardContent className="p-6">
                    {plan.popular && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4 text-xs">
                        ⭐ Most Popular
                      </Badge>
                    )}
                    
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        selectedPlan === plan.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      } text-white`}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Company Information */}
        {step === 2 && (
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Building className="w-6 h-6 mr-2 text-green-400" />
                Company Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about your company and team admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Company Name</label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Your company name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Admin Full Name</label>
                  <Input
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="Team admin name"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Admin Email</label>
                  <Input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Admin Phone Number</label>
                <Input
                  value={formData.adminPhone}
                  onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              {/* Selected Plan Summary */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white text-sm mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    Selected Plan
                  </h4>
                  {selectedPlan && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">
                          {plans.find(p => p.id === selectedPlan)?.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {plans.find(p => p.id === selectedPlan)?.seats} seats • {plans.find(p => p.id === selectedPlan)?.daysPerMember} days/member
                        </p>
                      </div>
                      <p className="text-white font-bold">
                        {plans.find(p => p.id === selectedPlan)?.price}
                        <span className="text-gray-400 text-sm font-normal">/month</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Back to Plans
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!formData.companyName || !formData.adminName || !formData.adminEmail}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment Information */}
        {step === 3 && (
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-yellow-400" />
                Payment Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Secure payment powered by Paystack
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Card Number</label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Expiry Date</label>
                  <Input
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">CVV</label>
                  <Input
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white text-sm mb-3">Order Summary</h4>
                  {selectedPlan && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plan</span>
                        <span className="text-white">{plans.find(p => p.id === selectedPlan)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Seats</span>
                        <span className="text-white">{plans.find(p => p.id === selectedPlan)?.seats} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Billing</span>
                        <span className="text-white">Monthly</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">Total</span>
                          <span className="text-white">{plans.find(p => p.id === selectedPlan)?.price}/month</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !formData.cardNumber || !formData.expiryDate || !formData.cvv}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? 'Processing...' : 'Complete Signup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="border-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Workspace Africa Teams!</h2>
              <p className="text-gray-300 mb-6">
                Your team plan has been activated. You can now start inviting team members 
                and managing your workspace access.
              </p>
              
              {selectedPlan && (
                <Card className="bg-black/30 border-gray-700 mb-6">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">
                        {plans.find(p => p.id === selectedPlan)?.name}
                      </span>
                      <span className="text-white font-bold">
                        {plans.find(p => p.id === selectedPlan)?.price}/month
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {plans.find(p => p.id === selectedPlan)?.seats} seats • {plans.find(p => p.id === selectedPlan)?.daysPerMember} days per member
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-3">
                <Button 
                  onClick={() => Router.push('/team')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Team Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => Router.push('/')}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Return to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
