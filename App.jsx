import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  MessageSquare, 
  Users, 
  Signal, 
  Navigation, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Radio,
  Settings,
  Activity,
  Compass,
  Layers,
  Crosshair,
  Satellite,
  Menu,
  ChevronRight,
  RefreshCw,
  PhoneCall,
  User,
  Lock,
  Mail,
  LogOut,
  Database,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  TrendingUp,
  FileText,
  Milestone,
  Zap,
  ArrowUpRight,
  Flag,
  UserX,
  Truck
} from 'lucide-react';

// --- 基础配置 ---
const BAIDU_MAP_AK = '3ea5Wv7weMFJgWwn5qYZUIah1HDpdDFE';
const TARGET_LOST_POS = { lng: 112.436611, lat: 38.023205 };

const INITIAL_RESCUE_TEAMS = [
  { id: 'T-01', name: '蓝天搜救队 (校本部)', status: 'ready', members: 5, pos: { lat: 38.012, lng: 112.441 }, alt: 780, speed: 12.5, equipment: '北斗手持机, 担架' },
  { id: 'T-02', name: '空中救援 (二龙山)', status: 'hover', members: 2, pos: { lat: 38.022, lng: 112.452 }, alt: 1150, speed: 0.8, equipment: '直升机, 索降设备' },
  { id: 'T-03', name: '突击小组 (柏板乡)', status: 'ready', members: 8, pos: { lat: 38.005, lng: 112.432 }, alt: 820, speed: 0, equipment: '应急电源, 卫通终端' },
];

// --- 辅助小组件 ---

