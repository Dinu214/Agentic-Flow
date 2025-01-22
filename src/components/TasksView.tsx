import React, { useState } from 'react';
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import SearchBar from './SearchBar';
import TaskModal from './TaskModal';
import { Task } from '../types';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TasksView({ tasks, setTasks }: TasksViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (task: Task) => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, { ...task, id: tasks.length + 1 }]);
    }
    setIsModalOpen(false);
    setSelectedTask(null);
    setIsViewMode(false);
  };

  const handleDelete = async (taskId: number) => {
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
      setTasks(tasks.filter(t => t.id !== taskId));
      Swal.fire({
        title: 'Deleted!',
        text: 'Your task has been deleted.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button 
          onClick={() => {
            setSelectedTask(null);
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
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {task.prompt.length > 100 
                    ? `${task.prompt.substring(0, 100)}...` 
                    : task.prompt}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                    setIsViewMode(false);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                    setIsViewMode(true);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setIsViewMode(false);
        }}
        onSave={handleCreateOrUpdate}
        task={selectedTask}
        viewMode={isViewMode}
      />
    </>
  );
}