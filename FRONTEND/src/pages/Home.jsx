import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Scan, Shirt, LayoutGrid, ArrowRight } from 'lucide-react';
import { ChromeButton } from '../components/ui/ChromeButton';
import { GlassCard } from '../components/ui/GlassCard';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-24 overflow-hidden relative">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-pink/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>

      {/* Hero Section */}
      <div className="pt-32 px-8 flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-8 backdrop-blur-md">
           <Sparkles className="w-4 h-4 text-neon-cyan" />
           <span className="font-space font-semibold text-xs text-neon-cyan tracking-widest uppercase">StyleForge Engine v2.0 Online</span>
        </div>
        
        <h1 className="font-orbitron font-black text-6xl md:text-8xl mb-6 chrome-text leading-[1.1] tracking-tight">
          FORGE YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">DIGITAL</span> AESTHETIC
        </h1>
        
        <p className="font-space text-chrome-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          The ultimate cyber-wardrobe network. Analyze your past purchases, generate physical coordinate vectors, and virtually try on user-published styles in a fully immersive 3D mirror.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <ChromeButton 
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 text-sm md:text-base flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            INITIALIZE HUB <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </ChromeButton>
          <button 
            onClick={() => navigate('/community')}
            className="px-10 py-4 text-sm md:text-base flex items-center justify-center gap-2 font-orbitron tracking-widest uppercase rounded-md border border-chrome-600 bg-background-secondary/50 text-chrome-100 hover:border-neon-purple hover:bg-neon-purple/10 hover:text-neon-purple transition-all duration-300 backdrop-blur-md w-full sm:w-auto"
          >
            EXPLORE NETWORK
          </button>
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="mt-32 w-full max-w-7xl px-8 z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
         
         <GlassCard className="flex flex-col items-start p-8 border-neon-cyan/20 hover:border-neon-cyan/50 hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-6 text-neon-cyan group-hover:bg-neon-cyan group-hover:text-black transition-colors duration-500 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
               <Scan className="w-7 h-7" />
            </div>
            <h3 className="font-orbitron text-xl text-chrome-100 mb-3">AI STYLE GENERATION</h3>
            <p className="font-space text-sm text-chrome-400 leading-relaxed">
               Upload inspiration photos and let our neural network extract the core aesthetic embeddings to forge highly personalized outfit recommendations.
            </p>
         </GlassCard>

         <GlassCard className="flex flex-col items-start p-8 border-neon-purple/20 hover:border-neon-purple/50 hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-14 h-14 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center mb-6 text-neon-purple group-hover:bg-neon-purple group-hover:text-white transition-colors duration-500 shadow-[0_0_15px_rgba(123,97,255,0.2)]">
               <LayoutGrid className="w-7 h-7" />
            </div>
            <h3 className="font-orbitron text-xl text-chrome-100 mb-3">SOCIAL WARDROBE</h3>
            <p className="font-space text-sm text-chrome-400 leading-relaxed">
               Tap into the public feed. Discover, save, and curate style vectors published by other users across the global network into your private collection.
            </p>
         </GlassCard>

         <GlassCard className="flex flex-col items-start p-8 border-neon-pink/20 hover:border-neon-pink/50 hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-14 h-14 rounded-xl bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center mb-6 text-neon-pink group-hover:bg-neon-pink group-hover:text-white transition-colors duration-500 shadow-[0_0_15px_rgba(255,46,166,0.2)]">
               <Shirt className="w-7 h-7" />
            </div>
            <h3 className="font-orbitron text-xl text-chrome-100 mb-3">SMART MIRROR TRY-ON</h3>
            <p className="font-space text-sm text-chrome-400 leading-relaxed">
               Input your biometric vector data to unlock immersive Virtual Try-On. See how any community outfit looks applied directly to your physical dimensions.
            </p>
         </GlassCard>

      </div>
    </div>
  );
};

export default Home;
