
import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Palette, Shield, Zap, Globe } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Sketch2Ship Studio
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Build Beautiful Websites
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                  Without Code
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Create stunning, professional websites with our drag-and-drop builder. 
                No coding experience required.
              </p>
              
              {/* Auth Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 px-8 py-3 text-lg">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="lg" variant="outline" className="border-2 px-8 py-3 text-lg">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Builder</h3>
                <p className="text-gray-600">
                  Drag and drop components to create your perfect website layout in minutes.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600">
                  Build and deploy websites in record time with our optimized workflow.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Publish Anywhere</h3>
                <p className="text-gray-600">
                  Export your websites and host them anywhere, or use our built-in hosting.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of creators who trust our platform
              </p>
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg">
                  Create Your First Website
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
};
