import React, { useEffect, useState } from 'react';
import { ThesisMetadata, Chapter } from './types';
import { ThesisService } from './services/ThesisService';
import { ThesisHeader } from './components/ThesisHeader';
import { ChapterList } from './components/ChapterList';
import { CommandInput } from './components/CommandInput';
import { CommandOutput } from './components/CommandOutput';
import { Sidebar } from './components/Sidebar';

function App() {
  const [metadata, setMetadata] = useState<ThesisMetadata | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [commandOutputs, setCommandOutputs] = useState<Array<{
    id: string;
    success: boolean;
    message: string;
  }>>([]);

  useEffect(() => {
    loadThesisData();
  }, []);

  const loadThesisData = async () => {
    const thesisData = await ThesisService.getUserThesis();
    const chaptersData = await ThesisService.getChapters();
    setMetadata(thesisData);
    setChapters(chaptersData);
  };

  const handleCommandResult = (result: { success: boolean; message: string }) => {
    setCommandOutputs(prev => [...prev, { ...result, id: crypto.randomUUID() }]);
    loadThesisData();
  };

  const handleCommandSelect = (command: string) => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.value = command;
      input.focus();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 h-full">
        <Sidebar onCommandSelect={handleCommandSelect} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Thesis Manager</h1>
          <div className="mb-6">
            <CommandInput onCommandResult={handleCommandResult} />
            <div className="mt-4">
              <CommandOutput outputs={commandOutputs} />
            </div>
          </div>
          <ThesisHeader metadata={metadata} />
          <div className="mt-8">
            <ChapterList
              chapters={chapters}
              onEditChapter={() => {}}
              onDeleteChapter={() => {}}
              onReorderChapter={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;