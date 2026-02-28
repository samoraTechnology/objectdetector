import React from 'react';
import { Camera, Image as ImageIcon, Box, Activity, Layers, Bell, Shield, Users, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'detector', icon: Box, label: 'Live Detector', badge: 'Active' },
        { id: 'snapshots', icon: ImageIcon, label: 'Snapshots', badge: 'Recent' }
    ];

    const subItems = [
        { icon: Activity, label: 'Real-time Stats' },
        { icon: Bell, label: 'Alert History' }
    ];

    const adminItems = [
        { icon: Shield, label: 'Encryption' },
        { icon: Users, label: 'Session Management' },
        { icon: Database, label: 'Persistence' }
    ];

    return (
        <aside className={`h-full border-r border-white/10 bg-[#0a0a0c]/80 flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
                <div className="px-4 mb-8">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-2 mb-4">Core Vision</div>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] shadow-inner'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {isOpen && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                                </div>
                                {isOpen && item.badge && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${activeTab === item.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 mb-8">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-2 mb-4">Monitoring</div>
                    <div className="space-y-1">
                        {subItems.map((item, idx) => (
                            <button
                                key={idx}
                                className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group border border-transparent"
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110" />
                                {isOpen && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {isOpen && (
                    <div className="px-4 mb-8">
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-2 mb-4">Infrastructure</div>
                        <div className="space-y-1">
                            {adminItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full flex items-center gap-3 p-3 text-gray-400/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group border border-transparent"
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0 opacity-50" />
                                    <span className="font-medium text-sm whitespace-nowrap opacity-50">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 mt-auto">
                <div className="p-3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <span className="text-xs font-bold font-mono">JS</span>
                        </div>
                        {isOpen && (
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">Local Node</span>
                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">v4.1.2</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
