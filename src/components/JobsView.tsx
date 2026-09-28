import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight, 
  ChevronRight, 
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import { JobStatus, JobPriority } from '../types';

interface JobsViewProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ 
  isCreateModalOpen, 
  setIsCreateModalOpen 
}) => {
  const { 
    jobs, 
    clients, 
    createJob, 
    openJobDetail 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formClientId, setFormClientId] = useState(clients[0]?.id || '');
  const [formAddress, setFormAddress] = useState('');
  const [formDate, setFormDate] = useState('2026-09-29');
  const [formTime, setFormTime] = useState('09:00 AM');
  const [formPriority, setFormPriority] = useState<JobPriority>('Medium');
  const [formSystemType, setFormSystemType] = useState('Commercial HVAC Package Unit');
  const [formDesc, setFormDesc] = useState('');
  const [formTech, setFormTech] = useState('Alex Reynolds (Senior Lead)');

  const statuses: string[] = ['All', 'In Progress', 'Scheduled', 'Completed', 'Pending Review'];
  const priorities: string[] = ['All', 'Emergency', 'High', 'Medium', 'Low'];

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = selectedStatus === 'All' || job.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || job.priority === selectedPriority;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.siteAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    createJob({
      title: formTitle.trim(),
      clientId: formClientId || clients[0]?.id,
      siteAddress: formAddress.trim() || 'Facility Location On File',
      scheduledDate: formDate,
      scheduledTime: formTime,
      priority: formPriority,
      systemType: formSystemType,
      description: formDesc.trim() || 'Standard diagnostic inspection and service maintenance ticket.',
      assignedTechnician: formTech,
    });

    setIsCreateModalOpen(false);
    setFormTitle('');
    setFormDesc('');
    setFormAddress('');
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'In Progress':
        return <span className="text-blue-600 font-semibold">In Progress</span>;
      case 'Scheduled':
        return <span className="text-amber-600 font-semibold">Scheduled</span>;
      case 'Completed':
        return <span className="text-emerald-600 font-semibold">Completed</span>;
      case 'Pending Review':
        return <span className="text-purple-600 font-semibold">Pending Review</span>;
      default:
        return <span className="text-slate-600">{status}</span>;
    }
  };

  const getPriorityStyle = (priority: JobPriority) => {
    switch (priority) {
      case 'Emergency':
        return 'text-rose-600 font-bold';
      case 'High':
        return 'text-amber-600 font-semibold';
      case 'Medium':
        return 'text-blue-600 font-medium';
      case 'Low':
        return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>DISPATCH & WORK ORDERS · SHIFT TICKETS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Job Management
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Monitor real-time job tickets, review pre-job safety checklists, log diagnostic readings, and attach voice consultation action items.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by job #, client, address, or equipment..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedStatus === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Priority dropdown */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Jobs List / Table Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => openJobDetail(job.id)}
              className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <span className="font-mono font-bold text-slate-900">{job.jobNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{getStatusBadge(job.status)}</span>
                  <span aria-hidden="true">·</span>
                  <span className={getPriorityStyle(job.priority)}>
                    {job.priority} Priority
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{job.systemType}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-1 mb-2.5">
                  {job.description}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.clientName} ({job.clientCompany})</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 truncate max-w-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.siteAddress}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">
                    {job.notes.length} notes · {job.photos.length} photos
                  </span>
                </div>
              </div>

              {/* Right Schedule & CTA */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="flex items-center lg:justify-end gap-1.5 text-xs font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{job.scheduledDate}</span>
                  </div>
                  <div className="flex items-center lg:justify-end gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{job.scheduledTime} · {job.estimatedDuration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No jobs match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try clearing your search filters or create a new job ticket.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('All');
                  setSelectedPriority('All');
                }}
                className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Create New Job Ticket</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Cleanroom Blower Motor Bearing Replacement"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Client *</label>
                  <select
                    value={formClientId}
                    onChange={e => setFormClientId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as JobPriority)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Site / Equipment Address *</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  placeholder="e.g. 1020 Server Way, Penthouse Mechanical Room C"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">System / Equipment Specification</label>
                <input
                  type="text"
                  value={formSystemType}
                  onChange={e => setFormSystemType(e.target.value)}
                  placeholder="e.g. Carrier 25-Ton RTU or Danfoss FC-102 VFD"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Job Description & Symptoms</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Initial reported symptoms, error codes, and work scope..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Create Job Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
