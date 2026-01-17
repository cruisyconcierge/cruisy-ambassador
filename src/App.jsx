import React, { useState, useEffect } from 'react';
import { 
  Layout, Link as LinkIcon, DollarSign, LogOut, Copy, Check, Globe, MapPin, 
  Image as ImageIcon, Search, RefreshCw, Server, ExternalLink, Edit3, Calendar, 
  Anchor, Home, Crown, BookOpen, PlayCircle, Lock, Zap, Palmtree, Info, 
  XCircle, ArrowRight, ArrowLeft
} from 'lucide-react';

// --- Brand Styling ---
const BrandStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Russo+One&display=swap');
    :root { --brand-teal: #34a4b8; --brand-teal-light: #e0f4f7; --brand-teal-dark: #268191; --brand-gold: #fbbf24; }
    body { font-family: 'Roboto', sans-serif; background-color: #f0f9fa; overflow-x: hidden; }
    h1, h2, h3, h4, h5, h6, .font-russo { font-family: 'Russo One', sans-serif; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .gold-gradient { background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); }
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
  { id: 1, title: 'Ambassador Quick Start', duration: '15 min', type: 'free', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173' },
  { id: 2, title: 'Maximizing Commissions', duration: '10 min', type: 'free', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
  { id: 3, title: 'Advanced SEO Tactics', duration: '45 min', type: 'pro', image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6' },
];

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('cruisy_ambassador_real');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    const defaultData = {
      ...userData,
      plan: userData.plan || 'free',
      featuredActivities: userData.featuredActivities || [] 
    };
    setUser(defaultData);
    localStorage.setItem('cruisy_ambassador_real', JSON.stringify(defaultData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cruisy_ambassador_real');
    setActiveTab('overview');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cruisy_ambassador_real', JSON.stringify(updated));
  };

  if (!user) return <><BrandStyles /><AuthPage onLogin={handleLogin} /></>;

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
      <div className="relative min-h-screen bg-gradient-to-br from-[#f0f9fa] via-[#e6f7ff] to-[#fff7ed] flex font-sans text-slate-700">
        {/* Sidebar Desktop */}
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-[#34a4b8]/20 hidden md:flex flex-col fixed h-full z-20 shadow-lg">
          <div className="p-6 flex flex-col items-center border-b border-slate-100/50">
            <img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" alt="Cruisy" className="h-12 w-auto mb-2" />
            <p className="text-[10px] text-[#34a4b8] font-bold uppercase tracking-widest font-russo">Ambassador Portal</p>
            <a href="https://cruisytravel.com" className="text-xs text-slate-400 hover:text-[#34a4b8] mt-2 flex items-center gap-1"><ArrowLeft size={10} /> Back to Main Site</a>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-6">
            {navItems.map((item) => (
              <DesktopNavItem key={item.id} {...item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
            ))}
          </nav>
          <div className="p-4 mt-auto">
             <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-slate-400 hover:text-[#34a4b8] p-2 text-sm font-bold w-full"><LogOut size={16} /> Sign Out</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen relative pb-24 md:pb-8 w-full max-w-full z-10">
          <div className="md:hidden flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-[#34a4b8]/20 sticky top-4 z-30">
            <img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" alt="Cruisy" className="h-8 w-auto" />
            <button onClick={handleLogout} className="text-slate-400 p-1"><LogOut size={20} /></button>
          </div>

          <div className="max-w-6xl mx-auto w-full">
            {activeTab === 'overview' && <Overview user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && <ProfileEditor user={user} updateUser={updateUser} />}
            {activeTab === 'academy' && <Academy user={user} setActiveTab={setActiveTab} />}
            {activeTab === 'membership' && <Membership user={user} updateUser={updateUser} />}
            {activeTab === 'earnings' && <Earnings user={user} />}
          </div>
        </main>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50">
            {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all active:scale-95 ${activeTab === item.id ? 'text-[#34a4b8]' : 'text-slate-400'}`}>
                    <div className="p-1.5 rounded-xl mb-1">{item.icon}</div>
                    <span className="text-[10px] font-bold leading-none">{item.label}</span>
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
        <div><h2 className="text-2xl md:text-3xl font-russo text-slate-800">Aloha, {user.name.split(' ')[0]}! 🌴</h2><p className="text-slate-500 font-medium">Your ambassador profile is live.</p></div>
        {user.plan === 'free' && <button onClick={() => setActiveTab('membership')} className="hidden md:flex bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 animate-pulse"><Zap size={16} /> Boost Your Commission</button>}
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#34a4b8]/20 bg-gradient-to-r from-[#34a4b8] to-[#2db5cc] text-white">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full"> 
              <h3 className="font-russo text-xl md:text-2xl mb-2 flex items-center gap-2">Your Public Profile Page {user.plan === 'pro' && <Crown size={24} />}</h3>
              <p className="text-white/80 mb-6 font-medium text-sm">This link goes to your Divi profile page.</p>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md p-2 pl-4 rounded-xl border border-white/20 w-full">
                <Globe size={18} className="text-white shrink-0" /><code className="text-white font-bold font-mono text-xs md:text-sm flex-1 truncate">{mainLink}</code>
                <button onClick={() => { navigator.clipboard.writeText(mainLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-5 py-2 rounded-lg text-sm font-bold bg-white text-[#34a4b8] hover:bg-cyan-50 flex items-center gap-2">{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'COPIED' : 'COPY'}</button>
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
  const filteredActivities = MOCK_ACTIVITIES.filter(act => act.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleActivity = (activity) => {
    const current = user.featuredActivities || [];
    const exists = current.find(a => a.id === activity.id);
    updateUser({ featuredActivities: exists ? current.filter(a => a.id !== activity.id) : [...current, activity] });
  };

  const handlePublish = () => { /* Sync logic */ };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white border-l-4 border-[#34a4b8] p-4 rounded-r-xl shadow-sm flex gap-4 text-sm"><Server className="text-[#34a4b8] shrink-0" size={24} /><div><h4 className="font-bold text-slate-800">WordPress Sync</h4><p className="text-slate-500 mt-1">Updates here sync directly to your Cruisy Ambassador Page.</p></div></div>
      <div className="flex justify-between items-end">
        <h2 className="text-2xl md:text-3xl font-russo text-slate-800">Edit Page</h2>
        <div className="bg-white border border-slate-200 p-1 rounded-xl flex"><button onClick={() => setActiveTab('details')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'details' ? 'bg-[#34a4b8] text-white' : 'text-slate-500'}`}>Profile Info</button><button onClick={() => setActiveTab('activities')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'activities' ? 'bg-[#34a4b8] text-white' : 'text-slate-500'}`}>Select Tours</button></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'details' ? (
             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Name</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio</label><textarea rows="6" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#34a4b8] outline-none" value={user.bio} onChange={(e) => updateUser({ bio: e.target.value })}></textarea></div>
             </div>
          ) : (
             <div className="space-y-4">
               <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search tours..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#34a4b8] outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {filteredActivities.map(activity => {
                   const isSelected = (user.featuredActivities || []).find(a => a.id === activity.id);
                   return (
                     <div key={activity.id} onClick={() => toggleActivity(activity)} className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all hover:shadow-lg flex sm:block ${isSelected ? 'border-[#34a4b8] ring-2 ring-[#34a4b8]' : 'border-slate-200 bg-white'}`}>
                       <div className="h-24 w-24 sm:w-full sm:h-32 bg-slate-200 relative shrink-0"><img src={activity.image} className="w-full h-full object-cover" />{isSelected && <div className="absolute inset-0 bg-[#34a4b8]/80 flex items-center justify-center"><Check className="text-white" /></div>}</div>
                       <div className="p-3 flex flex-col justify-center"><h4 className="font-bold text-slate-800 text-sm line-clamp-1">{activity.title}</h4><span className="font-bold text-[#34a4b8] text-sm">${activity.price}</span></div>
                     </div>
                   );
                 })}
               </div>
             </div>
          )}
          <div className="flex justify-end"><button onClick={handlePublish} className="bg-[#34a4b8] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#268191]">PUBLISH CHANGES</button></div>
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

// ... (Academy & Earnings components same as before) ...
function Academy() { return <div className="p-4 text-center">Academy Content Here</div> }
function Earnings() { return <div className="p-4 text-center">Earnings Content Here</div> }

function Membership({ user, updateUser }) {
  const [billingCycle, setBillingCycle] = useState('year'); 
  const STRIPE_MONTHLY_URL = "https://buy.stripe.com/YOUR_ACTUAL_MONTHLY_LINK";
  const STRIPE_YEARLY_URL = "https://buy.stripe.com/YOUR_ACTUAL_YEARLY_LINK";
  const handleUpgrade = () => window.open(billingCycle === 'year' ? STRIPE_YEARLY_URL : STRIPE_MONTHLY_URL, '_blank');

  return (
    <div className="space-y-8 pb-12">
       <div className="text-center"><h2 className="text-3xl font-russo text-slate-800">Supercharge Your Earnings 🚀</h2><div className="flex justify-center mt-4"><button onClick={() => setBillingCycle('month')} className={`px-4 py-2 rounded-l-lg ${billingCycle === 'month' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>Monthly</button><button onClick={() => setBillingCycle('year')} className={`px-4 py-2 rounded-r-lg ${billingCycle === 'year' ? 'bg-[#34a4b8] text-white' : 'bg-white border'}`}>Yearly</button></div></div>
       <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-amber-400 shadow-xl text-center">
         <h3 className="text-xl font-bold text-slate-800">Elite Membership</h3>
         <div className="text-4xl font-russo text-slate-900 my-4">{billingCycle === 'year' ? '$290' : '$29'} <span className="text-sm text-slate-500">/{billingCycle}</span></div>
         <button onClick={handleUpgrade} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all">Upgrade to Elite</button>
       </div>
    </div>
  );
}

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', slug: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && !formData.name) return; 
    
    const generatedSlug = formData.name 
      ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : 'ambassador';
      
    onLogin({
      name: formData.name, // Use actual input
      email: formData.email,
      slug: generatedSlug,
      bio: 'Just a girl exploring the world, one cruise at a time.',
      joinedDate: new Date().toLocaleDateString()
    });
  };

  const scrollToForm = () => { setIsLearnMoreOpen(false); document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {isLearnMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLearnMoreOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in">
            <div className="p-6 bg-[#34a4b8] text-white flex justify-between items-center"><h3 className="font-russo text-xl">Program Details</h3><button onClick={() => setIsLearnMoreOpen(false)}><XCircle /></button></div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <p><strong>Free to Join:</strong> Sign up in seconds. No approval needed.</p>
                <p><strong>Commission:</strong> 10-12% on Activities, Up to 5% on Stays/Cruises.</p>
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
           
           {/* RESTORED BENEFITS LIST */}
           <div className="space-y-6 mb-8">
             <div className="flex items-start gap-4"><div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/10"><Palmtree size={24} className="text-white" /></div><div><h3 className="font-russo text-xl text-white">10-12% on Activities</h3><p className="text-blue-50 text-sm">Earn 10% on most tours. Get <strong>12%</strong> on Fury Water Adventures!</p></div></div>
             <div className="flex items-start gap-4"><div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/10"><Home size={24} className="text-white" /></div><div><h3 className="font-russo text-xl text-white">Up to 5% on Stays & Cruises</h3><p className="text-blue-50 text-sm">Earn up to 5% on hotels and cruises.</p></div></div>
             <div className="flex items-start gap-4"><div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/10"><Globe size={24} className="text-white" /></div><div><h3 className="font-russo text-xl text-white">Your Own Booking Page</h3><p className="text-blue-50 text-sm">Get a custom <strong>cruisytravel.com/you</strong> page to share with followers.</p></div></div>
           </div>

           <button onClick={() => setIsLearnMoreOpen(true)} className="w-full py-3 bg-white/20 border border-white/40 rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm text-sm font-bold shadow-lg"><Info size={16} /> Program Details</button>
         </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
         <div id="auth-form" className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-russo text-slate-800 text-center mb-8">{isLogin ? 'Welcome Back' : 'Join the Crew'}</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6"><button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg ${isLogin ? 'bg-white text-[#34a4b8] shadow-sm' : 'text-slate-400'}`}>Sign In</button><button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg ${!isLogin ? 'bg-white text-[#34a4b8] shadow-sm' : 'text-slate-400'}`}>Sign Up</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>}
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label><input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label><input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
              <button type="submit" className="w-full bg-[#34a4b8] text-white font-bold font-russo py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2">{isLogin ? 'ENTER PORTAL' : 'CREATE ACCOUNT'} <ArrowRight size={20} /></button>
            </form>
         </div>
      </div>
    </div>
  );
}

function DesktopNavItem({ icon, label, active, onClick, highlight }) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? (highlight ? 'bg-amber-50 text-amber-600 shadow-md shadow-amber-500/10' : 'bg-[#34a4b8] text-white shadow-md shadow-[#34a4b8]/20') : (highlight ? 'text-amber-600 hover:bg-amber-50' : 'text-slate-500 hover:bg-[#e0f4f7] hover:text-[#34a4b8]')}`}>{icon}{label}</button>;
}
