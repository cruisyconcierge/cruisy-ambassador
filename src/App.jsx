import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Link as LinkIcon, 
  DollarSign, 
  LogOut, 
  Copy, 
  Check, 
  Globe, 
  MapPin, 
  Image as ImageIcon,
  Search,
  RefreshCw,
  Server,
  ExternalLink,
  Edit3,
  Calendar,
  Anchor,
  Home,
  Crown,
  BookOpen,
  PlayCircle,
  Lock,
  Zap,
  Palmtree,
  Sunset,
  Info,
  XCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

// --- Brand Styling (Injected) ---
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

// --- Mock Data ---
const MOCK_ACTIVITIES = [
  { id: 101, type: 'activity', title: 'Fury Water Adventures: Ultimate Adventure', location: 'Key West, FL', price: 165, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=300', isFury: true },
  { id: 102, type: 'activity', title: 'Key West Sunset Sail', location: 'Key West, FL', price: 85, image: 'https://images.unsplash.com/photo-1596323605786-226466b03387?auto=format&fit=crop&q=80&w=300' },
  { id: 103, type: 'activity', title: 'Dry Tortugas Seaplane', location: 'Key West, FL', price: 450, image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=300' },
  { id: 201, type: 'stay', title: 'The Marker Key West Harbor Resort', location: 'Key West, FL', price: 450, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300' },
  { id: 202, type: 'stay', title: 'Opal Key Resort & Marina', location: 'Key West, FL', price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300' },
  { id: 301, type: 'cruise', title: '4-Day Bahamas Cruise', location: 'Miami Departure', price: 499, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=300' },
  { id: 302, type: 'cruise', title: 'Alaskan Glacier Explorer', location: 'Seattle Departure', price: 1200, image: 'https://images.unsplash.com/photo-1516216628259-7a548d28cb11?auto=format&fit=crop&q=80&w=300' },
];

const TRAINING_MODULES = [
  { id: 1, title: 'Ambassador Quick Start Guide', duration: '15 min', type: 'free', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300' },
  { id: 2, title: 'Maximizing Hotel Commissions', duration: '10 min', type: 'free', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300' },
  { id: 3, title: 'Advanced SEO for Travel Blogs', duration: '45 min', type: 'pro', image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=300' },
  { id: 4, title: 'Mastering TikTok for Travel Sales', duration: '30 min', type: 'pro', image: 'https://images.unsplash.com/photo-1611605698383-ef78b6578277?auto=format&fit=crop&q=80&w=300' },
];

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('overview');

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cruisy_ambassador_final');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    const defaultData = {
      ...userData,
      plan: 'free', // 'free' or 'pro'
      featuredActivities: [] 
    };
    setUser(defaultData);
    localStorage.setItem('cruisy_ambassador_final', JSON.stringify(defaultData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cruisy_ambassador_final');
    setActiveTab('overview');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cruisy_ambassador_final', JSON.stringify(updated));
  };

  // If no user, show the Landing/Auth Page
  if (!user) {
    return (
      <>
        <BrandStyles />
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <Layout size={20} /> },
    { id: 'profile', label: 'Edit Page', icon: <Edit3 size={20} /> },
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

          <nav className="flex-1 px-4 space-y-2 mt-6">
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
            {activeTab === 'profile' && <ProfileEditor user={user} updateUser={updateUser} />}
            {activeTab === 'academy' && <Academy user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'membership' && <Membership user={user} updateUser={updateUser} />}
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

// --- Views ---

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
              <p className="text-white/80 mb-6 font-medium text-sm md:text-base max-w-lg">This link goes to your Divi profile page. Bookings made here are tracked to you.</p>
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

function Academy({ user, setActiveTab }) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-end">
        <div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">Cruisy Academy</h2><p className="text-slate-500">Learn how to maximize your earnings.</p></div>
      </div>
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
  
  // REPLACE THESE WITH YOUR ACTUAL STRIPE LINKS
  const STRIPE_MONTHLY_URL = "https://buy.stripe.com/00waEW1DF1gSf6fevR24000";
  const STRIPE_YEARLY_URL = "https://buy.stripe.com/6oU00iaabgbM4rBdrN24001";

  const handleUpgrade = () => {
    const link = billingCycle === 'year' ? STRIPE_YEARLY_URL : STRIPE_MONTHLY_URL;
    window.open(link, '_blank');
  };

  const plans = [
    {
      id: 'free', name: 'Standard', price: 'Free', period: 'Forever',
      features: ['10% Commission on Activities', '12% on Fury Water Adventures', 'Up to 5% on Stays & Cruises', 'Standard Payout Schedule', 'Link Generator Tool', 'Basic Profile Page'],
      buttonText: user.plan === 'free' ? 'Current Plan' : 'Included', active: user.plan === 'free', disabled: user.plan === 'pro'
    },
    {
      id: 'pro', name: 'Elite', price: billingCycle === 'year' ? '$290' : '$29', period: billingCycle === 'year' ? '/ year' : '/ month',
      features: ['Boosted Activity Rates (Up to 15%)', 'Maximum Earning Potential', 'Exclusive Social Media Content', 'Priority Ambassador Support', 'First Access to New Tours', 'Insider Travel Updates'],
      buttonText: user.plan === 'pro' ? 'Current Plan' : 'Upgrade to Elite', active: user.plan === 'pro', recommended: true
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
       <div className="text-center max-w-2xl mx-auto"><h2 className="text-3xl font-russo text-slate-800 mb-4">Supercharge Your Earnings 🚀</h2><p className="text-slate-500 text-lg">Join the Elite tier to unlock our highest commission rates and exclusive status.</p></div>
       <div className="flex justify-center"><div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-sm"><button onClick={() => setBillingCycle('month')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'month' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Monthly</button><button onClick={() => setBillingCycle('year')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'year' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Yearly <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded uppercase">Save 17%</span></button></div></div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
         {plans.map((plan) => (
           <div key={plan.id} className={`bg-white rounded-3xl p-8 border transition-all relative ${plan.recommended ? 'border-amber-400 shadow-xl shadow-amber-500/10 scale-100 md:scale-105 z-10' : 'border-slate-200 shadow-sm'} ${plan.disabled ? 'opacity-70 grayscale' : ''}`}>
             {plan.recommended && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">Best Value</div>}
             <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
             <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-russo text-slate-900">{plan.price}</span><span className="text-slate-500 font-medium text-sm">{plan.period}</span></div>
             <div className="border-t border-slate-100 pt-6 mb-8 space-y-4">{plan.features.map((feat, i) => (<div key={i} className="flex items-start gap-3"><div className={`mt-0.5 rounded-full p-0.5 ${plan.recommended ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}><Check size={14} strokeWidth={3} /></div><span className="text-sm text-slate-600">{feat}</span></div>))}</div>
             <button onClick={() => plan.id === 'pro' && !plan.active ? handleUpgrade() : null} disabled={plan.active || plan.disabled} className={`w-full py-4 rounded-xl font-russo text-lg transition-all shadow-lg active:scale-95 ${(plan.active || plan.disabled) ? 'bg-slate-100 text-slate-400 cursor-default shadow-none' : plan.recommended ? 'gold-gradient text-white hover:shadow-amber-500/25' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>{plan.buttonText}</button>
           </div>
         ))}
       </div>
    </div>
  );
}

function ProfileEditor({ user, updateUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('details'); 
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const filteredActivities = MOCK_ACTIVITIES.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || act.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || act.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleActivity = (activity) => {
    const current = user.featuredActivities || [];
    const exists = current.find(a => a.id === activity.id);
    updateUser({ featuredActivities: exists ? current.filter(a => a.id !== activity.id) : [...current, activity] });
  };

  const handlePublish = () => { setIsSaving(true); setTimeout(() => { setIsSaving(false); setLastSaved(new Date().toLocaleTimeString()); }, 1500); };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white border-l-4 border-[#34a4b8] p-4 rounded-r-xl shadow-sm flex gap-4 text-sm"><Server className="text-[#34a4b8] shrink-0" size={24} /><div><h4 className="font-bold text-slate-800">WordPress Sync</h4><p className="text-slate-500 mt-1">Updates here sync directly to your Cruisy Ambassador Page.</p></div></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">Edit Page</h2><p className="text-slate-500">Manage your bio and featured activities.</p></div>
        <div className="bg-white border border-slate-200 p-1 rounded-xl flex w-full md:w-auto shadow-sm">
           <button onClick={() => setActiveTab('details')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeTab === 'details' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Profile Info</button>
           <button onClick={() => setActiveTab('activities')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeTab === 'activities' ? 'bg-[#34a4b8] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Select Tours</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'details' ? (
             <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100"><div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg text-slate-400 overflow-hidden relative group cursor-pointer shrink-0"><ImageIcon size={32} /></div><div className="text-center sm:text-left"><h4 className="font-russo text-lg text-slate-800">Featured Image</h4><p className="text-sm text-slate-500 mb-2">Main photo used in the Header.</p><button className="text-xs bg-[#e0f4f7] text-[#268191] font-bold px-3 py-1.5 rounded-lg">Upload New</button></div></div>
                <div className="space-y-4"><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Profile Name</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none font-medium min-w-0" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} /></div><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Bio (About You)</label><textarea rows="6" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none min-w-0" value={user.bio} onChange={(e) => updateUser({ bio: e.target.value })}></textarea></div></div>
             </div>
          ) : (
             <div className="space-y-4">
               <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search tours..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#34a4b8] outline-none min-w-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{[{ id: 'all', label: 'All' }, { id: 'activity', label: 'Activities', icon: <MapPin size={14} /> }, { id: 'stay', label: 'Stays', icon: <Home size={14} /> }, { id: 'cruise', label: 'Cruises', icon: <Anchor size={14} /> }].map(cat => (<button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${categoryFilter === cat.id ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{cat.icon}{cat.label}</button>))}</div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {filteredActivities.map(activity => {
                   const isSelected = (user.featuredActivities || []).find(a => a.id === activity.id);
                   return (
                     <div key={activity.id} onClick={() => toggleActivity(activity)} className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all hover:shadow-lg flex sm:block ${isSelected ? 'border-[#34a4b8] ring-2 ring-[#34a4b8] ring-offset-2' : 'border-slate-200 bg-white'}`}>
                       <div className="h-24 w-24 sm:w-full sm:h-32 bg-slate-200 relative shrink-0"><img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                         <div className="absolute top-2 left-2 flex gap-1 flex-wrap"><span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">{activity.type}</span>{activity.isFury && <span className="gold-gradient text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">12% Comm</span>}</div>
                         {isSelected && <div className="absolute inset-0 bg-[#34a4b8]/80 flex items-center justify-center animate-in fade-in duration-200"><Check className="text-white w-6 h-6 sm:w-8 sm:h-8" /></div>}
                       </div>
                       <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0"><h4 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1 truncate">{activity.title}</h4><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 sm:mt-2"><span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10}/> {activity.location}</span><span className="font-bold text-[#34a4b8] text-sm mt-1 sm:mt-0">${activity.price}</span></div></div>
                     </div>
                   );
                 })}
               </div>
             </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-200 mt-6 pb-4 md:pb-0">{lastSaved && <span className="text-sm text-slate-400">Saved at {lastSaved}</span>}<button onClick={handlePublish} disabled={isSaving} className="w-full sm:w-auto bg-[#34a4b8] text-white font-russo text-lg px-8 py-3 rounded-xl hover:bg-[#268191] transition-all shadow-lg shadow-[#34a4b8]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">{isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Globe size={20} />}{isSaving ? 'SYNCING...' : 'PUBLISH CHANGES'}</button></div>
        </div>
        <div className="hidden lg:block lg:col-span-1"><div className="sticky top-6"><div className="flex justify-between items-center mb-4"><h3 className="font-russo text-slate-800 flex items-center gap-2">Preview</h3><a href="#" className="text-xs text-[#34a4b8] font-bold flex items-center gap-1 hover:underline">Open Live <ExternalLink size={10} /></a></div><div className="border-[12px] border-slate-800 rounded-[3rem] overflow-hidden bg-white shadow-2xl h-[600px] relative scrollbar-hide"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div><div className="h-full overflow-y-auto pb-12 bg-white custom-scrollbar"><div className="bg-[#e0f4f7] h-48 w-full relative flex flex-col items-center justify-center text-center p-4"><div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-russo text-[#34a4b8] mb-2">{user.name.charAt(0)}</div><h4 className="font-russo text-xl text-slate-800 leading-none flex items-center gap-1">{user.name} {user.plan === 'pro' && <Crown size={14} className="text-amber-500 fill-amber-500" />}</h4><p className="text-[10px] text-[#34a4b8] font-bold uppercase tracking-widest mt-1">Cruisy Ambassador</p></div><div className="p-6 text-center"><p className="text-sm text-slate-600 leading-relaxed font-light">{user.bio}</p></div><div className="px-4 space-y-4 bg-slate-50 py-8"><div className="text-center mb-4"><h5 className="font-russo text-slate-800 text-lg">My Favorites</h5><div className="h-1 w-12 bg-[#34a4b8] mx-auto rounded-full mt-1"></div></div>{(user.featuredActivities || []).length === 0 ? (<div className="text-center py-8 text-slate-400 text-xs italic">(No items selected)</div>) : ((user.featuredActivities || []).map(act => (<div key={act.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100"><div className="h-28 bg-slate-200"><img src={act.image} className="w-full h-full object-cover" /></div><div className="p-3"><h6 className="font-bold text-sm text-slate-800 line-clamp-1">{act.title}</h6><div className="flex justify-between items-center mt-1"><p className="text-xs text-slate-500">{act.location}</p><span className="text-[#34a4b8] font-bold text-xs">View</span></div></div></div>)))}</div></div></div></div></div>
      </div>
    </div>
  );
}

function LinkGenerator({ user }) {
  const [sourceUrl, setSourceUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  
  const handleGenerate = () => {
    if (!sourceUrl) return;
    const cleanUrl = sourceUrl.split('?')[0];
    setGeneratedLink(`${cleanUrl}?ref=${user.slug}&utm_source=ambassador`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-russo text-slate-800">Link Generator</h2>
        <p className="text-slate-500">Create a trackable link for ANY specific activity.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-[#34a4b8]/5">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Activity URL</label>
            <div className="flex shadow-sm rounded-xl w-full">
               <span className="bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl px-4 flex items-center text-slate-400 shrink-0">
                 <LinkIcon size={18} />
               </span>
               <input 
                type="text" 
                placeholder="https://cruisytravel.com/activities/sunset-sail"
                className="w-full px-4 py-4 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none font-medium text-slate-600 min-w-0"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full bg-slate-800 text-white font-russo text-lg py-4 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
          >
            GENERATE LINK
          </button>

          {generatedLink && (
            <div className="mt-6 bg-[#e0f4f7] p-6 rounded-2xl border border-[#34a4b8]/20 animate-in fade-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-[#34a4b8] uppercase mb-2">Ready to Share</label>
              <div className="flex gap-2 w-full">
                <div className="flex-1 bg-white border border-[#34a4b8]/30 px-4 py-3 rounded-xl text-sm text-slate-600 font-mono overflow-x-auto whitespace-nowrap min-w-0">
                  {generatedLink}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(generatedLink)}
                  className="bg-[#34a4b8] text-white px-5 rounded-xl hover:bg-[#268191] transition-colors shadow-lg shadow-[#34a4b8]/20 shrink-0"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Earnings({ user }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between items-end">
        <div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">My Earnings</h2><p className="text-slate-500">Track your income.</p></div>
      </div>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-4 items-start">
        <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0"><Calendar size={20} /></div>
        <div><h4 className="font-russo text-orange-800 text-sm">Earnings Update Schedule</h4><p className="text-sm text-orange-800 mt-1">Earnings are manually reviewed and updated by the Cruisy team every Friday.</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#34a4b8] text-white p-8 rounded-3xl shadow-xl shadow-[#34a4b8]/20 relative overflow-hidden">
          <div className="relative z-10"><p className="text-blue-100 font-bold text-sm uppercase tracking-wider">Available Payout</p><h3 className="text-4xl font-russo mt-2">$124.50</h3><button className="mt-6 bg-white text-[#34a4b8] px-6 py-3 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors w-full shadow-lg">REQUEST PAYOUT</button></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-center">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Total Earned</p><h3 className="text-3xl font-russo mt-2 text-slate-800">$1,450.00</h3>
            <div className="flex flex-col gap-1 mt-2"><span className="text-xs text-slate-500">10-12% on Activities</span><span className="text-xs text-slate-500">Up to 5% on Stays/Cruises</span></div>
        </div>
      </div>
    </div>
  );
}

// --- Auth Page (New Landing) ---
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', slug: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Alex Smith', email: formData.email, slug: formData.slug || 'alex-travels',
      bio: 'Just a girl exploring the world, one cruise at a time.', joinedDate: 'Oct 2023'
    });
  };

  const scrollToForm = () => {
    setIsLearnMoreOpen(false);
    document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {isLearnMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLearnMoreOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-[#34a4b8] text-white flex justify-between items-center"><h3 className="font-russo text-xl">About the Program</h3><button onClick={() => setIsLearnMoreOpen(false)}><XCircle className="w-6 h-6 hover:text-white/80" /></button></div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2"><div className="flex items-center justify-between"><h4 className="font-bold text-slate-800 flex items-center gap-2"><Zap size={18} className="text-amber-500" /> It's Free to Join</h4><button onClick={scrollToForm} className="text-xs text-[#34a4b8] hover:underline font-medium font-bold">Sign Up / Sign In</button></div><p className="text-slate-600 text-sm">Sign up in seconds. Start on the Standard plan, or upgrade to Elite for higher earnings.</p></div>
              <div className="space-y-2"><h4 className="font-bold text-slate-800 flex items-center gap-2"><Crown size={18} className="text-amber-500" /> Elite Upgrade Available</h4><p className="text-slate-600 text-sm">Want to earn more? Upgrade to our Elite tier for 15% commission, faster weekly payouts, and exclusive training.</p></div>
              <div className="space-y-2"><h4 className="font-bold text-slate-800 flex items-center gap-2"><Globe size={18} className="text-[#34a4b8]" /> Your Own Booking Page</h4><p className="text-slate-600 text-sm">You get a custom `cruisytravel.com/your-name` link. Share it on social media, text it to friends, or put it in your bio.</p></div>
              <div className="space-y-2"><h4 className="font-bold text-slate-800 flex items-center gap-2"><DollarSign size={18} className="text-green-600" /> Automatic Tracking</h4><p className="text-slate-600 text-sm">When someone books ANY activity, hotel, or cruise using your link, we track it. You earn 10-12% on tours and up to 5% on stays/cruises.</p></div>
              <div className="space-y-2"><h4 className="font-bold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-purple-600" /> Monthly Payouts</h4><p className="text-slate-600 text-sm">We verify bookings after travel is completed and send your earnings directly to you.</p></div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center"><button onClick={() => setIsLearnMoreOpen(false)} className="text-[#34a4b8] font-bold text-sm">Close</button></div>
          </div>
        </div>
      )}
      <div className="md:w-1/2 relative flex flex-col justify-center p-8 md:p-12 lg:p-16 text-white overflow-hidden bg-gray-900">
         <div className="absolute inset-0 z-0"><img src="https://images.pexels.com/photos/11360602/pexels-photo-11360602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Key West" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#34a4b8]/95 via-[#34a4b8]/70 to-[#34a4b8]/30 mix-blend-multiply"></div><div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-transparent"></div></div>
         <div className="relative z-10 max-w-lg mx-auto md:mx-0">
           <div className="flex items-center gap-4 mb-8"><img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" alt="Cruisy" className="h-12 w-auto bg-white p-2 rounded-lg inline-block" /><a href="https://cruisytravel.com" className="text-white hover:underline text-sm font-bold flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/20 backdrop-blur-sm"><ArrowLeft size={14} /> Back to CruisyTravel.com</a></div>
           <h1 className="text-4xl md:text-5xl font-russo mb-6 leading-tight drop-shadow-md">Get Paid to Share Paradise.</h1>
           <p className="text-blue-50 text-lg mb-8 font-light drop-shadow-sm">Become a Cruisy Ambassador and earn commissions on thousands of experiences, hotels, and cruises.</p>
           <div className="space-y-6">
             <div className="flex items-start gap-4"><div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/10"><Palmtree size={24} className="text-white" /></div><div><h3 className="font-russo text-xl text-white">10-12% on Activities</h3><p className="text-blue-50 text-sm">Earn 10% on most tours. Get <strong>12%</strong> on Fury Water Adventures!</p></div></div>
             <div className="flex items-start gap-4"><div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/10"><Home size={24} className="text-white" /></div><div><h3 className="font-russo text-xl text-white">Up to 5% on Stays & Cruises</h3><p className="text-blue-50 text-sm">Earn up to 5% on hotels and cruises. <br/><em>(e.g., Earn $250 on a $5,000 booking!)</em></p></div></div>
             <div className="flex items-start gap-4"><div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/10"><Globe size={24} className="text-white" /></div><div className="w-full"><h3 className="font-russo text-xl text-white">Your Own Booking Page</h3><p className="text-blue-50 text-sm mb-2">Get a custom <strong>cruisytravel.com/you</strong> page to share with followers. We track every booking automatically.</p><button onClick={() => setIsLearnMoreOpen(true)} className="w-full mt-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl transition-colors flex items-center justify-center gap-2 backdrop-blur-sm text-sm font-bold shadow-lg"><Info size={16} /> Program Details</button></div></div>
           </div>
         </div>
      </div>
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
         <div id="auth-form" className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="text-center mb-8"><h2 className="text-2xl font-russo text-slate-800">{isLogin ? 'Welcome Back' : 'Join the Crew'}</h2><p className="text-slate-500 text-sm">{isLogin ? 'Sign in to access your dashboard' : 'Create your account to start earning'}</p></div>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6"><button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-[#34a4b8] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Sign In</button><button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-[#34a4b8] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Sign Up</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] focus:border-[#34a4b8] outline-none transition-all" placeholder="e.g. Alex Smith" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>}
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email Address</label><input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] focus:border-[#34a4b8] outline-none transition-all" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label><input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] focus:border-[#34a4b8] outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
              <button type="submit" className="w-full bg-[#34a4b8] text-white font-bold font-russo py-4 rounded-xl hover:bg-[#268191] transition-all shadow-lg shadow-[#34a4b8]/20 mt-4 active:scale-95 text-lg tracking-wide flex items-center justify-center gap-2">{isLogin ? 'ENTER PORTAL' : 'CREATE ACCOUNT'} <ArrowRight size={20} /></button>
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
