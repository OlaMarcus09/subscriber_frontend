import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Building, MapPin, User, Mail, Phone, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function PartnerSignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    
    // Space Info
    spaceName: '',
    spaceAddress: '',
    spaceCity: 'Ibadan',
    amenities: '',
    
    // Business Info
    businessRegistration: '',
    bankAccount: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // This would call your backend partner application endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/partner/apply/`, {
        ...formData,
        user_type: 'PARTNER'
      });

      if (response.status === 201) {
        setStep(4); // Success step
      }
    } catch (error) {
      console.error('Application failed:', error);
      // Handle error (show message to user)
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
        <title>Partner Application | Workspace Africa</title>
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
              <Link href="/login">Already a Partner? Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 mx-auto py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Become a Partner Space
          </h1>
          <p className="text-gray-400 text-lg">
            List your coworking space and start earning with every check-in
          </p>
        </div>

        {/* Step Indicator */}
        <Card className="border-0 bg-gray-900/50 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <StepIndicator 
                number={1} 
                title="Personal Info" 
                active={step === 1} 
                completed={step > 1}
              />
              <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
              <StepIndicator 
                number={2} 
                title="Space Details" 
                active={step === 2} 
                completed={step > 2}
              />
              <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
              <StepIndicator 
                number={3} 
                title="Business Info" 
                active={step === 3} 
                completed={step > 3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
              <Button 
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.email || !formData.phone}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
              >
                Continue to Space Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Space Details */}
        {step === 2 && (
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Building className="w-6 h-6 mr-2 text-green-400" />
                Space Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tell us about your coworking space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Space Name</label>
                <Input
                  value={formData.spaceName}
                  onChange={(e) => handleInputChange('spaceName', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="e.g., Tech Hub Ibadan"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Full Address</label>
                <Input
                  value={formData.spaceAddress}
                  onChange={(e) => handleInputChange('spaceAddress', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Street address, city, state"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">City</label>
                <select
                  value={formData.spaceCity}
                  onChange={(e) => handleInputChange('spaceCity', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                >
                  <option value="Ibadan">Ibadan</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Amenities</label>
                <Input
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="WiFi, AC, Coffee, Meeting Rooms, etc."
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!formData.spaceName || !formData.spaceAddress}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Continue to Business Info
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Information */}
        {step === 3 && (
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Building className="w-6 h-6 mr-2 text-yellow-400" />
                Business Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Final details for payout setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Business Registration Number (Optional)</label>
                <Input
                  value={formData.businessRegistration}
                  onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="RC Number if available"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Bank Account Number</label>
                <Input
                  value={formData.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="10-digit account number"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Used for monthly payouts (₦1,500 per check-in)
                </p>
              </div>

              {/* Terms and Conditions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white text-sm mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    Partner Benefits
                  </h4>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• ₦1,500 payout per member check-in</li>
                    <li>• Monthly automated payments</li>
                    <li>• Real-time dashboard analytics</li>
                    <li>• Free marketing on our platform</li>
                    <li>• Dedicated partner support</li>
                  </ul>
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
                  disabled={loading || !formData.bankAccount}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
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
              <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
              <p className="text-gray-300 mb-6">
                Thank you for your interest in becoming a Workspace Africa partner. 
                Our team will review your application and contact you within 2 business days.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => Router.push('/')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Return to Homepage
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => Router.push('/login')}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Partner Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
