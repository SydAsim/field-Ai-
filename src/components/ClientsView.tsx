import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Briefcase, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  ExternalLink,
  MessageSquareShare
} from 'lucide-react';
import { Client } from '../types';

interface ClientsViewProps {
  isAddClientModalOpen: boolean;
  setIsAddClientModalOpen: (open: boolean) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ 
  isAddClientModalOpen, 
  setIsAddClientModalOpen 
}) => {
  const { 
    clients, 
    createClient, 
    jobs, 
    openJobDetail, 
    setActivePage 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientForModal, setSelectedClientForModal] = useState<Client | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formSlaTier, setFormSlaTier] = useState<Client['slaTier']>('Priority Commercial');
  const [formNotes, setFormNotes] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim()) return;

    createClient({
      name: formName.trim(),
      company: formCompany.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@${formCompany.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: formPhone.trim() || '+1 (555) 000-1234',
      address: formAddress.trim() || 'Facility Address on Record',
      slaTier: formSlaTier,
      notes: formNotes.trim(),
    });

    setIsAddClientModalOpen(false);
    setFormName('');
    setFormCompany('');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormNotes('');
  };

  const getClientJobs = (clientId: string) => {
    return jobs.filter(j => j.clientId === clientId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>CLIENT DIRECTORY · FACILITY ACCOUNTS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Client Management
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Manage commercial accounts, facility badge protocols, emergency SLAs, and communication history linked to service jobs.
          </p>
        </div>

        <button
          onClick={() => setIsAddClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by client name, company, phone, or location..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          {filteredClients.length} accounts found
        </span>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map(client => {
          const clientJobs = getClientJobs(client.id);
          return (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header with avatar & SLA badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                      {client.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {client.name}
                      </h3>
                      <div className="text-xs text-slate-600 font-medium flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{client.company}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-blue-600">
                    {client.slaTier}
                  </span>
                </div>

                {/* Contact Information */}
                <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{client.address}</span>
                  </div>
                </div>

                {/* Access Protocol Notes */}
                {client.notes && (
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-600 line-clamp-2">
                    <strong className="text-slate-800 font-semibold block">Site Access:</strong>
                    {client.notes}
                  </div>
                )}
              </div>

              {/* Bottom Footer with associated jobs count and View button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {clientJobs.length} associated {clientJobs.length === 1 ? 'job' : 'jobs'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClientForModal(client)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredClients.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No clients match "{searchQuery}"</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or register a new facility contact.</p>
          </div>
        )}
      </div>

      {/* Client Details Drawer / Modal */}
      {selectedClientForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  {selectedClientForModal.avatarInitials}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{selectedClientForModal.name}</h3>
                  <p className="text-xs text-slate-400">{selectedClientForModal.company} · {selectedClientForModal.slaTier}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Contact information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Phone Number</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedClientForModal.phone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Email Address</span>
                  <span className="font-bold text-slate-900 font-mono truncate block">{selectedClientForModal.email}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Facility Street Address</span>
                  <span className="font-medium text-slate-900">{selectedClientForModal.address}</span>
                </div>
              </div>

              {/* Special Site Protocol */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Site Access & Security Protocol
                </h4>
                <p className="text-slate-600 bg-amber-50/60 border border-amber-200/80 p-3 rounded-lg leading-relaxed">
                  {selectedClientForModal.notes || 'No special clearance required. Standard badge check-in at front desk.'}
                </p>
              </div>

              {/* Associated Jobs */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Associated Service Jobs ({getClientJobs(selectedClientForModal.id).length})</span>
                </h4>
                <div className="space-y-2">
                  {getClientJobs(selectedClientForModal.id).map(job => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedClientForModal(null);
                        openJobDetail(job.id);
                      }}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                          <span className="font-mono font-bold text-slate-900">{job.jobNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-medium ${
                            job.status === 'In Progress' ? 'text-blue-600' :
                            job.status === 'Completed' ? 'text-emerald-600' : 'text-slate-600'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <h5 className="font-semibold text-slate-900">{job.title}</h5>
                      </div>
                      <span className="text-blue-600 font-semibold flex items-center gap-1 text-[11px]">
                        Open <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  ))}

                  {getClientJobs(selectedClientForModal.id).length === 0 && (
                    <p className="text-slate-500 text-xs italic">No active or historical jobs recorded for this client.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedClientForModal(null);
                  setActivePage('communications');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
              >
                <MessageSquareShare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Open WhatsApp Dispatch</span>
              </button>
              <button
                onClick={() => setSelectedClientForModal(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Register New Client Account</h3>
              </div>
              <button
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Rachel Sterling"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Company / Facility Name *</label>
                <input
                  type="text"
                  required
                  value={formCompany}
                  onChange={e => setFormCompany(e.target.value)}
                  placeholder="e.g. Apex BioTech Lab Facility"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="+1 (555) 789-0123"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">SLA Tier</label>
                  <select
                    value={formSlaTier}
                    onChange={e => setFormSlaTier(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Enterprise 24/7">Enterprise 24/7</option>
                    <option value="Priority Commercial">Priority Commercial</option>
                    <option value="Standard Business">Standard Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="rachel@apexbiotech.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Site Street Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  placeholder="Street address, city, state, zip"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Security / Badge Clearance Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Gate code, guard desk badge requirement, rooftop hatch authorization..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