const NavBtn = ({ active, onClick, icon, label, color = 'bg-blue-600' }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? `${color} text-white shadow-xl shadow-blue-600/20` : 'text-slate-400 hover:bg-white/5'}`}>
    {icon}
    <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const MetricCard = ({ label, value }) => (
  <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
    <p className="text-[8px] text-slate-600 uppercase mb-1 font-black">{label}</p>
    <div className="font-mono text-[11px] font-bold text-slate-200 truncate">{String(value)}</div>
  </div>
);

// --- 子模块组件 ---

// 1. 登录页面
const AuthPage = ({ onAuth }) => {
  const [u, setU] = useState('');
  return (
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center font-sans overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="w-full max-md:max-w-xs max-w-md p-10 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 text-center">
        <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-6 shadow-xl shadow-blue-500/20">
          <Satellite size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">北斗应急指挥系统</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] italic mb-10">BDS-3 Protocol & Baidu Map GL</p>
        <form onSubmit={(e) => { e.preventDefault(); onAuth(u || 'NUC-ADMIN'); }} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">操作员编号</label>
            <input type="text" value={u} onChange={(e) => setU(e.target.value)} required placeholder="NUC-ADMIN-01" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">访问口令密钥</label>
            <input type="password" required placeholder="••••••••" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-mono" />
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all">进入实战系统</button>
        </form>
      </div>
    </div>
  );
};

// 2. 数据管理中心
const DataManagement = ({ messages, rescueTeams }) => {
  const [activeTab, setActiveTab] = useState('messages');
  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-slate-950 animate-in fade-in duration-500">
      <header className="mb-6 flex justify-between items-end shrink-0 text-white">
        <div><h1 className="text-2xl font-black uppercase tracking-tight">北斗数据审计中心</h1><p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest font-mono">BDS Log & Inventory</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all"><Download size={14}/> 导出 SOS 通讯志</button>
      </header>
      <div className="flex-1 bg-slate-900 border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex border-b border-white/5 px-2 bg-slate-900/50">
           <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'border-b-2 border-blue-500 text-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}>消息流审计</button>
           <button onClick={() => setActiveTab('resources')} className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}>救援力量台账</button>
        </div>
        <div className="flex-1 overflow-auto p-6 font-mono">
           {activeTab === 'messages' ? (
             <table className="w-full text-left text-[10px] border-separate border-spacing-y-2">
               <thead><tr className="text-slate-500 font-bold uppercase tracking-widest"><th className="px-4 py-2">时间</th><th className="px-4 py-2">单位 ID</th><th className="px-4 py-2">报文原文内容</th></tr></thead>
               <tbody>{messages.map(m => (
                   <tr key={m.id} className="bg-white/5 hover:bg-white/10 transition-colors"><td className="px-4 py-3 rounded-l-xl text-slate-500">{m.time}</td><td className="px-4 py-3 font-bold text-blue-400 uppercase">{m.sender}</td><td className="px-4 py-3 text-slate-300 italic rounded-r-xl">"{m.content}"</td></tr>
                 ))}</tbody>
             </table>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {rescueTeams.map(t => (
                 <div key={t.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group transition-all hover:border-blue-500/30 shadow-inner">
                   <div className="space-y-2">
                     <p className="font-bold text-sm text-blue-400 uppercase tracking-tight">{t.name}</p>
                     <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold"><Settings size={12}/> {t.equipment}</div>
                   </div>
                   <div className="flex flex-col items-end gap-1 shrink-0"><span className="text-[9px] font-bold px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 uppercase">{t.status}</span><span className="text-[8px] text-slate-600">编制: {t.members}人</span></div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// 3. 指挥中心主视图
const CommandDashboard = ({ messages, selectedUnit, setSelectedUnit, onReply, mapLoaded, ticker, user, rescueTeams, onStartNav }) => {
  const mapRef = useRef(null);
  const bmapInstance = useRef(null);
  const walkingRouteRef = useRef(null);
  const [replyInput, setReplyInput] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [isPlanning, setIsPlanning] = useState(false);

  useEffect(() => {
    if (mapLoaded && mapRef.current && !bmapInstance.current) {
      const BMapGL = window.BMapGL;
      const map = new BMapGL.Map(mapRef.current);
      map.centerAndZoom(new BMapGL.Point(TARGET_LOST_POS.lng, TARGET_LOST_POS.lat), 16);
      map.enableScrollWheelZoom(true);
      map.setTilt(50);
      map.setMapStyleV2({ styleId: '40f3174246062f260388d7285514f77c' });
      bmapInstance.current = map;
    }
  }, [mapLoaded]);

  const planRouteToPoint = (startPoint, endPoint, teamName, teamId) => {
    if (!bmapInstance.current || !window.BMapGL) return;
    
    setIsPlanning(true);
    const BMapGL = window.BMapGL;
    const map = bmapInstance.current;
    if (walkingRouteRef.current) walkingRouteRef.current.clearResults();
    map.clearOverlays();
    
    const walking = new BMapGL.WalkingRoute(map, {
      renderOptions: { map: map, autoViewport: true, highlightMode: true },
      onSearchComplete: (results) => {
        if (walking.getStatus() === 0) {
          const plan = results.getPlan(0);
          setRouteInfo({
            distance: plan.getDistance(true),
            duration: plan.getDuration(true),
            teamName: teamName,
            teamId: teamId,
            targetPos: { lng: endPoint.lng, lat: endPoint.lat }
          });
        }
        setIsPlanning(false);
      }
    });
    
    walkingRouteRef.current = walking;
    walking.search(startPoint, endPoint);
  };

  const reDrawMarkers = () => {
    const map = bmapInstance.current;
    const BMapGL = window.BMapGL;
    if (!map || !BMapGL) return;
    if (isPlanning) return;

    messages.filter(m => m.type === 'SOS' && m.location).forEach(msg => {
      const pt = new BMapGL.Point(msg.location.lng, msg.location.lat);
      const marker = new BMapGL.Marker(pt);
      marker.addEventListener('click', () => {
        setSelectedUnit(msg);
        if (selectedUnit && String(selectedUnit.id).startsWith('T-')) {
          const startPt = new BMapGL.Point(selectedUnit.pos.lng, selectedUnit.pos.lat);
          planRouteToPoint(startPt, pt, selectedUnit.name, selectedUnit.id);
        }
      });
      map.addOverlay(marker);
      const label = new BMapGL.Label(`SOS: ${msg.sender}`, { offset: new BMapGL.Size(20, -10) });
      label.setStyle({ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' });
      marker.setLabel(label);
    });

    rescueTeams.forEach(team => {
      const pt = new BMapGL.Point(team.pos.lng, team.pos.lat);
      const marker = new BMapGL.Marker(pt);
      marker.addEventListener('click', () => setSelectedUnit(team));
      map.addOverlay(marker);
      const label = new BMapGL.Label(team.name, { offset: new BMapGL.Size(20, -10) });
      label.setStyle({ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '2px', fontSize: '10px' });
      marker.setLabel(label);
    });
  };

  useEffect(() => {
    if (bmapInstance.current && !isPlanning && !routeInfo) reDrawMarkers();
  }, [messages, rescueTeams, ticker, mapLoaded, selectedUnit]);

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="p-4 bg-slate-900 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex flex-col"><span className="text-[10px] text-blue-500 font-black uppercase">Command Dashboard</span><span className="text-sm font-bold">中北大学 · 战术指挥中心</span></div>
        <div className="flex gap-4 border-l border-white/10 pl-4 items-center">
           <span className="text-[10px] font-mono text-green-500">BD-GL_3.0 READY</span>
           <span className="text-xs font-bold text-slate-400">OP: {user?.name}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-slate-950">
          <div ref={mapRef} className="w-full h-full" />
          {routeInfo && (
            <div className="absolute top-4 left-4 z-20 animate-in slide-in-from-top duration-500">
               <div className="bg-slate-900/95 backdrop-blur-md border-l-4 border-blue-500 p-4 rounded-xl shadow-2xl space-y-3 min-w-[260px] border border-white/5">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase"><Milestone size={14} /> 救援规划已就绪</div>
                  <div className="space-y-1">
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">目标分队: {routeInfo.teamName}</p>
                     <div className="flex justify-between items-end border-t border-white/5 pt-2">
                        <div><span className="text-[8px] text-slate-500 block">距离</span><span className="text-xl font-black text-white">{routeInfo.distance}</span></div>
                        <div className="text-right"><span className="text-[8px] text-slate-500 block">ETA</span><span className="text-xs text-blue-400 font-bold">{routeInfo.duration}</span></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                     <button onClick={() => { setRouteInfo(null); bmapInstance.current.clearOverlays(); setIsPlanning(false); reDrawMarkers(); }} className="py-2 text-[9px] bg-white/5 hover:bg-white/10 rounded-lg font-bold text-slate-500 uppercase">取消</button>
                     <button onClick={() => onStartNav(routeInfo)} className="py-2 text-[9px] bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-all">
                        <Navigation size={12} /> 执行导航
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="w-80 lg:w-96 bg-slate-900 border-l border-white/5 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 bg-slate-800/20 flex items-center justify-between font-bold text-xs uppercase tracking-widest"><div className="flex items-center gap-2 text-blue-500"><Activity size={16}/> 动态遥测监控</div></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedUnit ? (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 shadow-inner"><p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">链路监控目标</p><p className="text-lg font-black text-blue-400 uppercase tracking-tight">{selectedUnit.name || selectedUnit.sender}</p></div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <MetricCard label="纬度 (LAT)" value={(selectedUnit.location?.lat || selectedUnit.pos?.lat || 0).toFixed(6)} />
                  <MetricCard label="经度 (LNG)" value={(selectedUnit.location?.lng || selectedUnit.pos?.lng || 0).toFixed(6)} />
                  <MetricCard label="高度 (ALT)" value={(selectedUnit.location?.alt || selectedUnit.alt || 0).toFixed(1) + 'm'} />
                  <MetricCard label="当前状态" value={selectedUnit.status || '紧急信号'} />
                </div>
                <div className="space-y-3 pt-2">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">下发北斗短报文</p>
                   <textarea value={replyInput} onChange={(e) => setReplyInput(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none h-20 resize-none transition-all placeholder:text-slate-800" placeholder="下发指挥部指令内容..." />
                   <button onClick={() => { onReply(selectedUnit.sender || selectedUnit.id, replyInput || '指挥中心已收到位置。救援队正在接近，保持开启北斗。'); setReplyInput(''); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"><Send size={14}/> 发送报文</button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10"><Crosshair size={40} className="mb-4 text-slate-500" /><p className="text-xs">点击地图标记以锁定链路</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. 通用终端仿真 (支持对话角色分边显示)
const TerminalEmulator = ({ role, teamId, onSend, isSending, allMessages, ticker, navData, onCancelNav }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);
  const isVictim = role === 'victim';
  
  // 核心角色标识
  const myId = isVictim ? 'NUC-STU-08' : (teamId || 'RESCUE-T01');

  const conversation = useMemo(() => {
    // 过滤与当前终端相关的消息
    return allMessages.filter(m => 
      m.receiver === 'CENTER' || m.sender === 'CENTER' || m.sender === myId || m.receiver === myId
    ).sort((a, b) => a.id - b.id);
  }, [allMessages, myId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversation]);

  const livePos = useMemo(() => {
    const base = isVictim ? TARGET_LOST_POS : INITIAL_RESCUE_TEAMS.find(t => t.id === teamId)?.pos || { lat: 38.01, lng: 112.44 };
    return {
      lat: base.lat + (Math.sin(ticker*0.1) * 0.0002),
      lng: base.lng + (Math.cos(ticker*0.1) * 0.0002),
      alt: isVictim ? 845 + Math.sin(ticker) * 2 : 780 + Math.cos(ticker)
    };
  }, [ticker, isVictim, teamId]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className={`w-80 h-[640px] bg-slate-800 rounded-[3.5rem] border-x-[12px] border-y-[8px] ${isVictim ? 'border-slate-700' : 'border-blue-900/50 shadow-[0_0_50px_rgba(37,99,235,0.2)]'} shadow-2xl relative flex flex-col`}>
        <div className="h-8 flex justify-between items-end px-8 text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <span>{new Date().getHours().toString().padStart(2,'0')}:{new Date().getMinutes().toString().padStart(2,'0')}</span>
          <div className="flex items-center gap-1 font-mono text-green-500"><span>BDS-3</span><Signal size={12} /></div>
        </div>
        
        <div className="flex-1 bg-[#0d1117] m-3 rounded-[1.5rem] border border-slate-900 flex flex-col overflow-hidden relative shadow-inner">
          {/* 导航条 */}
          {!isVictim && navData && (
             <div className="bg-blue-600 p-3 flex flex-col gap-1.5 animate-in slide-in-from-top duration-500 shadow-lg shrink-0">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-white font-black uppercase text-[10px]"><Navigation size={14} className="animate-pulse" /><span>战术导航激活</span></div><button onClick={onCancelNav} className="text-[7px] bg-black/20 px-1.5 py-0.5 rounded text-white font-bold">退出</button></div>
                <div className="flex justify-between items-center text-white"><div className="flex gap-2 items-center"><ArrowUpRight size={24} className="animate-bounce" /><div><p className="text-[14px] font-black leading-none">{navData.distance}</p><p className="text-[7px] uppercase font-bold opacity-70">距离遇难者</p></div></div><div className="text-right"><p className="text-[12px] font-bold leading-none">{navData.duration}</p><p className="text-[7px] uppercase font-bold opacity-70">预计到达</p></div></div>
             </div>
          )}

          <div className="bg-slate-800/80 p-3 flex justify-between items-center border-b border-slate-700 shrink-0">
            <div className={`flex items-center gap-2 ${isVictim ? 'text-blue-400' : 'text-green-400'} font-bold uppercase text-[9px]`}>
               <Compass size={14} className={isSending ? "animate-spin" : "animate-pulse"} />
               <span>{isVictim ? '遇难者手持终端' : '搜救队移动台'}</span>
            </div>
            <div className="text-[7px] text-slate-500 font-mono tracking-tighter">ID: {myId}</div>
          </div>
          
          <div className="grid grid-cols-2 bg-slate-950/80 border-b border-slate-800 backdrop-blur-sm font-mono shrink-0">
            <div className="p-2 border-r border-slate-800 text-center"><span className="text-[7px] text-slate-600 block uppercase font-black">Lat</span><span className="text-[10px] font-bold text-blue-300">{livePos.lat.toFixed(6)}</span></div>
            <div className="p-2 text-center"><span className="text-[7px] text-slate-600 block uppercase font-black">Lng</span><span className="text-[10px] font-bold text-blue-300">{livePos.lng.toFixed(6)}</span></div>
          </div>

          {/* 核心改动：消息角色分边渲染 */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col font-mono scrollbar-hide">
             {conversation.map(m => {
               const isMe = m.sender === myId;
               return (
                 <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[10px] leading-relaxed shadow-lg ${
                      isMe 
                      ? (isVictim ? 'bg-blue-600' : 'bg-green-700') + ' text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
                    }`}>
                      {m.content}
                    </div>
                    <span className="text-[6px] text-slate-600 mt-1 uppercase font-bold tracking-tighter px-1">
                      {isMe ? '本机发送' : (m.sender === 'CENTER' ? '指挥中心' : m.sender)} · {m.time.split(' ').pop()}
                    </span>
                 </div>
               );
             })}
             {isSending && <div className="flex flex-col items-center justify-center py-6 animate-pulse text-blue-500"><Zap size={20} className="mb-2" /><p className="text-[8px] font-black uppercase text-center tracking-widest">Uplinking...</p></div>}
          </div>

          <div className="p-3 space-y-2 bg-slate-900 border-t border-slate-800 shrink-0">
             <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isSending} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-[11px] text-white h-16 resize-none outline-none focus:border-blue-500 font-mono disabled:opacity-50" placeholder="在此输入短报文内容..." />
             <div className="flex gap-2">
                <button onClick={() => { onSend({ sender: myId, type: 'CHAT', content: inputText, location: livePos }); setInputText(''); }} disabled={isSending || !inputText} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl flex justify-center active:scale-95 transition-all shadow-inner"><Send size={18}/></button>
                {isVictim && <button onClick={() => onSend({ sender: myId, type: 'SOS', content: 'SOS：紧急伤情，请求方位核实与快速救援规划！', location: livePos })} disabled={isSending} className="px-6 bg-red-600 hover:bg-red-500 py-3 rounded-xl flex flex-col items-center shadow-lg text-[9px] font-black uppercase text-white active:scale-95 transition-all"><AlertTriangle size={18} className="mb-0.5" />SOS</button>}
             </div>
          </div>
        </div>
        <div className="h-16 flex items-center justify-center gap-8 px-8 opacity-40 pointer-events-none"><div className="w-10 h-10 rounded-full bg-slate-700 border-t border-slate-500 flex items-center justify-center shadow-inner"><Menu size={16} /></div><div className="w-12 h-12 rounded-full bg-slate-600 border-4 border-slate-700 shadow-xl"></div><div className="w-10 h-10 rounded-full bg-slate-700 border-t border-slate-500 flex items-center justify-center shadow-inner"><ChevronRight size={16} /></div></div>
      </div>
    </div>
  );
};

