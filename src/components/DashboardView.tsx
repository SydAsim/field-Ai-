import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  Plus, 
  UserPlus, 
  Briefcase, 
  Users, 
  Mic, 
  Clock, 
  ArrowUpRight, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DashboardViewProps {
  onOpenCreateJob: () => void;
  onOpenAddClient: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenCreateJob, 
  onOpenAddClient 
}) => {
  const { 
    jobs, 
    clients, 
    callLogs, 
    startCall, 
    setActivePage, 
    openJobDetail 
  } = useApp();

  const totalJobs = jobs.length;
  const activeClients = clients.filter(c => c.activeJobsCount > 0).length;
  const callsCompleted = callLogs.length;

  const inProgressJobs = jobs.filter(j => j.status === 'In Progress');
  const recentJobs = jobs.slice(0, 4);
  const recentCalls = callLogs.slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>FIELD SERVICE UNIT #4 · CHICAGO METRO REGION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Good morning, Alex
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            You have <strong className="text-white font-semibold">{inProgressJobs.length} active service call</strong> in progress and 2 scheduled for this afternoon. FieldAssist AI is standing by with your equipment library.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              startCall();
              setActivePage('assistant');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Start AI Call</span>
          </button>
          <button
            onClick={onOpenCreateJob}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
          <button
            onClick={onOpenAddClient}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div 
          onClick={() => setActivePage('jobs')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalJobs}</span>
            <span className="text-xs text-emerald-600 font-medium">+2 this week</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>{jobs.filter(j => j.status === 'Completed').length} completed</span>
            <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Active Clients */}
        <div 
          onClick={() => setActivePage('clients')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Active Clients</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{activeClients}</span>
            <span className="text-xs text-slate-500">of {clients.length} total</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>100% SLA compliance</span>
            <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Manage <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* AI Calls Completed */}
        <div 
          onClick={() => setActivePage('assistant')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">AI Calls Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{callsCompleted}</span>
            <span className="text-xs text-emerald-600 font-medium">100% resolved</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Avg duration 3m 15s</span>
            <span className="text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Assistant <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Safety & Knowledge Sync */}
        <div 
          onClick={() => setActivePage('knowledge')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Safety & Procedures</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">5</span>
            <span className="text-xs text-slate-500">Core Manuals</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> LOTO Verified
            </span>
            <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Library <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Job Activity & Recent AI Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Job Activity (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Job Activity</h2>
              <p className="text-xs text-slate-500">Live operational field tickets assigned to your shift</p>
            </div>
            <button
              onClick={() => setActivePage('jobs')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentJobs.map(job => (
              <div
                key={job.id}
                onClick={() => openJobDetail(job.id)}
                className="py-3.5 px-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono text-slate-900 font-semibold">{job.jobNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{job.clientCompany}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-medium ${
                      job.status === 'In Progress' ? 'text-blue-600' :
                      job.status === 'Completed' ? 'text-emerald-600' :
                      job.status === 'Scheduled' ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {job.siteAddress}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right text-[11px]">
                    <div className="text-slate-700 font-medium">{job.scheduledDate}</div>
                    <div className="text-slate-500 font-mono">{job.scheduledTime}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Assistant Conversations (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent AI Calls</h2>
              <p className="text-xs text-slate-500">Field voice consultations & summaries</p>
            </div>
            <button
              onClick={() => setActivePage('assistant')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentCalls.map(call => (
              <div
                key={call.id}
                onClick={() => setActivePage('assistant')}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-medium text-slate-700">{call.time}</span>
                  <span className="font-mono tabular-nums text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {call.duration}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                  {call.topic}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {call.summary.overview}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              startCall();
              setActivePage('assistant');
            }}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-blue-400" />
            <span>Launch New Voice Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
