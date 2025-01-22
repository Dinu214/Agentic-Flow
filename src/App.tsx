import { useState, useEffect } from 'react';
import AuthPage from './login';
import Sidebar from './components/Sidebar';
import ModelsView from './components/ModelsView';
import AgentsView from './components/AgentsView';
import TasksView from './components/TasksView';
import ToolsView from './components/ToolsView';
import RagView from './components/RagView';
import { Model, Agent, Task, Tool } from './types';
import { fileNames } from './components/sharedFiles';


console.log('fileNames :', fileNames);
// Update initial models to include isActive
const initialModels: Model[] = [
  {
    id: 1,
    name: 'Energy Intelligence',
    description: 'Smart energy analysis',
    isActive: false,
    agents: [
      {
        id: 1,
        name: 'SQL Agent',
        description: 'Handles database operations',
        goal: 'Manage energy data in SQL',
        llm: 'GPT-4',
        task: 'Database Management',
        taskId: 1,
        temperature: 0.7,
        memory: 5,
        tools: []
      }
    ],
    active: undefined
  },
  {
    id: 2,
    name: 'Customer Service Bot',
    description: 'Support automation',
    isActive: false,
    agents: [],
    active: undefined
  }
];

// Update initial agents to include memory
const initialAgents: Agent[] = [
  {
    id: 1,
    name: 'SQL Agent',
    description: 'Handles database operations',
    goal: 'Manage data in SQL',
    llm: 'GPT-4',
    task: 'Database Management',
    taskId: 1,
    temperature: 0.7,
    memory: 5,
    tools: []
  },
  {
    id: 2,
    name: 'Chart Generator',
    description: 'Creates visualizations',
    goal: 'Generate insightful charts',
    llm: 'GPT-4',
    task: 'Data Visualization',
    taskId: 2,
    temperature: 0.7,
    memory: 8,
    tools: []
  }
];

const initialTasks: Task[] = [
  {
    id: 1,
    name: 'SQL Data Analysis',
    prompt: `You are a SQL expert tasked with analyzing database performance. Follow these steps:
1. Monitor query execution times
2. Identify slow-performing queries
3. Suggest optimization strategies
4. Implement index recommendations
5. Document all findings and changes`
  },
  {
    id: 2,
    name: 'Customer Support Response',
    prompt: `Act as a customer support agent with these guidelines:
1. Greet the customer professionally
2. Identify the core issue from their message
3. Provide clear, step-by-step solutions
4. Use empathetic language
5. Follow up to ensure resolution`
  }
];

const initialTools: Tool[] = [
  {
    id: 1,
    name: 'PostgreSQL Database',
    description: 'Main database connection',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'main_db',
    username: 'admin',
    password: '********',
    config: {}
  },
  {
    id: 2,
    name: 'Document Scanner',
    description: 'PDF document processor',
    type: 'pdf',
    maxFileSize: 10,
    allowedExtensions: ['.pdf'],
    config: {}
  },
  {
    id: 3,
    name: 'RAG',
    description: 'Rag tool',
    type: 'rag',
    selectedFiles: fileNames,
    fetchChunks: 4,
    config: {}
  }
];

function App() {  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ email: string; name?: string } | undefined>(undefined);
  const [activeView, setActiveView] = useState('goals');
  const [models, setModels] = useState(initialModels);
  const [agents, setAgents] = useState(initialAgents);
  const [tasks, setTasks] = useState(initialTasks);
  const [tools, setTools] = useState(initialTools);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check for existing session on component mount
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (userData: { email: string; name?: string }) => {
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(undefined);
    setShowUserMenu(false);
  };

  // const getInitials = (name: string) => {
  //   return name
  //     ?.split(' ')
  //     .map(word => word[0])
  //     .join('')
  //     .toUpperCase() || '?';
  // };

  // const UserMenu = () => (
  //   <div className="relative">
  //     <button
  //       onClick={() => setShowUserMenu(!showUserMenu)}
  //       className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  //     >
  //       {getInitials(userData?.name || userData?.email || '')}
  //     </button>

  //     {showUserMenu && (
  //       <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
  //         <div className="py-1" role="menu">
  //           <div className="px-4 py-2 text-sm text-gray-700 border-b">
  //             <div className="font-medium">{userData?.name}</div>
  //             <div className="text-gray-500">{userData?.email}</div>
  //           </div>
  //           <button
  //             onClick={handleLogout}
  //             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
  //             role="menuitem"
  //           >
  //             <LogOut className="w-4 h-4" />
  //             Sign out
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  const renderContent = () => {
    switch (activeView) {
      case 'goals':
        return <ModelsView models={models} setModels={setModels} agents={agents} tasks={tasks} />;
      case 'agents':
        return <AgentsView agents={agents} setAgents={setAgents} tasks={tasks} tools={tools} />;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} />;
      case 'tools':
        return <ToolsView tools={tools} setTools={setTools} />;
      case 'rag':
        return <RagView />;
      default:
        return <ModelsView models={models} setModels={setModels} agents={agents} tasks={tasks} />;
    }
  };

  // Click outside handler for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed h-screen">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          userData={userData}
          onLogout={handleLogout}
        />
      </div>
      <div className="flex-1 ml-64">
        <main>
          {/* <div className="p-4 border-b bg-white flex justify-end sticky top-0 z-10">
            <div className="user-menu">
              <UserMenu />
            </div>
          </div> */}
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default App;