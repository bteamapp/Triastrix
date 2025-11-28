
import React from 'react';
import { FilePlus, FolderOpen } from 'lucide-react';

interface WelcomeModalProps {
  onNewProject: () => void;
  onOpenProject: () => void;
}

export default function WelcomeModal({ onNewProject, onOpenProject }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-400">Welcome to Triastrix</h1>
          <p className="text-gray-400 mt-2">Your open-source 3D geometry tool.</p>
        </div>
        <div className="mt-8 flex flex-col space-y-4">
          <button
            onClick={onNewProject}
            className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FilePlus className="mr-2" size={20} />
            Create New Project
          </button>
          <button
            onClick={onOpenProject}
            className="flex items-center justify-center w-full px-6 py-3 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <FolderOpen className="mr-2" size={20} />
            Open Project (.trix3d)
          </button>
        </div>
      </div>
    </div>
  );
}
