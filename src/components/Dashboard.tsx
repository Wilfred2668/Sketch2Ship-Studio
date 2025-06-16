
import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Plus, FolderOpen, Settings, Palette, Moon, Sun, Trash2 } from 'lucide-react';
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
import { useToast } from '../hooks/use-toast';

interface Project {
  id: string;
  name: string;
  pages: any[];
  currentPageId: string;
  createdAt: string;
  lastModified: string;
}

export const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  // Load projects from localStorage on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('websiteBuilderProjects') || '[]');
      setProjects(savedProjects.sort((a: Project, b: Project) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      ));
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    }
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      // Navigate to builder with project name as query parameter
      navigate(`/builder?projectName=${encodeURIComponent(projectName.trim())}`);
      setProjectName('');
      setIsDialogOpen(false);
    }
  };

  const handleOpenProject = (project: Project) => {
    // Navigate to builder with project ID as query parameter
    navigate(`/builder?projectId=${project.id}`);
  };

  const handleDeleteProject = (projectId: string, projectName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the project
    
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      try {
        const savedProjects = JSON.parse(localStorage.getItem('websiteBuilderProjects') || '[]');
        const filteredProjects = savedProjects.filter((p: Project) => p.id !== projectId);
        localStorage.setItem('websiteBuilderProjects', JSON.stringify(filteredProjects));
        
        loadProjects(); // Reload the projects list
        
        toast({
          title: "Project Deleted",
          description: `"${projectName}" has been deleted successfully.`,
        });
      } catch (error) {
        console.error('Failed to delete project:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete the project. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-emerald-900/10 dark:to-cyan-900/10 transition-all duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-emerald-200/60 dark:border-emerald-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  Sketch2Ship Studio
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
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
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
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
                <Button onClick={handleCreateProject} disabled={!projectName.trim()} className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700">
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
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-emerald-200/60 dark:border-emerald-700/60 transform hover:scale-105"
              onClick={() => handleOpenProject(project)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-emerald-100 dark:bg-emerald-800/30 px-2 py-1 rounded-full">
                      {formatDate(project.lastModified)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteProject(project.id, project.name, e)}
                      className="hover:bg-red-100 dark:hover:bg-red-800/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {project.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Created: {formatDate(project.createdAt)} • {project.pages?.length || 1} pages
                </p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" className="border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-800/20">
                    Open Project
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-emerald-100 dark:hover:bg-emerald-800/20">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-cyan-300 dark:from-emerald-700/30 dark:to-cyan-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No projects yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Create your first website project to get started building amazing websites with Sketch2Ship Studio
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
