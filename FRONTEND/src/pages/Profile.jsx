import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scan, Save, User as UserIcon, Calendar, Activity, MapPin } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { ChromeButton } from '../components/ui/ChromeButton';
import ProductCard from '../components/shared/ProductCard';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateBiometrics } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  // Tabs: 'wardrobe' | 'biometrics'
  const [activeTab, setActiveTab] = useState('wardrobe');

  // If they were bounced here by the Guard, `location.state.from` holds the path they wanted
  const redirectPath = location.state?.from?.pathname + (location.state?.from?.search || '');

  // Auto-switch to biometrics tab if they were redirected here by the guard
  React.useEffect(() => {
    if (redirectPath && redirectPath !== 'undefined' && !user.biometrics?.height) {
      setActiveTab('biometrics');
    }
  }, [redirectPath, user.biometrics]);

  const [formData, setFormData] = useState({
    height: user.biometrics?.height || '',
    weight: user.biometrics?.weight || '',
    shoulderWidth: user.biometrics?.shoulderWidth || '',
    waist: user.biometrics?.waist || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBiometrics(formData);
    setIsSaved(true);

    // If they came from a guarded route (like /try-on), bounce them back there immediately upon saving
    if (redirectPath && redirectPath !== 'undefined') {
      setTimeout(() => {
         navigate(redirectPath, { replace: true });
      }, 500);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-8 pb-24 min-h-screen max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      
      {/* Left Column: User Identity Card */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 sticky top-24">
         <GlassCard className="p-8 border-chrome-600 flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-[50px] -z-10 rounded-full"></div>
            
            <div className="w-32 h-32 rounded-full border-2 border-neon-purple/50 bg-background-secondary flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(123,97,255,0.2)]">
               <UserIcon className="w-16 h-16 text-chrome-400" />
            </div>
            
            <h1 className="font-orbitron font-bold text-3xl chrome-text mb-1">
               {user.username.toUpperCase()}
            </h1>
            <p className="font-space text-neon-cyan text-sm tracking-widest uppercase mb-6">
               Level 4 Vanguard
            </p>

            <div className="w-full flex flex-col gap-3 font-space text-sm text-chrome-300">
               <div className="flex justify-between border-b border-chrome-800 pb-2">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-chrome-500" /> Joined</span>
                  <span className="text-chrome-100">MAR 2026</span>
               </div>
               <div className="flex justify-between border-b border-chrome-800 pb-2">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-chrome-500" /> Location</span>
                  <span className="text-chrome-100">Sector 7G</span>
               </div>
               <div className="flex justify-between pb-2">
                  <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-chrome-500" /> Bio Status</span>
                  {user.biometrics ? (
                     <span className="text-neon-cyan font-bold">CALIBRATED</span>
                  ) : (
                     <span className="text-neon-pink font-bold">MISSING</span>
                  )}
               </div>
            </div>
         </GlassCard>
      </div>

      {/* Right Column: Content Area (Tabs) */}
      <div className="w-full md:w-2/3 flex flex-col">
         
         {/* Warning Banner if Redirected by Guard */}
         {redirectPath && redirectPath !== 'undefined' && !user.biometrics?.height && (
            <div className="mb-6 p-4 border border-neon-pink/50 bg-neon-pink/10 rounded-lg flex items-center justify-center">
               <p className="font-space text-neon-pink font-semibold text-center">
                  BIOMETRIC DATA REQUIRED BEFORE PROCEEDING TO VIRTUAL TRY-ON
               </p>
            </div>
         )}

         {/* Tab Navigation */}
         <div className="flex border-b border-chrome-700 mb-8">
            <button 
               onClick={() => setActiveTab('wardrobe')}
               className={`flex-1 font-orbitron text-lg py-4 transition-all duration-300 ${
                  activeTab === 'wardrobe' 
                     ? 'text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/5' 
                     : 'text-chrome-400 hover:text-chrome-200 hover:bg-white/5'
               }`}
            >
               <Save className="w-5 h-5 inline-block mr-2" />
               WARDROBE
            </button>
            <button 
               onClick={() => setActiveTab('biometrics')}
               className={`flex-1 font-orbitron text-lg py-4 transition-all duration-300 ${
                  activeTab === 'biometrics' 
                     ? 'text-neon-purple border-b-2 border-neon-purple bg-neon-purple/5' 
                     : 'text-chrome-400 hover:text-chrome-200 hover:bg-white/5'
               }`}
            >
               <Scan className="w-5 h-5 inline-block mr-2" />
               BIOMETRICS
            </button>
         </div>

         {/* Tab Content */}
         <div className="w-full">
            
            {/* WARDROBE TAB */}
            {activeTab === 'wardrobe' && (
               <div className="animate-fade-in">
                  <div className="flex justify-between items-end mb-6">
                     <h2 className="font-orbitron text-xl text-chrome-100">SAVED VECTORS</h2>
                     <span className="font-space text-xs text-chrome-400">{user.savedOutfits.length} ITEMS</span>
                  </div>
                  
                  {user.savedOutfits && user.savedOutfits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                      {user.savedOutfits.map((product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                     <div className="text-center bg-background-secondary/30 rounded-xl border border-chrome-600 border-dashed p-16">
                       <Save className="w-12 h-12 text-chrome-600 mx-auto mb-4" />
                       <p className="font-space text-chrome-300 text-lg mb-2">Wardrobe Empty</p>
                       <p className="font-space text-chrome-500 text-sm max-w-sm mx-auto">
                         Explore the network and save style vectors to build your personal collection.
                       </p>
                       <ChromeButton onClick={() => navigate('/community')} className="mt-6 px-8">
                         BROWSE COMMUNITY
                       </ChromeButton>
                     </div>
                  )}
               </div>
            )}

            {/* BIOMETRICS TAB */}
            {activeTab === 'biometrics' && (
               <GlassCard className="w-full p-8 border-neon-purple/30 shadow-[0_0_20px_rgba(123,97,255,0.1)] animate-fade-in">
                  <h2 className="font-orbitron text-xl mb-2 text-chrome-100 uppercase">Input Vector Variables</h2>
                  <p className="font-space text-sm text-chrome-400 mb-8">Maintain your physical parameters to ensure maximum fit accuracy in the Virtual Mirror.</p>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                         <label className="font-space text-xs text-neon-purple uppercase tracking-wider">Height (cm)</label>
                         <input type="number" name="height" value={formData.height} onChange={handleChange} required
                            className="bg-background-secondary border border-chrome-600 rounded-md p-3 text-chrome-100 focus:outline-none focus:border-neon-purple transition-colors" />
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="font-space text-xs text-neon-purple uppercase tracking-wider">Weight (kg)</label>
                         <input type="number" name="weight" value={formData.weight} onChange={handleChange} required
                            className="bg-background-secondary border border-chrome-600 rounded-md p-3 text-chrome-100 focus:outline-none focus:border-neon-purple transition-colors" />
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="font-space text-xs text-neon-purple uppercase tracking-wider">Shoulder Width (cm)</label>
                         <input type="number" name="shoulderWidth" value={formData.shoulderWidth} onChange={handleChange} required
                            className="bg-background-secondary border border-chrome-600 rounded-md p-3 text-chrome-100 focus:outline-none focus:border-neon-purple transition-colors" />
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="font-space text-xs text-neon-purple uppercase tracking-wider">Waist (cm)</label>
                         <input type="number" name="waist" value={formData.waist} onChange={handleChange} required
                            className="bg-background-secondary border border-chrome-600 rounded-md p-3 text-chrome-100 focus:outline-none focus:border-neon-purple transition-colors" />
                       </div>
                     </div>
                     
                     <ChromeButton type="submit" className="mt-4 flex items-center justify-center gap-2 py-4">
                        {isSaved ? <span className="text-green-400">STATE SAVED</span> : <><Save className="w-5 h-5" /> UPDATE VECTOR</>}
                     </ChromeButton>

                     {isSaved && redirectPath && redirectPath !== 'undefined' && (
                        <p className="font-space text-sm text-center text-chrome-400 mt-2 animate-pulse">
                           Redirecting to smart mirror...
                        </p>
                     )}
                  </form>
               </GlassCard>
            )}

         </div>
      </div>
    </div>
  );
};

export default Profile;
