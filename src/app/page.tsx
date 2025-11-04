'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Zap, Copy, Share2, Check } from 'lucide-react';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isScratchReady, setIsScratchReady] = useState(false);
  const [scratchPaths, setScratchPaths] = useState<{x: number, y: number, id: number}[]>([]);
  const [isScratching, setIsScratching] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<{ left: string; top: string; delay: string; duration: string }[]>([]);

  // Check for shared quote in URL on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedQuote = urlParams.get('quote');
    if (sharedQuote) {
      setQuote(decodeURIComponent(sharedQuote));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Generate particle positions only on the client after mount to avoid server/client markup differences
  React.useEffect(() => {
    const p: { left: string; top: string; delay: string; duration: string }[] = [];
    for (let i = 0; i < 20; i++) {
      p.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${2 + Math.random() * 3}s`,
      });
    }
    setParticles(p);
  }, []);

  // Initialize canvas when scratch is ready
  React.useEffect(() => {
    if (isScratchReady && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      
      // Set canvas size to match container
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill canvas with gradient scratch card layer
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.95)');
        gradient.addColorStop(0.5, 'rgba(219, 39, 119, 0.95)');
        gradient.addColorStop(1, 'rgba(220, 38, 38, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isScratchReady]);

  const generateQuote = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    setIsRevealing(false);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: 'life' }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo trích dẫn');
      }

      const data = await response.json();
      
      // Set quote and prepare for scratch reveal
      setQuote(data.quote);
      setIsScratchReady(true);
      setScratchProgress(0);
      setScratchPaths([]);
      setIsScratching(false);
      setIsRevealing(false);
      
    } catch (err) {
      setError('Có lỗi xảy ra. Ngay cả thất bại của chúng tôi cũng đang thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyQuote = async () => {
    if (!quote) return;
    
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy quote:', err);
    }
  };

  const shareQuote = async () => {
    if (!quote) return;
    
    setSharing(true);
    
    try {
      const encodedQuote = encodeURIComponent(quote);
      const shareUrl = `${window.location.origin}?quote=${encodedQuote}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Câu Trích Dẫn Phản Động Lực',
            text: quote,
            url: shareUrl,
          });
        } catch (err) {
          console.log('Share cancelled or failed:', err);
          await copyToClipboard(shareUrl);
        }
      } else {
        await copyToClipboard(shareUrl);
      }
    } catch (err) {
      console.error('Failed to share quote:', err);
    } finally {
      setSharing(false);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      const notification = document.createElement('div');
      notification.textContent = 'Đã sao chép link!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(34, 197, 94, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Handle scratch/swipe interaction - realistic scratch card effect
  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratchReady || isRevealing || !isScratching) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse/touch position
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Add scratch path with unique ID for animation
    setScratchPaths(prev => [...prev, { x, y, id: Date.now() + Math.random() }]);
    
    // Remove old scratch paths after 1 second
    setTimeout(() => {
      setScratchPaths(prev => prev.slice(1));
    }, 1000);
    
    // Draw scratch effect (erase the overlay) - smaller for slower progress
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // Giảm xuống 25px để cào chậm hơn
    ctx.fill();
    
    // Increase progress slowly - 0.8% per move
    const newProgress = Math.min(scratchProgress + 0.8, 100);
    setScratchProgress(newProgress);
    
    // When scratch reaches 100%, reveal with delay
    if (newProgress >= 100 && !isRevealing) {
      setTimeout(() => {
        setIsRevealing(true);
        setIsScratchReady(false);
        setIsScratching(false);
      }, 300); // 0.3s delay for satisfaction
    }
  };

  const handleScratchStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratchReady) return;
    setIsScratching(true);
    handleScratch(e); // Start immediately
  };

  const handleScratchEnd = () => {
    setIsScratching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating particles (positions generated on client to avoid hydration mismatch) */}
      <div className="absolute inset-0 opacity-20">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-6xl mx-auto text-center z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4 sm:mb-6 tracking-tight leading-tight">
            Nhận Phản Động Lực
          </h1>
          <p className="font-sans text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Bởi vì động lực thì{' '}
            <span className="text-red-400 font-semibold">quá phổ biến rồi</span>
          </p>
        </motion.div>

        {/* Quote Display Area */}
        <div className="mb-8 sm:mb-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 mx-4 sm:mx-0 shadow-2xl">
                  <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
                    <div className="relative">
                      <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 animate-spin" />
                      <div className="absolute inset-0 w-8 h-8 sm:w-12 sm:h-12 border-2 border-blue-400/20 rounded-full animate-ping"></div>
                    </div>
                    <p className="font-sans text-white/80 text-lg sm:text-xl font-medium">Đang nghiền nát ước mơ của bạn...</p>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl border border-red-400/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mx-4 sm:mx-0 shadow-2xl">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-400 text-lg sm:text-2xl">⚠</span>
                    </div>
                  </div>
                  <p className="font-sans text-red-300 text-base sm:text-lg font-medium">{error}</p>
                </div>
              </motion.div>
            ) : quote ? (
              <motion.div
                key={quote}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="w-full"
              >
                <div ref={quoteRef} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 mx-4 sm:mx-0 shadow-2xl relative overflow-hidden">
                  
                  {/* Scratch card overlay - Interactive canvas scratch to reveal */}
                  {isScratchReady && (
                    <div className="absolute inset-0 z-20 select-none">
                      {/* Background layer with opacity based on progress */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-red-900/95 backdrop-blur-sm"
                        animate={{ opacity: 1 - (scratchProgress / 100) }}
                        transition={{ duration: 0.1 }}
                      />
                      
                      {/* Canvas for scratch effect */}
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                        style={{ touchAction: 'none' }}
                        onMouseMove={handleScratch}
                        onTouchMove={handleScratch}
                        onMouseDown={handleScratchStart}
                        onTouchStart={handleScratchStart}
                        onMouseUp={handleScratchEnd}
                        onTouchEnd={handleScratchEnd}
                        onMouseLeave={handleScratchEnd}
                      />
                      
                      {/* Scratch path visual feedback - vệt sáng */}
                      {scratchPaths.map((path) => (
                        <motion.div
                          key={path.id}
                          className="absolute w-16 h-16 rounded-full pointer-events-none"
                          style={{
                            left: path.x - 32,
                            top: path.y - 32,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
                          }}
                          initial={{ opacity: 0.8, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.5 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      ))}
                      
                      {/* Instructions overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                        <motion.div
                          animate={{ 
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            opacity: { duration: 2, repeat: Infinity }
                          }}
                          className="text-center"
                        >
                          <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2">
                            Cào để mở quà!
                          </p>
                          <p className="text-white/80 text-xs sm:text-sm">
                            Vuốt từ từ để reveal
                          </p>
                        </motion.div>
                        
                        {/* Progress indicator - realtime không làm tròn */}
                        <div className="mt-3 w-48 sm:w-64 bg-white/20 rounded-full h-3 overflow-hidden border border-white/30">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 shadow-lg"
                            style={{ width: `${scratchProgress}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          />
                        </div>
                        <motion.p 
                          className="text-white font-bold text-sm sm:text-base"
                          animate={{ scale: scratchProgress >= 100 ? [1, 1.2, 1] : 1 }}
                        >
                          {scratchProgress.toFixed(1)}% đã cào
                        </motion.p>
                      </div>
                    </div>
                  )}

                  {/* Mystery package overlay - auto revealing after scratch complete */}
                  {isRevealing && (
                    <>
                      <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }} // Tăng thời gian lên 1.2s
                        className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-red-900/95 backdrop-blur-sm z-20"
                        style={{ transformOrigin: "center" }}
                      >
                        {/* Tear effect lines */}
                        <motion.div
                          animate={{ 
                            x: -200,
                            opacity: 0
                          }}
                          transition={{ duration: 1.0, ease: "easeOut" }} // Tăng thời gian
                          className="absolute left-0 top-0 bottom-0 w-1/2 border-r-4 border-dashed border-white/40"
                        />
                        
                        <motion.div
                          animate={{ 
                            x: 200,
                            opacity: 0
                          }}
                          transition={{ duration: 1.0, ease: "easeOut" }} // Tăng thời gian
                          className="absolute right-0 top-0 bottom-0 w-1/2 border-l-4 border-dashed border-white/40"
                        />
                      </motion.div>

                      {/* Confetti particles when revealing */}
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ 
                            x: "50%", 
                            y: "50%",
                            scale: 0,
                            opacity: 1
                          }}
                          animate={{
                            x: `${50 + (Math.random() - 0.5) * 300}%`,
                            y: `${50 + (Math.random() - 0.5) * 300}%`,
                            scale: [0, 1.5, 0],
                            opacity: [1, 1, 0],
                            rotate: Math.random() * 720
                          }}
                          transition={{
                            duration: 1.5, // Tăng thời gian confetti
                            delay: i * 0.02, // Delay lâu hơn giữa các particle
                            ease: "easeOut"
                          }}
                          className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full z-30"
                          style={{
                            backgroundColor: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 6]
                          }}
                        />
                      ))}
                    </>
                  )}
                  
                  {/* Quote decoration with curved quotation marks */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/15 font-serif leading-none">"</div>
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/15 font-serif leading-none">"</div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: isRevealing ? 1 : 0, y: isRevealing ? 0 : 20, scale: isRevealing ? 1 : 0.9 }}
                    transition={{ delay: 0.8, duration: 0.8 }} // Tăng delay và duration để text hiện từ từ
                    className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-medium leading-relaxed relative z-10"
                  >
                    {quote}
                  </motion.p>
                  
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300" />
                  </div>
                  <p className="font-sans text-gray-400 text-lg sm:text-xl font-medium mb-2 px-4 text-center">Sẵn sàng phá hủy tinh thần?</p>
                  <p className="font-sans text-gray-500 text-sm sm:text-base px-4 text-center">Nhấn nút bên dưới để nhận phản động lực</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {quote && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 sm:mb-12 flex flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Button
              onClick={copyQuote}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:border-white/30 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl border"
            >
              {copied ? (
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </Button>
            
            <Button
              onClick={shareQuote}
              disabled={sharing}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:border-white/30 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 border"
            >
              {sharing ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </Button>
          </motion.div>
        )}

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 sm:mb-16"
        >
          <Button
            onClick={generateQuote}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl hover:shadow-3xl border-0 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            
            <div className="relative flex items-center gap-3">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Nhận Phản Động Lực</span>
                </>
              )}
            </div>
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-4">
            <span className="font-sans text-gray-400 text-sm">Vô Nghĩa Bởi</span>
            <a 
              href="https://github.com/Babiboyy55" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Babiboyy55
            </a>
          </div>
          <p className="font-sans text-gray-500 text-xs">Reverse-Proverbs © 2025 - Động lực quá phổ biến rồi</p>
        </motion.div>
      </div>
    </div>
  );
}
