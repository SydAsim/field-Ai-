import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  PhoneOff, 
  Plus, 
  Search, 
  Calendar,
  Sparkles,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  onOpenCreateJob?: () => void;
  onOpenAddClient?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMobileMenuToggle, 
  onOpenCreateJob, 
  onOpenAddClient 
}) => {
  const { 
    activePage, 
    setActivePage, 
    activeCall, 
    startCall, 
    endCall, 
    selectedJob 
  } = useApp();

  const getBreadcrumb = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Overview';
      case 'assistant':
        return 'AI Voice Assistant';
      case 'knowledge':
        return 'Knowledge Library';
      case 'jobs':
        return 'Job Management';
      case 'job-detail':
        return selectedJob ? `Jobs / ${selectedJob.jobNumber}` : 'Job Details';
      case 'clients':
        return 'Clients';
      case 'communications':
        return 'Communications / WhatsApp & Twilio';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium hidden sm:inline">FieldAssist</span>
          <span className="text-slate-400 hidden sm:inline">/</span>
          <span className="text-slate-900 font-semibold">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Zone 2: Fast actions & status */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 mr-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Monday, Sep 28, 2026</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Dispatcher Online
          </span>
        </div>

        {/* Quick Create Buttons if on dashboard or jobs */}
        {onOpenCreateJob && (
          <button
            onClick={onOpenCreateJob}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>New Job</span>
          </button>
        )}

        {/* AI Voice Assistant CTA */}
        {activeCall.isOngoing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('assistant')}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="font-mono tabular-nums font-semibold">
                {Math.floor(activeCall.durationSeconds / 60).toString().padStart(2, '0')}:
                {(activeCall.durationSeconds % 60).toString().padStart(2, '0')}
              </span>
            </button>
            <button
              onClick={() => endCall()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End Call</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              startCall();
              setActivePage('assistant');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start AI Call</span>
          </button>
        )}
      </div>
    </header>
  );
};
