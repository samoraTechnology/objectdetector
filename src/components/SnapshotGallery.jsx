import React from 'react';
import { ImageIcon, Download, Trash2, Camera, Calendar, Clock, Info, ExternalLink, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SnapshotGallery = ({ snapshots, onClear }) => {
    const downloadImage = (dataUrl, id) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `vision-ai-snapshot-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 rounded-2xl border border-purple-500/20">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Repository</h2>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 uppercase tracking-widest font-bold">
                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                            SECURE LOCAL CACHE &middot; {snapshots.length} DATAPOINTS
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClear}
                    disabled={snapshots.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <Trash2 className="w-4 h-4 group-hover:scale-110" />
                    CLEAR DATABASE
                </button>
            </div>

            <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {snapshots.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {snapshots.map((snap, index) => (
                                <motion.div
                                    key={snap.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                    className="group relative"
                                >
                                    <div className="glass-card overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-indigo-500/10">
                                        <div className="relative aspect-video overflow-hidden group">
                                            <img
                                                src={snap.image}
                                                alt="detection snapshot"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-60"></div>

                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                                                <Clock className="w-3 h-3 text-indigo-400" />
                                                <span className="text-[10px] text-white font-bold">{snap.timestamp}</span>
                                            </div>

                                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="p-2 bg-indigo-500 rounded-lg text-white font-bold text-[10px] flex items-center gap-2">
                                                    <Activity className="w-3 h-3" />
                                                    {snap.count} ENTITIES DETECTED
                                                </div>
                                                <button
                                                    onClick={() => downloadImage(snap.image, snap.id)}
                                                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white transition-all transform hover:scale-110"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/5 rounded-[40px]"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                <div className="relative p-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full border border-white/5">
                                    <Camera className="w-16 h-16 text-indigo-400/30 opacity-40 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 tracking-tight">No Snapshot Records Found</h3>
                            <p className="text-gray-500 max-w-sm text-center leading-relaxed">System is currently in monitoring mode. Detected frames will appear here once captured from the Live Detector.</p>
                            <div className="mt-8 flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                <div className="w-8 h-[1px] bg-white/5"></div>
                                STANDBY MODE
                                <div className="w-8 h-[1px] bg-white/5"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SnapshotGallery;
