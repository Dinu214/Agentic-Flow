import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Plus } from 'lucide-react';
import { Model, Agent } from '../types';

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (model: Model) => void;
  model: Model | null;
  availableAgents: Agent[];
}

Modal.setAppElement('#root');

export default function ModelModal({ isOpen, onClose, onSave, model, availableAgents }: ModelModalProps) {
  const [formData, setFormData] = useState<Partial<Model>>({
    name: '',
    description: '',
    agents: []
  });
  const [showAgentSelector, setShowAgentSelector] = useState(false);

  useEffect(() => {
    if (model) {
      setFormData(model);
    } else {
      setFormData({ name: '', description: '', agents: [] });
    }
  }, [model]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Model);
  };

  const toggleAgent = (agent: Agent) => {
    const agents = formData.agents || [];
    const exists = agents.find(a => a.id === agent.id);
    
    if (exists) {
      setFormData({
        ...formData,
        agents: agents.filter(a => a.id !== agent.id)
      });
    } else {
      setFormData({
        ...formData,
        agents: [...agents, agent]
      });
    }
  };

  const confirmAgentSelection = () => {
    setShowAgentSelector(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl outline-none max-h-[90vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex flex-col h-[90vh]">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {model ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Selected Agents
                </label>
                <button
                  type="button"
                  onClick={() => setShowAgentSelector(true)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  <span>Select Agents</span>
                </button>
              </div>

              {showAgentSelector ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {availableAgents.map(agent => (
                      <div
                        key={agent.id}
                        onClick={() => toggleAgent(agent)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.agents?.some(a => a.id === agent.id)
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <h3 className="font-medium text-gray-800">{agent.name}</h3>
                        <p className="text-sm text-gray-500">{agent.description}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={confirmAgentSelection}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Selection
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.agents?.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">{agent.name}</h4>
                        <p className="text-sm text-gray-500">{agent.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAgent(agent)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {model ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}