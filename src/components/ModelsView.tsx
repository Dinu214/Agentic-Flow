import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import ModelCard from './ModelCard';
import ModelModal from './ModelModal';
import JsonViewModal from './JsonViewModal';
import { Model, Agent, Task } from '../types';

interface ModelsViewProps {
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
  agents: Agent[];
  tasks: Task[]; // Add tasks prop
}

export default function ModelsView({ models, setModels, agents, tasks }: ModelsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [selectedModelForJson, setSelectedModelForJson] = useState<Model | null>(null);

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (model: Model) => {
    if (selectedModel) {
      setModels(models.map(m => m.id === model.id ? { ...model, active: model.active } : m));
    } else {
      setModels([...models, { ...model, id: models.length + 1, agents: [], active: true }]);
    }
    setIsModalOpen(false);
    setSelectedModel(null);
  };

  const handleDelete = async (modelId: number) => {
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
      setModels(models.filter(m => m.id !== modelId));
      Swal.fire({
        title: 'Deleted!',
        text: 'Your goal has been deleted.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const prepareJsonData = (model: Model) => {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      active: model.active,
      isActive: model.isActive,
      agents: model.agents.map(agent => {
        // Find the full task details for this agent
        const taskDetails = tasks.find(t => t.id === agent.taskId);
        
        return {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          goal: agent.goal,
          llm: agent.llm,
          task: {
            id: agent.taskId,
            name: agent.task,
            prompt: taskDetails?.prompt || agent.prompt || ''
          },
          temperature: agent.temperature,
          memory: agent.memory,
          tools: agent.tools.map(tool => ({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            type: tool.type,
            configuration: getToolConfiguration(tool)
          }))
        };
      })
    };
  };

  const getToolConfiguration = (tool: any) => {
    // Remove common fields and return specific configuration
    const { id, name, description, type, ...configuration } = tool;
    return configuration;
  };
  
  const handleToggleActive = (modelId: number) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, active: !model.active }
        : model
    ));
  };

  const handleViewJson = (model: Model) => {
    const jsonData = prepareJsonData(model);
    setSelectedModelForJson(jsonData);
    setIsJsonModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Goals</h1>
        <button 
          onClick={() => {
            setSelectedModel(null);
            setIsModalOpen(true);
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
        {filteredModels.map(model => (
          <ModelCard
            key={model.id}
            model={model}
            onEdit={() => {
              setSelectedModel(model);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(model.id)}
            onViewJson={() => handleViewJson(model)}
            onToggleActive={() => handleToggleActive(model.id)}
          />
        ))}
      </div>

      <ModelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModel(null);
        }}
        onSave={handleCreateOrUpdate}
        model={selectedModel}
        availableAgents={agents}
      />

      <JsonViewModal
        isOpen={isJsonModalOpen}
        onClose={() => {
          setIsJsonModalOpen(false);
          setSelectedModelForJson(null);
        }}
        data={selectedModelForJson}
        title={`${selectedModelForJson?.name || 'Goal'} Configuration`}
      />
    </>
  );
}