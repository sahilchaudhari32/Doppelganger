import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, User, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="pt-24 px-8 min-h-screen pb-12 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="font-orbitron text-4xl md:text-5xl mb-4 chrome-text">WELCOME, {user.username.toUpperCase()}</h1>
        <p className="font-space text-chrome-400 max-w-2xl mx-auto">
          Your personal StyleForge hub. Create new aesthetic vectors, or explore designs published by the network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Create Hub */}
        <div 
          onClick={() => navigate('/analyze')}
          className="group cursor-pointer relative"
        >
          <div className="absolute inset-0 bg-neon-cyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <GlassCard className="h-full flex flex-col items-center text-center p-12 border-chrome-600 hover:border-neon-cyan transition-all duration-300 relative z-10">
            <div className="w-24 h-24 rounded-full bg-background-secondary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-shadow duration-500">
              <Sparkles className="w-12 h-12 text-neon-cyan" />
            </div>
            <h2 className="font-orbitron text-3xl mb-4 text-chrome-100">CREATE DESIGN</h2>
            <p className="font-space text-chrome-400 mb-8 flex-1">
              Upload past purchases or style inspirations to generate a completely new custom aesthetic vector.
            </p>
            <div className="flex items-center text-neon-cyan font-orbitron group-hover:translate-x-2 transition-transform duration-300">
              INITIALIZE <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </GlassCard>
        </div>

        {/* Community Hub */}
        <div 
          onClick={() => navigate('/community')}
          className="group cursor-pointer relative"
        >
          <div className="absolute inset-0 bg-neon-purple/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <GlassCard className="h-full flex flex-col items-center text-center p-12 border-chrome-600 hover:border-neon-purple transition-all duration-300 relative z-10">
            <div className="w-24 h-24 rounded-full bg-background-secondary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(123,97,255,0.2)] group-hover:shadow-[0_0_50px_rgba(123,97,255,0.6)] transition-shadow duration-500">
               <Users className="w-12 h-12 text-neon-purple" />
            </div>
            <h2 className="font-orbitron text-3xl mb-4 text-chrome-100">EXPLORE COMMUNITY</h2>
            <p className="font-space text-chrome-400 mb-8 flex-1">
              Discover style vectors published by other users. Save them to your wardrobe or virtually try them on.
            </p>
            <div className="flex items-center text-neon-purple font-orbitron group-hover:translate-x-2 transition-transform duration-300">
              ACCESS NETWORK <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Profile Status */}
      <div 
         onClick={() => navigate('/profile')}
         className="mt-16 flex items-center gap-4 bg-background-secondary/50 border border-chrome-600 rounded-full px-8 py-4 cursor-pointer hover:bg-chrome-700/50 transition-colors"
      >
         <User className="w-6 h-6 text-chrome-300" />
         <div className="font-space text-sm">
            <span className="text-chrome-400">BIOMETRIC PROFILE: </span>
            {user.biometrics ? (
              <span className="text-neon-cyan font-bold">CALIBRATED</span>
            ) : (
              <span className="text-neon-pink font-bold">INCOMPLETE (Required for Try-On)</span>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
