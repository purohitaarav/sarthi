import React from 'react';
import { Zap } from 'lucide-react';

const About = () => {
  const benefits = [
    'Easy-to-use interface for all users',
    'Secure and reliable service',
    'Access your data from anywhere, anytime',
    'Fast and responsive performance',
    'Regular updates with new features',
    'Dedicated support when you need it'
  ];

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Sarthi</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your trusted companion for managing your digital life with ease and confidence
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <p className="text-gray-700 mb-6">
            Sarthi is designed to simplify your daily tasks and help you stay organized. 
            Whether you're managing personal projects, keeping track of important information, 
            or collaborating with others, we've got you covered.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ul className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Zap className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Getting Started</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Install dependencies: <code className="bg-white px-2 py-1 rounded text-sm">npm run install-deps</code></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Set up database: <code className="bg-white px-2 py-1 rounded text-sm">npm run setup-db</code></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Start development: <code className="bg-white px-2 py-1 rounded text-sm">npm run dev</code></span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default About;
