import { LayoutGrid, Users, Wrench, ListTodo, Database, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userData?: { name?: string; email: string };
  onLogout: () => void;
}

const menuItems = [
  { id: 'goals', icon: LayoutGrid, label: 'Goals' },
  { id: 'agents', icon: Users, label: 'Agents' },
  { id: 'tools', icon: Wrench, label: 'Tools' },
  { id: 'tasks', icon: ListTodo, label: 'Tasks' },
  { id: 'rag', icon: Database, label: 'RAG' }
];

export default function Sidebar({ activeView, onViewChange, userData, onLogout }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="">
      <img
          src="/Terra.png" // Replace with your image path
          alt="Your Logo"
          width={200}
          height={80}
          className="w-auto h-13"
        />
      </div>
      
      <nav className="flex-grow overflow-y-auto">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 cursor-pointer ${
              activeView === item.id
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="relative mt-auto pt-4 border-t" ref={menuRef}>
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <div className="bg-blue-600 p-2 rounded-full">
            <User size={20} className="text-white" />
          </div>
          <div className="flex-grow">
            <div className="font-medium text-gray-700">{userData?.name}</div>
            <div className="text-sm text-gray-500">{userData?.email}</div>
          </div>
        </div>

        {showUserMenu && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border z-50">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}