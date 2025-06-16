
import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Plus, History, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateWebsite = () => {
    navigate('/builder');
  };

  const handleViewPreviousWebsites = () => {
    // For now, just navigate to builder - can be expanded later
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Website Builder
          </h1>
        </div>
        <UserButton />
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning websites with our drag-and-drop builder or manage your existing projects.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Website Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 mx-auto">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Create New Website
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Start building your website from scratch with our intuitive drag-and-drop interface.
            </p>
            <Button 
              onClick={handleCreateWebsite}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
            >
              Get Started
            </Button>
          </div>

          {/* Previous Websites Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6 mx-auto">
              <History className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Previous Websites
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Access and edit your previously created websites and continue where you left off.
            </p>
            <Button 
              onClick={handleViewPreviousWebsites}
              variant="outline"
              className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 text-lg"
            >
              View Projects
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Palette className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Drag & Drop Builder</h4>
            <p className="text-gray-600 text-sm">Easily create websites with our intuitive visual editor</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Project History</h4>
            <p className="text-gray-600 text-sm">Keep track of all your website projects in one place</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Quick Creation</h4>
            <p className="text-gray-600 text-sm">Start building immediately with pre-designed components</p>
          </div>
        </div>
      </div>
    </div>
  );
};
