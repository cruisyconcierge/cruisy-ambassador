import React, { useState, useEffect } from 'react';
import { 
  Layout, Link as LinkIcon, DollarSign, LogOut, Copy, Check, Globe, MapPin, 
  Image as ImageIcon, Search, RefreshCw, Server, ExternalLink, Edit3, Calendar, 
  Anchor, Home, Crown, BookOpen, PlayCircle, Lock, Zap, Palmtree, Info, 
  XCircle, ArrowRight, ArrowLeft, Camera, PenTool, Plus, Trash2, FileText, Loader2
} from 'lucide-react';

// Import API functions
import { 
  loginUser, 
  getUserProfile, 
  updateAmbassadorProfile, 
  searchItineraries, 
  getMyPosts, 
  createBlogPost, 
  deleteBlogPost 
} from './lib/api';

// --- Brand Styling ---
const BrandStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Russo+One&display=swap');
    
    :root {
      --brand-teal: #34a4b8;
      --brand-teal-light: #e0f4f7;
      --brand-teal-dark: #268191;
      --brand-gold: #fbbf24;
    }
    
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f0f9fa;
      overflow-x: hidden; 
    }
    
    h1, h2, h3, h4, h5, h6, .font-russo {
      font-family: 'Russo One', sans-serif;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #34a4b8; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .gold-gradient {
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    }
  `}</style>
);

const TRAINING_MODULES = [
  { id: 1, title: 'Ambassador Quick Start Guide', duration: '15 min', type: 'free', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300' },
  { id: 2, title: 'Maximizing Hotel Commissions', duration: '10 min', type: 'free', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300' },
  { id: 3, title: 'Advanced SEO for Travel Blogs', duration: '45 min', type: 'pro', image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=300' },
  { id: 4, title: 'Mastering TikTok for Travel Sales', duration: '30 min', type: 'pro', image: 'https://images.unsplash.com/photo-1611605698383-ef78b6578277?auto=format&fit=crop&q=80&w=300' },
];

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check session on load
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('cruisy_auth_token');
      if (token) {
        try {
          const profile = await getUserProfile(token);
          formatAndSetUser(profile, token);
        } catch (err) {
          handleLogout();
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const formatAndSetUser = (wpUser, token) => {
    const acf = wpUser.acf || {};
    // Ensure arrays exist
    const activities = Array.isArray(acf.featured_itineraries) ? acf.featured_itineraries : [];
    const gallery = Array.isArray(acf.travel_gallery) ? acf.travel_gallery : [];

    setUser({
      id: wpUser.id,
      name: wpUser.name,
      email: wpUser.email,
      slug: wpUser.slug,
      bio: acf.bio || '',
      plan: acf.membership_tier || 'free',
      featuredActivities: activities,
      gallery: gallery,
      token: token
    });
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const auth = await loginUser(credentials.email, credentials.password);
      if (!auth.token) throw new Error('Invalid login response');
      
      const profile = await getUserProfile(auth.token);
      localStorage.setItem('cruisy_auth_token', auth.token);
      formatAndSetUser(profile, auth.token);
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cruisy_auth_token');
    setUser(null);
    setActiveTab('overview');
    setError('');
  };

  const handleUpdateUser = async (updates) => {
    // Optimistic UI update
    const oldUser = { ...user };
    const newUser = { ...user, ...updates };
    setUser(newUser);

    try {
      await updateAmbassadorProfile(user.id, user.token, newUser);
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save changes to WordPress. Please try again.");
      setUser(oldUser); // Revert
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0f9fa] text-[#34a4b8]"><Loader2 className="animate-spin w-8 h-8" /></div>;

  if (!user) return <><BrandStyles /><AuthPage onLogin={handleLogin} error={error} loading={loading} /></>;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <Layout size={20} /> },
    { id: 'profile', label: 'Edit Page', icon: <Edit3 size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <Camera size={20} /> },
    { id: 'blog', label: 'My Blog', icon: <PenTool size={20} /> },
    { id: 'academy', label: 'Academy', icon: <BookOpen size={20} /> },
    { id: 'membership', label: 'Upgrade', icon: <Crown size={20} />, highlight: user.plan === 'free' },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
  ];

  return (
    <>
      <BrandStyles />
      <div className="relative min-h-screen bg-gradient-to-br from-[#f0f9fa] via-[#e6f7ff] to-[#fff7ed] flex font-sans text-slate-700 selection:bg-[#34a4b8] selection:text-white">
        
        {/* Background Blobs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#34a4b8] opacity-[0.03] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-300 opacity-[0.05] rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-[#34a4b8]/20 hidden md:flex flex-col fixed h-full z-20 shadow-lg shadow-[#34a4b8]/5">
          <div className="p-6 flex flex-col items-center border-b border-slate-100/50">
            <img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" alt="Cruisy" className="h-12 w-auto mb-2 object-contain" />
            <p className="text-[10px] text-[#34a4b8] font-bold uppercase tracking-widest font-russo">Ambassador Portal</p>
            <a href="https://cruisytravel.com" className="text-xs text-slate-400 hover:text-[#34a4b8] mt-2 flex items-center gap-1 transition-colors" target="_blank" rel="noopener noreferrer">
              <ArrowLeft size={10} /> Back to Main Site
            </a>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <DesktopNavItem key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} highlight={item.highlight} onClick={() => setActiveTab(item.id)} />
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className={`rounded-xl p-4 mb-2 flex items-center gap-3 border ${user.plan === 'pro' ? 'bg-amber-50 border-amber-200' : 'bg-[#e0f4f7] border-[#34a4b8]/20'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-russo ${user.plan === 'pro' ? 'gold-gradient text-white shadow-md' : 'bg-white border-2 border-[#34a4b8] text-[#34a4b8]'}`}>
                {user.plan === 'pro' ? <Crown size={16} /> : user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className={`text-[10px] uppercase font-bold truncate ${user.plan === 'pro' ? 'text-amber-600' : 'text-[#34a4b8]'}`}>
                  {user.plan === 'pro' ? 'Elite Member' : 'Standard'}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-slate-400 hover:text-[#34a4b8] p-2 text-sm font-bold transition-colors w-full uppercase tracking-wider">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen relative pb-24 md:pb-8 w-full max-w-full z-10">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-[#34a4b8]/20 sticky top-4 z-30">
            <a href="https://cruisytravel.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" alt="Cruisy" className="h-8 w-auto" />
            </a>
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-russo ${user.plan === 'pro' ? 'gold-gradient text-white' : 'bg-[#34a4b8] text-white'}`}>
                    {user.plan === 'pro' ? <Crown size={14} /> : user.name.charAt(0)}
                </div>
                <button onClick={handleLogout} className="text-slate-400 p-1"><LogOut size={20} /></button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto w-full">
            {activeTab === 'overview' && <Overview user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && <ProfileEditor user={user} updateUser={handleUpdateUser} />}
            {activeTab === 'gallery' && <Gallery user={user} updateUser={handleUpdateUser} />}
            {activeTab === 'blog' && <BlogManager user={user} />}
            {activeTab === 'academy' && <Academy user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'membership' && <Membership user={user} updateUser={handleUpdateUser} />}
            {activeTab === 'earnings' && <Earnings user={user} />}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
            {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all active:scale-95 ${activeTab === item.id ? (item.highlight ? 'text-amber-500' : 'text-[#34a4b8]') : 'text-slate-400 hover:text-slate-600'}`}>
                    <div className={`p-1.5 rounded-xl mb-1 transition-all ${activeTab === item.id ? (item.highlight ? 'bg-amber-50' : 'bg-[#e0f4f7]') : 'bg-transparent'}`}>{item.icon}</div>
                    <span className={`text-[10px] font-bold leading-none ${activeTab === item.id ? (item.highlight ? 'text-amber-500' : 'text-[#34a4b8]') : 'text-slate-400'}`}>{item.label}</span>
                </button>
            ))}
        </div>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

function Overview({ user, setActiveTab }) {
  const [copied, setCopied] = useState(false);
  const mainLink = `https://cruisytravel.com/ambassador/${user.slug}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-russo text-slate-800">Aloha, {user.name.split(' ')[0]}! 🌴</h2>
          <p className="text-slate-500 font-medium">Your ambassador profile is live.</p>
        </div>
        {user.plan === 'free' && (
           <button onClick={() => setActiveTab('membership')} className="hidden md:flex bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 transition-colors animate-pulse">
             <Zap size={16} className="fill-amber-800" /> Boost Your Commission
           </button>
        )}
      </div>

      <div className={`rounded-3xl p-1 shadow-xl relative border ${user.plan === 'pro' ? 'border-amber-200 shadow-amber-500/10' : 'border-[#34a4b8]/20 shadow-[#34a4b8]/10 bg-white'}`}>
        <div className={`rounded-[1.3rem] p-6 text-white relative overflow-hidden ${user.plan === 'pro' ? 'gold-gradient' : 'bg-gradient-to-r from-[#34a4b8] to-[#2db5cc]'}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10 w-full">
            <div className="flex-1 min-w-0 w-full"> 
              <h3 className="font-russo text-xl md:text-2xl mb-2 flex items-center gap-2">
                Your Public Profile Page {user.plan === 'pro' && <Crown size={24} className="text-white fill-white" />}
              </h3>
              <p className="text-white/80 mb-6 font-medium text-sm md:text-base max-w-lg">This link goes to your Divi profile page.</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/20 backdrop-blur-md p-2 pl-4 rounded-xl border border-white/20 w-full">
                <Globe size={18} className="text-white shrink-0 hidden sm:block" />
                <code className="text-white font-bold font-mono text-xs md:text-sm flex-1 truncate">{mainLink}</code>
                <button onClick={() => { navigator.clipboard.writeText(mainLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`px-5 py-3 md:py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap ${user.plan === 'pro' ? 'bg-white text-amber-600 hover:bg-amber-50' : 'bg-white text-[#34a4b8] hover:bg-cyan-50'}`}>
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 text-center w-full md:w-auto shrink-0 min-w-[150px]">
              <p className="text-white/80 text-xs uppercase font-bold tracking-wider mb-1">Commission Rates</p>
              <div className="flex flex-col gap-1">
                 <div className="flex justify-between text-sm"><span className="text-white/80">Activities</span><span className="font-bold">10-12%</span></div>
                 <div className="flex justify-between text-sm"><span className="text-white/80">Stays/Cruises</span><span className="font-bold">Up to 5%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({ user, updateUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('details'); 
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          const data = await searchItineraries(searchTerm);
          setResults(data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const toggleActivity = (activity) => {
    const current = user.featuredActivities || [];
    const exists = current.find(a => a.id === activity.id);
    let updated;
    if (exists) {
      updated = current.filter(a => a.id !== activity.id);
    } else {
      updated = [...current, activity];
    }
    updateUser({ featuredActivities: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white border-l-4 border-[#34a4b8] p-4 rounded-r-xl shadow-sm flex gap-4 text-sm"><Server className="text-[#34a4b8] shrink-0" size={24} /><div><h4 className="font-bold text-slate-800">WordPress Sync</h4><p className="text-slate-500 mt-1">Updates here sync directly to your Cruisy Ambassador Page.</p></div></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">Edit Page</h2><p className="text-slate-500">Manage your bio and featured activities.</p></div>
        <div className="bg-white border border-slate-200 p-1 rounded-xl flex w-full md:w-auto shadow-sm">
           <button onClick={() => setActiveTab('details')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeTab === 'details' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Profile Info</button>
           <button onClick={() => setActiveTab('activities')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeTab === 'activities' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Select Experiences</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'details' ? (
             <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100"><div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg text-slate-400 overflow-hidden relative group cursor-pointer shrink-0"><ImageIcon size={32} /></div><div className="text-center sm:text-left"><h4 className="font-russo text-lg text-slate-800">Featured Image</h4><p className="text-sm text-slate-500 mb-2">Main photo used in the Header.</p><button className="text-xs bg-[#e0f4f7] text-[#268191] font-bold px-3 py-1.5 rounded-lg">Upload New</button></div></div>
                <div className="space-y-4"><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Profile Name</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none font-medium min-w-0" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} /></div><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Bio (About You)</label><textarea rows="6" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none min-w-0" value={user.bio} onChange={(e) => updateUser({ bio: e.target.value })}></textarea></div></div>
                <div className="flex justify-end"><button onClick={() => updateUser({})} className="bg-[#34a4b8] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#268191]">SAVE CHANGES</button></div>
             </div>
          ) : (
             <div className="space-y-4">
               <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search experiences..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#34a4b8] outline-none min-w-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
               {isSearching && <div className="text-center py-4 text-slate-400"><Loader2 className="animate-spin w-6 h-6 mx-auto mb-2" />Searching WordPress...</div>}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {user.featuredActivities.map(activity => (
                    <div key={activity.id} onClick={() => toggleActivity(activity)} className="group cursor-pointer rounded-2xl border border-[#34a4b8] ring-2 ring-[#34a4b8] ring-offset-2 bg-white overflow-hidden transition-all hover:shadow-lg flex sm:block">
                       <div className="h-24 w-24 sm:w-full sm:h-32 bg-slate-200 relative shrink-0"><img src={activity.image || 'https://placehold.co/400x300?text=No+Image'} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-[#34a4b8]/80 flex items-center justify-center"><Check className="text-white w-6 h-6 sm:w-8 sm:h-8" /></div></div>
                       <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0"><h4 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1 truncate">{activity.title}</h4><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 sm:mt-2"><span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10}/> {activity.location || 'Unknown'}</span><span className="font-bold text-[#34a4b8] text-sm mt-1 sm:mt-0">${activity.price || 0}</span></div></div>
                    </div>
                 ))}
                 {results.filter(r => !user.featuredActivities.find(f => f.id === r.id)).map(activity => (
                    <div key={activity.id} onClick={() => toggleActivity(activity)} className="group cursor-pointer rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-lg flex sm:block">
                       <div className="h-24 w-24 sm:w-full sm:h-32 bg-slate-200 relative shrink-0"><img src={activity.image || 'https://placehold.co/400x300?text=No+Image'} className="w-full h-full object-cover" /></div>
                       <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0"><h4 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1 truncate">{activity.title}</h4><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 sm:mt-2"><span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10}/> {activity.location || 'Unknown'}</span><span className="font-bold text-[#34a4b8] text-sm mt-1 sm:mt-0">${activity.price || 0}</span></div></div>
                    </div>
                 ))}
               </div>
               <div className="flex justify-end mt-4"><button onClick={() => updateUser({})} className="bg-[#34a4b8] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#268191]">SAVE SELECTION</button></div>
             </div>
          )}
        </div>
        
        {/* LIVE PREVIEW COLUMN - RESTORED */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-russo text-slate-800 flex items-center gap-2">Preview</h3><a href="#" className="text-xs text-[#34a4b8] font-bold flex items-center gap-1 hover:underline">Open Live <ExternalLink size={10} /></a></div>
            <div className="border-[12px] border-slate-800 rounded-[3rem] overflow-hidden bg-white shadow-2xl h-[600px] relative scrollbar-hide">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
              <div className="h-full overflow-y-auto pb-12 bg-white custom-scrollbar">
                <div className="bg-[#e0f4f7] h-48 w-full relative flex flex-col items-center justify-center text-center p-4">
                   <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-russo text-[#34a4b8] mb-2">{user.name.charAt(0)}</div>
                   <h4 className="font-russo text-xl text-slate-800 leading-none flex items-center gap-1">{user.name} {user.plan === 'pro' && <Crown size={14} className="text-amber-500" />}</h4>
                   <p className="text-[10px] text-[#34a4b8] font-bold uppercase tracking-widest mt-1">Cruisy Ambassador</p>
                </div>
                <div className="p-6 text-center"><p className="text-sm text-slate-600 leading-relaxed font-light">{user.bio}</p></div>
                <div className="px-4 space-y-4 bg-slate-50 py-8">
                   <div className="text-center mb-4"><h5 className="font-russo text-slate-800 text-lg">My Favorites</h5><div className="h-1 w-12 bg-[#34a4b8] mx-auto rounded-full mt-1"></div></div>
                   {(user.featuredActivities || []).length === 0 ? (<div className="text-center py-8 text-slate-400 text-xs italic">(No items selected)</div>) : ((user.featuredActivities || []).map(act => (
                     <div key={act.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100">
                       <div className="h-28 bg-slate-200"><img src={act.image} className="w-full h-full object-cover" /></div>
                       <div className="p-3"><h6 className="font-bold text-sm text-slate-800 line-clamp-1">{act.title}</h6><span className="text-[#34a4b8] font-bold text-xs">View</span></div>
                     </div>
                   )))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogManager({ user }) {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getMyPosts(user.id, user.token);
        setPosts(data);
      } catch (e) {
        console.error("Failed to load posts", e);
      }
    };
    loadPosts();
  }, [user.id, user.token]);

  const handleEdit = (post) => {
    setEditingPost(post);
    setView('edit');
  };

  const handleNew = () => {
    setEditingPost({ id: null, title: '', content: '', image: '' });
    setView('edit');
  };

  const handleSave = async (postData) => {
    try {
      await createBlogPost(user.token, postData);
      const data = await getMyPosts(user.id, user.token);
      setPosts(data);
      setView('list');
    } catch (e) {
      alert("Failed to publish post.");
    }
  };

  const handleDelete = async (id) => {
      if(confirm('Are you sure you want to delete this story?')) {
        await deleteBlogPost(id, user.token);
        setPosts(posts.filter(p => p.id !== id));
      }
  };

  if (view === 'edit') {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
                <h2 className="text-2xl font-russo text-slate-800">{editingPost.id ? 'Edit Story' : 'Write New Story'}</h2>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none font-bold text-lg" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} placeholder=" e.g. My Trip to Alaska" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Story Content</label><textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none h-64" value={editingPost.content} onChange={e => setEditingPost({...editingPost, content: e.target.value})} placeholder="Tell your story..."></textarea></div>
                <div className="flex justify-end pt-4"><button onClick={() => handleSave(editingPost)} className="bg-[#34a4b8] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#268191] shadow-lg shadow-[#34a4b8]/20">PUBLISH</button></div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-end">
            <div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">My Travel Blog</h2><p className="text-slate-500">Share your adventures.</p></div>
            <button onClick={handleNew} className="bg-[#34a4b8] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#268191] shadow-md"><Plus size={20} /> Write Story</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400">No stories yet. Start writing!</p>
                </div>
            )}
            {posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                    <div className="p-4">
                        <h4 className="font-bold text-slate-800 text-lg mb-1">{post.title}</h4>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-slate-400">{post.date}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(post)} className="text-slate-500 hover:text-[#34a4b8]"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(post.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

function Gallery({ user, updateUser }) {
    const [isUploading, setIsUploading] = useState(false);
    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsUploading(true);
      setTimeout(() => {
          const reader = new FileReader();
          reader.onload = (e) => {
              const newImage = { id: Date.now(), url: e.target.result };
              const updatedGallery = [...(user.gallery || []), newImage];
              updateUser({ gallery: updatedGallery });
              setIsUploading(false);
          };
          reader.readAsDataURL(file);
      }, 1500);
    };
    const removePhoto = (id) => updateUser({ gallery: user.gallery.filter(img => img.id !== id) });
  
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          <div className="text-center max-w-2xl mx-auto"><h2 className="text-3xl font-russo text-slate-800 mb-4">My Travel Gallery 📸</h2><p className="text-slate-500 text-lg">Showcase your adventures.</p></div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#34a4b8] hover:bg-[#e0f4f7] flex flex-col items-center justify-center cursor-pointer transition-all group">
                      <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                      <div className={`p-3 rounded-full ${isUploading ? 'bg-slate-100' : 'bg-[#e0f4f7] group-hover:bg-white'} mb-2`}>{isUploading ? <RefreshCw className="animate-spin text-slate-400" /> : <Camera className="text-[#34a4b8]" />}</div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-[#34a4b8]">{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                  </label>
                  {(user.gallery || []).map((photo) => (
                      <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden relative group">
                          <img src={photo.url} alt="Travel moment" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={() => removePhoto(photo.id)} className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"><Trash2 size={18} /></button></div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    );
  }

function Academy({ user, setActiveTab }) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-end"><div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">Cruisy Academy</h2><p className="text-slate-500">Learn how to maximize your earnings.</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAINING_MODULES.map((module) => {
          const isLocked = module.type === 'pro' && user.plan !== 'pro';
          return (
            <div key={module.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
               <div className="h-40 bg-slate-200 relative">
                  <img src={module.image} alt={module.title} className={`w-full h-full object-cover transition-all ${isLocked ? 'grayscale opacity-50' : 'group-hover:scale-105'}`} />
                  {isLocked && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center"><Lock size={32} className="mb-2" /><span className="font-bold text-sm uppercase tracking-wide">Elite Member Only</span></div>}
                  {!isLocked && <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><PlayCircle size={48} className="text-white drop-shadow-lg" /></div>}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">{module.duration}</div>
               </div>
               <div className="p-5">
                  <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${module.type === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{module.type === 'free' ? 'Free Guide' : 'Pro Course'}</span></div>
                  <h3 className="font-bold text-slate-800 leading-tight mb-3">{module.title}</h3>
                  {isLocked ? <button onClick={() => setActiveTab('membership')} className="w-full bg-amber-50 text-amber-700 text-sm font-bold py-2 rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"><Lock size={14} /> Unlock Access</button> : <button className="w-full bg-slate-50 text-slate-600 text-sm font-bold py-2 rounded-lg hover:bg-slate-100 transition-colors">Start Learning</button>}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Membership({ user, updateUser }) {
  const [billingCycle, setBillingCycle] = useState('year'); 
  const STRIPE_MONTHLY_URL = "https://buy.stripe.com/YOUR_ACTUAL_MONTHLY_LINK";
  const STRIPE_YEARLY_URL = "https://buy.stripe.com/YOUR_ACTUAL_YEARLY_LINK";
  const handleUpgrade = () => {
    if (STRIPE_MONTHLY_URL.includes("YOUR_ACTUAL")) {
        alert("Payment links haven't been configured yet. Please contact support.");
        return;
    }
    window.open(billingCycle === 'year' ? STRIPE_YEARLY_URL : STRIPE_MONTHLY_URL, '_blank');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="text-center max-w-2xl mx-auto"><h2 className="text-3xl font-russo text-slate-800 mb-4">Supercharge Your Earnings 🚀</h2><p className="text-slate-500 text-lg">Join the Elite tier to unlock our highest commission rates and exclusive status.</p></div>
       <div className="flex justify-center"><div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-sm"><button onClick={() => setBillingCycle('month')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'month' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Monthly</button><button onClick={() => setBillingCycle('year')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'year' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Yearly <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded uppercase">Save 17%</span></button></div></div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
         <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm opacity-90 hover:opacity-100 transition-all">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Standard</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-russo text-slate-900">Free</span><span className="text-slate-500 font-medium text-sm">Forever</span></div>
            <div className="border-t border-slate-100 pt-6 mb-8 space-y-4">
              {['10% Commission on Activities', '12% on Fury Water Adventures', 'Up to 5% on Stays & Cruises', 'Basic Dashboard Analytics', 'Link Generator Tool', 'Monthly Payouts'].map((f,i) => (
                  <div key={i} className="flex items-start gap-3"><div className="mt-0.5 rounded-full p-0.5 bg-slate-100 text-slate-500"><Check size={14} strokeWidth={3} /></div><span className="text-sm text-slate-600">{f}</span></div>
              ))}
            </div>
            <button disabled={true} className="w-full py-4 rounded-xl font-russo text-lg bg-slate-100 text-slate-400 cursor-default">{user.plan === 'free' ? 'Current Plan' : 'Included'}</button>
         </div>

         {/* Enhanced Elite Card */}
         <div className="bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl shadow-amber-500/20 scale-105 z-10 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">Best Value</div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Elite <Crown size={20} className="inline-block text-amber-500 ml-1 fill-amber-500" /></h3>
             <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-russo text-slate-900">{billingCycle === 'year' ? '$290' : '$29'}</span><span className="text-slate-500 font-medium text-sm">/{billingCycle}</span></div>
             <div className="border-t border-slate-100 pt-6 mb-8 space-y-4">
               {['Boosted Activity Rates (Up to 15%)', 'Maximum Earning Potential', 'Exclusive Social Media Content', 'Priority Ambassador Support', 'First Access to New Tours', 'Insider Travel Updates'].map((f,i) => (
                  <div key={i} className="flex items-start gap-3"><div className="mt-0.5 rounded-full p-0.5 bg-amber-100 text-amber-600"><Check size={14} strokeWidth={3} /></div><span className="text-sm text-slate-600">{f}</span></div>
               ))}
             </div>
             <button onClick={() => user.plan === 'pro' ? null : handleUpgrade()} disabled={user.plan === 'pro'} className={`w-full py-4 rounded-xl font-russo text-lg transition-all shadow-lg active:scale-95 ${user.plan === 'pro' ? 'bg-slate-100 text-slate-400 cursor-default' : 'gold-gradient text-white hover:shadow-amber-500/25'}`}>{user.plan === 'pro' ? 'Current Plan' : 'Upgrade to Elite'}</button>
         </div>
       </div>
    </div>
  );
}

function Earnings({ user }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between items-end"><div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">My Earnings</h2><p className="text-slate-500">Track your income.</p></div></div>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0"><Calendar size={20} /></div>
        <div><h4 className="font-russo text-orange-800 text-sm">Earnings Update Schedule</h4><p className="text-sm text-orange-800 mt-1">Earnings are manually reviewed and updated by the Cruisy team every Friday.</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#34a4b8] text-white p-8 rounded-3xl shadow-xl shadow-[#34a4b8]/20 relative overflow-hidden">
          <div className="relative z-10"><p className="text-blue-100 font-bold text-sm uppercase tracking-wider">Available Payout</p><h3 className="text-4xl font-russo mt-2">$0.00</h3><button className="mt-6 bg-white text-[#34a4b8] px-6 py-3 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors w-full shadow-lg">REQUEST PAYOUT</button></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-center">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Total Earned</p><h3 className="text-3xl font-russo mt-2 text-slate-800">$0.00</h3>
            <div className="flex flex-col gap-1 mt-2"><span className="text-xs text-slate-500">10-12% on Activities</span><span className="text-xs text-slate-500">Up to 5% on Stays/Cruises</span></div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({ onLogin, error }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const scrollToForm = () => { setIsLearnMoreOpen(false); document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {isLearnMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLearnMoreOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in">
            <div className="p-6 bg-[#34a4b8] text-white flex justify-between items-center"><h3 className="font-russo text-xl">Program Details</h3><button onClick={() => setIsLearnMoreOpen(false)}><XCircle /></button></div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <p><strong>Free to Join:</strong> Sign up in seconds.</p>
                <p><strong>Commission:</strong> 10-12% on Activities, Up to 5% on Stays/Cruises (e.g. Earn $250 on a $5,000 booking).</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t"><h4 className="font-bold text-amber-500 flex gap-2"><Crown size={18}/> Elite Upgrade</h4><span className="text-sm">Available inside</span></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="md:w-1/2 relative flex flex-col justify-center p-8 md:p-12 lg:p-16 text-white overflow-hidden bg-gray-900">
         <div className="absolute inset-0 z-0"><img src="https://images.pexels.com/photos/11360602/pexels-photo-11360602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#34a4b8]/95 via-[#34a4b8]/70 to-[#34a4b8]/30 mix-blend-multiply"></div></div>
         <div className="relative z-10 max-w-lg">
           <div className="flex items-center gap-4 mb-8"><img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" className="h-12 bg-white p-2 rounded-lg" /><span className="font-bold flex items-center gap-1 hover:underline cursor-pointer" onClick={() => window.location.href='https://cruisytravel.com'}><ArrowLeft size={14}/> Back to CruisyTravel.com</span></div>
           <h1 className="text-4xl md:text-5xl font-russo mb-6 leading-tight drop-shadow-md">Get Paid to Share Paradise.</h1>
           <p className="text-blue-50 text-lg mb-8">Become a Cruisy Ambassador. Earn 10-12% on tours & up to 5% on stays.</p>
           <button onClick={() => setIsLearnMoreOpen(true)} className="w-full mt-8 py-3 bg-white/20 border border-white/40 rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm text-sm font-bold shadow-lg"><Info size={16} /> Program Details</button>
         </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
         <div id="auth-form" className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-russo text-slate-800 text-center mb-8">{isLogin ? 'Welcome Back' : 'Join the Crew'}</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6"><button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg ${isLogin ? 'bg-white text-[#34a4b8] shadow-sm' : 'text-slate-400'}`}>Sign In</button><a href="https://cruisytravel.com/wp-login.php?action=register" target="_blank" rel="noreferrer" className={`flex-1 py-2 text-sm font-bold rounded-lg text-center ${!isLogin ? 'bg-white text-[#34a4b8] shadow-sm' : 'text-slate-400'}`}>Join</a></div>
            {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username or Email</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label><input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
              <button type="submit" className="w-full bg-[#34a4b8] text-white font-bold font-russo py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2">ENTER PORTAL <ArrowRight size={20} /></button>
            </form>
         </div>
      </div>
    </div>
  );
}

function DesktopNavItem({ icon, label, active, onClick, highlight }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? (highlight ? 'bg-amber-50 text-amber-600 shadow-md shadow-amber-500/10' : 'bg-[#34a4b8] text-white shadow-md shadow-[#34a4b8]/20') : (highlight ? 'text-amber-600 hover:bg-amber-50' : 'text-slate-500 hover:bg-[#e0f4f7] hover:text-[#34a4b8]')}`}>{icon}{label}</button>
  );
}
