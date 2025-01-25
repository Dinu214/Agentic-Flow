export interface Model {
  active: any;
  id: number;
  name: string;
  description: string;
  agents: Agent[];
  isActive: boolean;
}

export interface Agent {
  id: number;
  name: string;
  description: string;
  goal: string;
  llm: string;
  task: string;
  taskId?: number;
  prompt?: string;
  temperature: number;
  apiKey: string;
  memory: number;
  tools: Tool[];
}

export interface Task {
  id: number;
  name: string;
  prompt: string;
}

export type ToolType = 
  | 'browser'
  | 'code-docs'
  | 'code-interpreter'
  | 'composio'
  | 'csv'
  | 'dalle'
  | 'directory'
  | 'docx'
  | 'directory-read'
  | 'exa'
  | 'file-read'
  | 'firecrawl-search'
  | 'firecrawl-crawl'
  | 'firecrawl-scrape'
  | 'github'
  | 'serper-dev'
  | 'txt'
  | 'json'
  | 'llama-index'
  | 'mdx'
  | 'pdf'
  | 'postgres'
  | 'vision'
  | 'rag'
  | 'scrape-element'
  | 'scrape-website'
  | 'website-search'
  | 'xml'
  | 'youtube-channel'
  | 'youtube-video';

export interface BaseTool {
  id: number;
  name: string;
  description: string;
  type: ToolType;
  config: any;
}

export interface DatabaseTool extends BaseTool {
  type: 'postgres';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface FileTool extends BaseTool {
  type: 'pdf' | 'csv' | 'txt' | 'json' | 'xml' | 'docx' | 'mdx';
  maxFileSize: number;
  allowedExtensions: string[];
}

export interface WebTool extends BaseTool {
  type: 'browser' | 'website-search' | 'scrape-website' | 'scrape-element' | 'firecrawl-search' | 'firecrawl-crawl' | 'firecrawl-scrape';
  Url?: string;
  headers?: string;
  timeout?: number;
}

export interface AITool extends BaseTool {
  type: 'dalle' | 'vision';
  apiKey: string;
  model: string;
  maxTokens?: number;
}


export interface RagToolConfig extends BaseTool {
  type:  'rag';
  fetchChunks : number;
  selectedFiles: string[]; // Array of selected file IDs from RAG view
}

export interface CodeTool extends BaseTool {
  type: 'code-interpreter' | 'code-docs';
  runtime?: string;
  memoryLimit?: number;
  timeout?: number;
}

export interface GitTool extends BaseTool {
  type: 'github';
  runtime?: string;
  link: string;
  timeout?: number;
}

export interface SearchTool extends BaseTool {
  type: 'youtube-channel' | 'youtube-video' | 'exa';
  apiKey?: string;
  link: string;
  searchDepth?: number;
}

export interface DirectoryTool extends BaseTool {
  type: 'directory' | 'directory-read';
  basePath: string;
  recursive: boolean;
  includePatterns?: string[];
  excludePatterns?: string[];
}

export type Tool = 
  | DatabaseTool 
  | FileTool 
  | WebTool 
  | AITool 
  |GitTool
  | RagToolConfig
  | CodeTool 
  | SearchTool 
  | DirectoryTool;