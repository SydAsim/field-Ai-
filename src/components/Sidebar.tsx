import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Mic, 
  BookOpen, 
  Briefcase, 
  Users, 
  MessageSquareShare, 
  PhoneCall, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { ActivePage } from '../types';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, activeCall, startCall, jobs, whatsAppConversations, resetDemoData } = useApp();

  const activeJobsCount = jobs.filter(j => j.status === 'In Progress' || j.status === 'Scheduled').length;
  const unreadMessagesCount = whatsAppConversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'assistant',
      label: 'AI Voice Assistant',
      icon: <Mic className="w-4 h-4" />,
      badge: activeCall.isOngoing ? 'LIVE' : undefined,
    },
    {
      id: 'knowledge',
      label: 'Knowledge Library',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'jobs',
      label: 'Job Management',
      icon: <Briefcase className="w-4 h-4" />,
      badge: activeJobsCount > 0 ? activeJobsCount : undefined,
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: <MessageSquareShare className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActivePage('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">FieldAssist AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Field Intelligence OS</p>
          </div>
        </div>
      </div>

      {/* Live Call Bar if Active */}
      {activeCall.isOngoing && (
        <div 
          onClick={() => setActivePage('assistant')}
          className="mx-3 my-2.5 p-3 rounded-lg bg-blue-950/80 border border-blue-500/30 text-white cursor-pointer hover:bg-blue-900/80 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-200">Call Connected</span>
            </div>
            <span className="text-xs font-mono tabular-nums text-blue-300">
              {Math.floor(activeCall.durationSeconds / 60).toString().padStart(2, '0')}:
              {(activeCall.durationSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 truncate">Tap to return to voice session</p>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map(item => {
          const isActive = activePage === item.id || (item.id === 'jobs' && activePage === 'job-detail');
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    item.badge === 'LIVE'
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : isActive
                      ? 'bg-blue-800 text-blue-100'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Voice Consultation CTA */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-750">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Field Voice</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Ask safety guidelines, wiring charts, or fault code lookups on site.
            </p>
            {!activeCall.isOngoing ? (
              <button
                onClick={() => {
                  startCall();
                  setActivePage('assistant');
                }}
                className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Start AI Call</span>
              </button>
            ) : (
              <button
                onClick={() => setActivePage('assistant')}
                className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>View Live Call</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Technician Profile & Reset footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white">
              AR
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Alex Reynolds</div>
              <div className="text-[11px] text-slate-400 truncate">Senior Lead Tech</div>
            </div>
          </div>
          <button
            onClick={resetDemoData}
            title="Reset prototype demo data"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Knowledge Base Synced</span>
          </div>
          <span className="font-mono">v1.2 MVP</span>
        </div>
      </div>
    </aside>
  );
};
