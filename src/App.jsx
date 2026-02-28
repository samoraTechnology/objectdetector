import React, { useState, useEffect } from 'react';
import { Camera, Layers, Box, Info, Image as ImageIcon, Download, Settings, RefreshCw, Layers3, Activity } from 'lucide-react';
import Detector from './components/Detector';
import SnapshotGallery from './components/SnapshotGallery';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [filterClass, setFilterClass] = useState('all');
  const [snapshots, setSnapshots] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('detector');
  const [detCount, setDetCount] = useState(0);

  const addSnapshot = (image) => {
    setSnapshots([image, ...snapshots].slice(0, 10)); // Limit to 10
  };

  const handleClearSnapshots = () => {
    setSnapshots([]);
  };

  return (
    <div className="app-container min-h-screen flex flex-col overflow-hidden bg-[#0a0a0c]">
      <Header />
      
      <main className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <div className="flex-1 overflow-auto relative p-4 lg:p-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'detector' && (
              <motion.div 
                key="detector"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col lg:flex-row gap-6"
              >
                <Detector 
                  filterClass={filterClass} 
                  setFilterClass={setFilterClass} 
                  onSnapshot={addSnapshot}
                  setDetCount={setDetCount}
                  detCount={detCount}
                />
              </motion.div>
            )}

            {activeTab === 'snapshots' && (
              <motion.div 
                key="snapshots"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full h-full"
              >
                <SnapshotGallery 
                  snapshots={snapshots} 
                  onClear={handleClearSnapshots} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative BG elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[120px]"></div>
      </div>
    </div>
  );
}

export default App;
