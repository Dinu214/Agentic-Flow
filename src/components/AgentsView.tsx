import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import AgentCard from './AgentCard';
import AgentModal from './AgentModal';
import { Agent, Task, Tool } from '../types';

interface AgentsViewProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  tasks: Task[];
  tools: Tool[];
}

export default function AgentsView({ agents, setAgents, tasks, tools }: AgentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (agent: Agent) => {
    if (selectedAgent) {
      setAgents(agents.map(a => a.id === agent.id ? agent : a));
    } else {
      setAgents([...agents, { ...agent, id: agents.length + 1 }]);
    }
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  const handleDelete = async (agentId: number) => {
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
      setAgents(agents.filter(a => a.id !== agentId));
      Swal.fire({
        title: 'Deleted!',
        text: 'Your agent has been deleted.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Agents</h1>
        <button 
          onClick={() => {
            setSelectedAgent(null);
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
        {filteredAgents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onEdit={() => {
              setSelectedAgent(agent);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(agent.id)}
          />
        ))}
      </div>

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAgent(null);
        }}
        onSave={handleCreateOrUpdate}
        agent={selectedAgent}
        tasks={tasks}
        tools={tools}
      />
    </>
  );
}