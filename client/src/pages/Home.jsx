import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, Settings, BookOpen, ArrowRight } from 'lucide-react';

const Home = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Simple & Intuitive',
      description: 'Designed with a clean interface that makes managing your tasks a breeze',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Collaborate with Ease',
      description: 'Work together with your team in real-time',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Settings,
      title: 'Customizable',
      description: 'Tailor the experience to fit your specific needs',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Sarthi
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Your personal guide to getting things done, staying organized, and achieving more every day
        </p>
        
        <div className="flex justify-center gap-4">
          <Link
            to="/get-started"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition-shadow"
          >
            <div className={`w-16 h-16 ${benefit.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {benefit.title}
            </h3>
            <p className="text-gray-600">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-12 text-center">
        <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of users who are already simplifying their workflow with Sarthi
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create Your Free Account
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

      {/* Quick Links */}
      <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/features"
            className="group p-6 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">Explore Features</h3>
                <p className="mt-1 text-sm text-gray-500">Discover what makes Sarthi special</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
            </div>
          </Link>
          
          <Link
            to="/tutorials"
            className="group p-6 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">View Tutorials</h3>
                <p className="mt-1 text-sm text-gray-500">Learn how to make the most of Sarthi</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
            </div>
          </Link>
          
          <Link
            to="/contact"
            className="group p-6 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">Need Help?</h3>
                <p className="mt-1 text-sm text-gray-500">Our support team is here for you</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
