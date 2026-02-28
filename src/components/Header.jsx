import React from 'react';
import { Box, Scan, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <header className="h-16 flex items-center px-6 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl"
                >
                    <Scan className="w-5 h-5 text-white" />
                </motion.div>

                <div>
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        VisionAI <span className="text-sm font-normal text-indigo-400 opacity-80">v1.2</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">System Active</span>
                    </div>
                </div>
            </div>

            <div className="ml-auto hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    TFJS ACCELERATED
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    98.3% CONFIDENCE AVG
                </div>
            </div>
        </header>
    );
};

export default Header;
