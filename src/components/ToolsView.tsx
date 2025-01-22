import React, { useState } from 'react';
import { Plus} from 'lucide-react';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import ToolCard from './ToolCard';
import ToolModal from './ToolModal';
import { Tool } from '../types';

interface ToolsViewProps {
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
}

export default function ToolsView({ tools, setTools }: ToolsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (tool: Tool) => {
    if (selectedTool) {
      setTools(tools.map(t => t.id === tool.id ? tool : t));
    } else {
      setTools([...tools, { ...tool, id: tools.length + 1 }]);
    }
    setIsModalOpen(false);
    setSelectedTool(null);
    setIsViewMode(false);
  };

  const handleDelete = async (toolId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTools(tools.filter(t => t.id !== toolId));
      Swal.fire({
        title: 'Deleted!',
        text: 'Your tool has been deleted.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tools</h1>
        <button 
          onClick={() => {
            setSelectedTool(null);
            setIsModalOpen(true);
            setIsViewMode(false);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create New</span>
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onEdit={() => {
              setSelectedTool(tool);
              setIsModalOpen(true);
              setIsViewMode(false);
            }}
            onView={() => {
              setSelectedTool(tool);
              setIsModalOpen(true);
              setIsViewMode(true);
            }}
            onDelete={() => handleDelete(tool.id)}
          />
        ))}
      </div>

      <ToolModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTool(null);
          setIsViewMode(false);
        }}
        onSave={handleCreateOrUpdate}
        tool={selectedTool}
        viewMode={isViewMode}
      />
    </>
  );
}