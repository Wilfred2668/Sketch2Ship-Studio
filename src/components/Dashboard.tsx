
import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Plus, FolderOpen, Settings, Palette, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useTheme } from '../contexts/ThemeContext';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
}

export const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sample Website',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20'
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectName.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      setProjects(prev => [newProject, ...prev]);
      setProjectName('');
      setIsDialogOpen(false);
      // Navigate to builder with the new project
      navigate('/builder');
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  Website Builder
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-amber-500" /> : 
                  <Moon className="w-5 h-5 text-slate-600" />
                }
              </Button>
              <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:block">
                Welcome, {user?.firstName}!
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your Projects</h2>
          <p className="text-slate-600 dark:text-slate-400">Create and manage your website projects</p>
        </div>

        {/* Create Project Button */}
        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-slate-100">Create New Project</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Enter a name for your new website project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-name" className="text-right text-slate-700 dark:text-slate-300">
                    Name
                  </Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Website"
                    className="col-span-3 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-300 dark:border-slate-600">
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={!projectName.trim()} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/60 dark:border-slate-700/60 transform hover:scale-105"
              onClick={() => handleOpenProject(project.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                    {project.lastModified}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {project.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Created on {project.createdAt}
                </p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    Open Project
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No projects yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Create your first website project to get started building amazing websites
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
