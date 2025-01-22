import { Edit2, Eye, Trash2 } from 'lucide-react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
            {agent.llm}
          </span>
          <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
            Temp: {agent.temperature?.toFixed(2)}
          </span>
        </div>
        <span className="text-sm text-gray-600">
          <strong>Goal:</strong> {agent.goal}
        </span>
        <span className="text-sm text-gray-600">
          <strong>Task:</strong> {agent.task}
        </span>
      </div>
    </div>
  );
}