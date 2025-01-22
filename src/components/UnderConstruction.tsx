import React from 'react';
import { Construction } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
      <Construction size={64} className="mb-4 text-purple-600" />
      <h2 className="text-2xl font-bold mb-2">Under Construction</h2>
      <p className="text-center max-w-md">
        This feature is currently being developed. Check back soon for updates!
      </p>
    </div>
  );
}