import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MessageCircle, BookOpen, Calendar, FileText, Calculator, Brain, Users, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-purdue-gold" />
            </div>
            <h1 className="text-5xl font-bold text-purdue-black mb-4">
              Boiler AI
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Your AI Academic Advisor for Purdue University
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Get instant, personalized course planning without the wait for advisor appointments. 
              Covering everything academically related to Purdue University.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for successful academic planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-purdue-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purdue-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Driven Chat</h3>
              <p className="text-gray-600">
                Get instant course recommendations and academic advice from our AI advisor
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purdue-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-purdue-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Course Database</h3>
              <p className="text-gray-600">
                Comprehensive database of 108 majors and 147 programs at Purdue
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purdue-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purdue-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transcript Analysis</h3>
              <p className="text-gray-600">
                Upload your transcript for automated analysis and progress tracking
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purdue-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-purdue-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Builder</h3>
              <p className="text-gray-600">
                Build conflict-free schedules with our intelligent planning tool
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purdue-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-purdue-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GPA Calculator</h3>
              <p className="text-gray-600">
                Calculate and predict your GPA with grade tracking
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purdue-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purdue-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your progress toward graduation goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purdue-gold mb-2">108</div>
              <div className="text-gray-600">Majors Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purdue-gold mb-2">147</div>
              <div className="text-gray-600">Programs Offered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purdue-gold mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purdue-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Plan Your Academic Future?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of Purdue students using Boiler AI for better academic planning
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 