// --- 主程序入口 ---

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [navData, setNavData] = useState(null); 
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'NUC-STU-08',
      receiver: 'CENTER',
      type: 'SOS',
      content: '紧急求助：发生意外，目前受困于中北大学二龙山北侧，请求支援！',
      location: { ...TARGET_LOST_POS, alt: 845.0 },
      time: '2025-12-18 21:30:05',
      status: 'pending'
    }
  ]);

  const [rescueTeams, setRescueTeams] = useState(INITIAL_RESCUE_TEAMS);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isLinkBusy, setIsLinkBusy] = useState(false); 
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    if (isLoggedIn) setSelectedUnit(messages[0]);
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !window.BMapGL) {
      window.initBMap = () => setMapLoaded(true);
      const script = document.createElement('script');
      script.src = `https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${BAIDU_MAP_AK}&callback=initBMap`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 2000);
    return () => clearInterval(timer);
  }, []);

  const handleStartNav = (data) => {
    setNavData(data);
    setActiveView('rescue_terminal'); 
  };

  const handleAuth = (username) => {
    setCurrentUser({ name: username || '管理员' });
    setIsLoggedIn(true);
  };

  const handleTerminalSend = (msgData) => {
    setIsLinkBusy(true);
    setTimeout(() => {
      const newMessage = { 
        id: Date.now(), 
        receiver: 'CENTER', 
        status: 'pending', 
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }), 
        ...msgData 
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLinkBusy(false);
    }, 1200);
  };

  const handleCenterReply = (receiverId, content) => {
    setIsLinkBusy(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'CENTER', receiver: receiverId, type: 'COMMAND', content, time: new Date().toLocaleString('zh-CN', { hour12: false }), status: 'delivered' }]);
      setIsLinkBusy(false);
    }, 1000);
  };

  if (!isLoggedIn) return <AuthPage onAuth={handleAuth} />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <aside className="w-16 lg:w-60 bg-slate-900 border-r border-white/5 flex flex-col z-50 shadow-2xl">
        <div className="p-6 flex items-center gap-3 shrink-0"><div className="p-2 bg-blue-600 rounded-lg"><Satellite size={20} className="text-white" /></div><span className="hidden lg:block font-black text-[11px] tracking-widest uppercase">BDS · COMMAND</span></div>
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <NavBtn active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<MapIcon size={18}/>} label="指挥调度台" />
          <div className="h-px bg-white/5 mx-2 my-2 opacity-30"></div>
          <NavBtn active={activeView === 'rescue_terminal'} onClick={() => setActiveView('rescue_terminal')} icon={<Truck size={18}/>} label="救援队终端" color="bg-green-700" />
          <NavBtn active={activeView === 'victim_terminal'} onClick={() => setActiveView('victim_terminal')} icon={<UserX size={18}/>} label="遇难者终端" color="bg-red-700" />
          <div className="h-px bg-white/5 mx-2 my-2 opacity-30"></div>
          <NavBtn active={activeView === 'data_mgmt'} onClick={() => setActiveView('data_mgmt')} icon={<Database size={18}/>} label="数据管理" />
        </nav>
        <div className="p-4 border-t border-white/5 space-y-4 shrink-0 text-center">
           <div className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-2">Security Status</div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-2 text-slate-500 hover:text-red-400 transition-all text-[10px] font-black uppercase px-2"><LogOut size={14} /><span className="hidden lg:block">退出指挥系统</span></button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
        {activeView === 'dashboard' ? (
          <CommandDashboard messages={messages} selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} onReply={handleCenterReply} mapLoaded={mapLoaded} ticker={ticker} user={currentUser} rescueTeams={rescueTeams} onStartNav={handleStartNav} />
        ) : activeView === 'victim_terminal' ? (
          <TerminalEmulator role="victim" onSend={handleTerminalSend} isSending={isLinkBusy} allMessages={messages} ticker={ticker} />
        ) : activeView === 'rescue_terminal' ? (
          <TerminalEmulator role="rescue" teamId={navData?.teamId || 'T-01'} onSend={handleTerminalSend} isSending={isLinkBusy} allMessages={messages} ticker={ticker} navData={navData} onCancelNav={() => setNavData(null)} />
        ) : (
          <DataManagement messages={messages} rescueTeams={rescueTeams} />
        )}
      </main>
    </div>
  );
};

export default App;