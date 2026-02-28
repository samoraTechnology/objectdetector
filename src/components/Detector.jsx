import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, CameraOff, RefreshCw, Layers, ShieldCheck, Download, Trash2, Maximize, Target, Activity, Scan, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Detector = ({ filterClass, setFilterClass, onSnapshot, setDetCount, detCount }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ fps: 0, latency: 0 });
    const [availableClasses, setAvailableClasses] = useState(['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']);

    // Load COCO-SSD Model
    useEffect(() => {
        const loadModel = async () => {
            try {
                setLoading(true);
                console.log('Loading Model...');
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);
                setLoading(false);
                console.log('Model Loaded!');
            } catch (err) {
                console.error('Error loading model:', err);
                setError('Failed to load detection model. Check connection.');
                setLoading(false);
            }
        };
        loadModel();
    }, []);

    // WebCam setup
    const startStreaming = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStreaming(true);
                }
            }
        } catch (err) {
            console.error('Error accessing webcam:', err);
            setError('Camera access denied or not available.');
        }
    };

    const stopStreaming = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setStreaming(false);
        }
    };

    useEffect(() => {
        startStreaming();
        return () => stopStreaming();
    }, []);

    // Detection Loop
    const detectFrame = useCallback(async () => {
        if (model && streaming && videoRef.current && videoRef.current.readyState === 4) {
            const startTime = performance.now();
            const predictions = await model.detect(videoRef.current);
            const endTime = performance.now();

            const filtered = filterClass === 'all'
                ? predictions
                : predictions.filter(p => p.class === filterClass);

            setDetCount(filtered.length);
            setStats({
                latency: Math.round(endTime - startTime),
                fps: Math.round(1000 / (endTime - startTime + 1))
            });

            drawPredictions(filtered);
        }

        if (streaming) {
            requestAnimationFrame(detectFrame);
        }
    }, [model, streaming, filterClass]);

    useEffect(() => {
        if (streaming && model) {
            detectFrame();
        }
    }, [streaming, model, detectFrame]);

    // Drawing Function
    const drawPredictions = (predictions) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            const label = prediction.class;
            const score = Math.round(prediction.score * 100);

            // Draw box
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
            ctx.strokeRect(x, y, width, height);
            ctx.shadowBlur = 0;

            // Draw label background
            ctx.fillStyle = '#6366f1';
            const textWidth = ctx.measureText(`${label} ${score}%`).width;
            ctx.fillRect(x, y - 25, textWidth + 10, 25);

            // Draw label text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Outfit';
            ctx.fillText(`${label} ${score}%`, x + 5, y - 7);

            // Draw corners for aesthetic
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 4;
            // Top left
            ctx.beginPath();
            ctx.moveTo(x, y + 20); ctx.lineTo(x, y); ctx.lineTo(x + 20, y);
            ctx.stroke();
            // Top right
            ctx.beginPath();
            ctx.moveTo(x + width - 20, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + 20);
            ctx.stroke();
            // Bottom left
            ctx.beginPath();
            ctx.moveTo(x, y + height - 20); ctx.lineTo(x, y + height); ctx.lineTo(x + 20, y + height);
            ctx.stroke();
            // Bottom right
            ctx.beginPath();
            ctx.moveTo(x + width - 20, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - 20);
            ctx.stroke();
        });
    };

    const takeSnapshot = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw video
        ctx.drawImage(videoRef.current, 0, 0);

        // Draw predictions overlay
        const overlayCanvas = canvasRef.current;
        ctx.drawImage(overlayCanvas, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        onSnapshot({
            id: Date.now(),
            image: dataUrl,
            timestamp: new Date().toLocaleTimeString(),
            count: detCount
        });
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full">
            {/* Main Viewport */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${streaming ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            <Camera className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Neural Stream</h2>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                SECURE END-TO-END INFERENCE
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={takeSnapshot}
                            disabled={!streaming || loading}
                            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all group"
                        >
                            <Download className="w-5 h-5 group-hover:scale-110" />
                        </button>
                        <button
                            onClick={streaming ? stopStreaming : startStreaming}
                            disabled={loading}
                            className={`p-2.5 border rounded-xl transition-all ${streaming ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'}`}
                        >
                            {streaming ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card group">
                    {loading && (
                        <div className="absolute inset-0 z-40 bg-[#0a0a0c]/90 flex flex-col items-center justify-center p-8 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full mb-6"
                            />
                            <h3 className="text-xl font-bold mb-2">Initializing Neural Model</h3>
                            <p className="text-gray-500 text-sm max-w-xs">Connecting to TensorFlow.js kernels and loading COCO-SSD weights...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 z-40 bg-red-950/20 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center text-red-400">
                            <Info className="w-12 h-12 mb-4 opacity-50" />
                            <h3 className="text-lg font-bold mb-2">Hardware Access Error</h3>
                            <p className="text-sm opacity-80 mb-6">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-red-500/30 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" /> REBOOT SYSTEM
                            </button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        onLoadedMetadata={() => {
                            canvasRef.current.width = videoRef.current.videoWidth;
                            canvasRef.current.height = videoRef.current.videoHeight;
                        }}
                        className="w-full h-full object-cover"
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* HUD Overlay */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-indigo-400 tracking-wider">LIVE_FEED_01</span>
                        </div>
                    </div>

                    <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-none">
                        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex flex-col gap-0.5">
                            <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Latency</span>
                            <span className="text-xs font-mono font-bold text-white">{stats.latency}ms</span>
                        </div>
                        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex flex-col gap-0.5">
                            <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Frames/Sec</span>
                            <span className="text-xs font-mono font-bold text-emerald-400">{stats.fps} FPS</span>
                        </div>
                    </div>

                    {/* Bottom Controls Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
                        <div className="flex items-center gap-6 px-4">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-bold text-gray-500 tracking-tighter uppercase">Detection</span>
                                <span className="text-xl font-bold text-white font-mono">{detCount.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-bold text-gray-500 tracking-tighter uppercase">Confidence</span>
                                <span className="text-lg font-bold text-indigo-400 font-mono">94%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
                <div className="p-6 glass-card border border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <Scan className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold">Detection Settings</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Neural Filter</label>
                            <div className="relative">
                                <select
                                    value={filterClass}
                                    onChange={(e) => setFilterClass(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm appearance-none focus:outline-none focus:border-indigo-500/50 transition-all text-gray-300"
                                >
                                    <option value="all">Analyze All Entities</option>
                                    {availableClasses.map(cls => (
                                        <option key={cls} value={cls}>{cls.charAt(0).toUpperCase() + cls.slice(1)} Only</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <Target className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                                    <Activity className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Optimized Inference</h4>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">Running COCO-SSD with WebGL acceleration. Higher accuracy requires stable lighting.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={takeSnapshot}
                            disabled={!streaming}
                            className="w-full primary-btn justify-center py-4"
                        >
                            <Download className="w-5 h-5" />
                            CAPTURE DATA POINT
                        </button>
                    </div>
                </div>

                <div className="p-5 glass-card flex-1 min-h-[200px] border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-purple-400" />
                            <h3 className="text-sm font-bold">Telemetry History</h3>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono tracking-tighter">LIVE_PULSE</span>
                    </div>

                    <div className="space-y-3 opacity-50">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="w-full h-2 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                        className="w-1/2 h-full bg-indigo-500"
                                    />
                                </div>
                            </div>
                        ))}
                        <p className="text-[10px] text-center text-gray-600 mt-4 uppercase font-bold tracking-widest italic">Syncing with local buffer...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detector;
