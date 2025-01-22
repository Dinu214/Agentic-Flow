import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Plus } from 'lucide-react';
import { Agent, Task, Tool } from '../types';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  agent: Agent | null;
  tasks: Task[];
  tools: Tool[];
}

Modal.setAppElement('#root');

export default function AgentModal({ isOpen, onClose, onSave, agent, tasks, tools }: AgentModalProps) {
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    description: '',
    goal: '',
    llm: '',
    apiKey: '',
    task: '',
    taskId: undefined,
    prompt: '',
    temperature: 0.7,
    memory: 5,
    tools: []
  });
  const [useExistingTask, setUseExistingTask] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);


  useEffect(() => {
    if (agent) {
      setFormData(agent);
      setUseExistingTask(!!agent.taskId);
    } else {
      setFormData({
        name: '',
        description: '',
        goal: '',
        llm: '',
        task: '',
        taskId: undefined,
        prompt: '',
        temperature: 0.7,
        memory: 5,
        tools: []
      });
      setUseExistingTask(false);
    }
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useExistingTask && formData.taskId) {
      const selectedTask = tasks.find(t => t.id === formData.taskId);
      if (selectedTask) {
        formData.prompt = selectedTask.prompt;
      }
    }
    onSave(formData as Agent);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, temperature: value });
  };

  const toggleTool = (tool: Tool) => {
    const currentTools = formData.tools || [];
    const exists = currentTools.find(t => t.id === tool.id);
    
    if (exists) {
      setFormData({
        ...formData,
        tools: currentTools.filter(t => t.id !== tool.id)
      });
    } else {
      setFormData({
        ...formData,
        tools: [...currentTools, tool]
      });
    }
  };

  const confirmToolSelection = () => {
    setShowToolSelector(false);
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
            {agent ? 'Edit Agent' : 'Create New Agent'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal
              </label>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LLM
              </label>
              <select
                value={formData.llm}
                onChange={(e) => setFormData({ ...formData, llm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select LLM</option>
                <option value="GPT-4">GPT-4</option>
                <option value="GPT-3.5">GPT-3.5</option>
                <option value="Claude">Claude</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task
              </label>
              <input
                type="text"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Temperature
                </label>
                <span className="text-sm text-gray-500">
                  {formData.temperature?.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={formData.temperature}
                onChange={handleTemperatureChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.00</span>
                <span>0.50</span>
                <span>1.00</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Memory
                </label>
                <span className="text-sm text-gray-500">
                  {formData.memory}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.memory}
                onChange={(e) => setFormData({ ...formData, memory: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id="useExistingTask"
                  checked={useExistingTask}
                  onChange={(e) => setUseExistingTask(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="useExistingTask" className="text-sm font-medium text-gray-700">
                  Use existing task
                </label>
              </div>

              {useExistingTask ? (
                <select
                  value={formData.taskId}
                  onChange={(e) => setFormData({ ...formData, taskId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a task</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
              ) : (
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter the prompt template for this agent..."
                />
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Selected Tools
                </label>
                <button
                  type="button"
                  onClick={() => setShowToolSelector(true)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  <span>Select Tools</span>
                </button>
              </div>

              {showToolSelector ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {tools.map(tool => (
                      <div
                        key={tool.id}
                        onClick={() => toggleTool(tool)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.tools?.some(t => t.id === tool.id)
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <h3 className="font-medium text-gray-800">{tool.name}</h3>
                        <p className="text-sm text-gray-500">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={confirmToolSelection}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Selection
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.tools?.map(tool => (
                    <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">{tool.name}</h4>
                        <p className="text-sm text-gray-500">{tool.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTool(tool)}
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
              {agent ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}