import { Edit2, Trash2, FileJson } from 'lucide-react';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
  onEdit: () => void;
  onDelete: () => void;
  onViewJson: () => void;
  onToggleActive: () => void;
}

export default function ModelCard({ model, onEdit, onDelete, onViewJson, onToggleActive }: ModelCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{model.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{model.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onViewJson}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FileJson size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {model.agents.length} Agents
          </span>
        </div>
        <button
          onClick={onToggleActive}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            model.active 
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {model.active ? 'Active' : 'Inactive'}
        </button>
      </div>
    </div>
  );
}