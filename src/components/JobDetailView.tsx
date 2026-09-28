import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Plus, 
  Camera, 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  Image as ImageIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { JobStatus, JobNote, JobPhoto } from '../types';

export const JobDetailView: React.FC = () => {
  const { 
    selectedJob, 
    clients, 
    setActivePage, 
    updateJobStatus, 
    addJobNote, 
    addJobPhoto, 
    startCall 
  } = useApp();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<JobPhoto | null>(null);

  // Add Note Form
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<JobNote['type']>('technical');

  // Add Photo Form
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoCategory, setPhotoCategory] = useState<JobPhoto['category']>('diagnostic');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!selectedJob) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">No Job Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Please select a job from the jobs directory.</p>
        <button
          onClick={() => setActivePage('jobs')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Go to Jobs
        </button>
      </div>
    );
  }

  const client = clients.find(c => c.id === selectedJob.clientId);

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addJobNote(selectedJob.id, noteContent.trim(), noteType);
    setNoteContent('');
    setIsNoteModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetType: string) => {
    let svgUrl = '';
    if (presetType === 'gauges') {
      svgUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><circle cx="200" cy="200" r="80" fill="%231e293b" stroke="%2338bdf8" stroke-width="4"/><circle cx="400" cy="200" r="80" fill="%231e293b" stroke="%23f43f5e" stroke-width="4"/><text x="200" y="195" font-family="monospace" font-size="20" fill="white" font-weight="bold" text-anchor="middle">122 PSI</text><text x="200" y="225" font-family="sans-serif" font-size="12" fill="%2394a3b8" text-anchor="middle">SUCTION</text><text x="400" y="195" font-family="monospace" font-size="20" fill="white" font-weight="bold" text-anchor="middle">390 PSI</text><text x="400" y="225" font-family="sans-serif" font-size="12" fill="%2394a3b8" text-anchor="middle">HEAD PRESSURE</text><text x="300" y="70" font-family="sans-serif" font-size="16" fill="%23e2e8f0" font-weight="bold" text-anchor="middle">DIGITAL MANIFOLD PRESSURE TEST</text></svg>';
      setPhotoCaption('Diagnostic gauge readings during high load test');
      setPhotoCategory('diagnostic');
    } else if (presetType === 'panel') {
      svgUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="50" y="50" width="500" height="300" rx="6" fill="%231e293b" stroke="%2364748b" stroke-width="3"/><path d="M100 120 L500 120 M100 200 L500 200 M100 280 L500 280" stroke="%23334155" stroke-width="2"/><circle cx="150" cy="160" r="15" fill="%2322c55e"/><circle cx="250" cy="160" r="15" fill="%2322c55e"/><circle cx="350" cy="160" r="15" fill="%2322c55e"/><text x="300" y="90" font-family="sans-serif" font-size="16" fill="white" font-weight="bold" text-anchor="middle">SUBPANEL TERMINATIONS INSPECTION</text></svg>';
      setPhotoCaption('Electrical subpanel clean and torqued to specification');
      setPhotoCategory('after');
    } else {
      svgUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="60" y="80" width="480" height="240" fill="%23334155" rx="8"/><text x="300" y="140" font-family="sans-serif" font-size="18" fill="white" font-weight="bold" text-anchor="middle">EQUIPMENT RATING PLATE</text><text x="300" y="180" font-family="monospace" font-size="13" fill="%2338bdf8" text-anchor="middle">VOLTS: 480V 3PH 60HZ | RLA: 34.2A</text><text x="300" y="220" font-family="monospace" font-size="13" fill="%2338bdf8" text-anchor="middle">REFRIGERANT: R-410A (18.5 LBS)</text></svg>';
      setPhotoCaption('OEM Specification nameplate verified on equipment chassis');
      setPhotoCategory('nameplate');
    }
    setPhotoDataUrl(svgUrl);
  };

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = photoDataUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="40" y="40" width="520" height="320" rx="10" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/><text x="300" y="200" font-family="sans-serif" font-size="18" fill="white" font-weight="bold" text-anchor="middle">FIELD PHOTO VERIFICATION</text></svg>';

    addJobPhoto(selectedJob.id, {
      url: finalUrl,
      caption: photoCaption.trim() || 'Field service photo record',
      category: photoCategory,
    });

    setIsPhotoModalOpen(false);
    setPhotoCaption('');
    setPhotoDataUrl('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button & Primary actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActivePage('jobs')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Management</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Status Changer Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedJob.status}
              onChange={e => updateJobStatus(selectedJob.id, e.target.value as JobStatus)}
              className="font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>

          {/* AI Consultation on this job */}
          <button
            onClick={() => {
              startCall(selectedJob.id);
              setActivePage('assistant');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Consult AI On This Job</span>
          </button>
        </div>
      </div>

      {/* Main Job Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
          <span className="font-mono font-bold text-blue-400">{selectedJob.jobNumber}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-200">{selectedJob.priority} Priority</span>
          <span aria-hidden="true">·</span>
          <span>{selectedJob.systemType}</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-2">
          {selectedJob.title}
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mb-4">
          {selectedJob.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Site Location</span>
            <span className="text-slate-200 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{selectedJob.siteAddress}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Scheduled Window</span>
            <span className="text-slate-200 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{selectedJob.scheduledDate} · {selectedJob.scheduledTime}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Assigned Technician</span>
            <span className="text-slate-200 font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{selectedJob.assignedTechnician}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Estimated Duration</span>
            <span className="text-slate-200 font-medium flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{selectedJob.estimatedDuration}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Client Information & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info Card (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900">Client Information</span>
              <span className="text-blue-600 font-medium font-mono">{client?.slaTier || 'Enterprise'}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Contact Name & Company</span>
                <span className="font-bold text-slate-900 block">{selectedJob.clientName}</span>
                <span className="text-slate-600 font-medium">{selectedJob.clientCompany}</span>
              </div>

              {client && (
                <>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Direct Phone</span>
                    <span className="text-slate-700 font-mono flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.phone}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">Email Address</span>
                    <span className="text-slate-700 font-mono flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{client.email}</span>
                    </span>
                  </div>

                  {client.notes && (
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-[11px] leading-relaxed">
                      <span className="font-semibold text-slate-800 block mb-0.5">Facility Access Protocol:</span>
                      {client.notes}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setActivePage('communications')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open WhatsApp / Twilio Dispatch</span>
          </button>
        </div>

        {/* Pre-Job Safety Checklist Overview (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Safety & LOTO Compliance Status</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero-Energy Protocol Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">1. Disconnect Padlock</span>
              <p className="text-slate-500 text-[11px]">Heavy-duty master lock installed on main line.</p>
              <div className="mt-2 text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Padlock #42 Verified
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">2. Live-Dead-Live Test</span>
              <p className="text-slate-500 text-[11px]">Multimeter check: L1-L2, L2-L3, L1-L3, and ground.</p>
              <div className="mt-2 text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 0.0 Volts AC Confirmed
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">3. Capacitance Bleed</span>
              <p className="text-slate-500 text-[11px]">VFD DC bus capacitor banks discharged &lt; 5V.</p>
              <div className="mt-2 text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 5-Min Bleed Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Notes Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Job Field Notes ({selectedJob.notes.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Observations, multimeter logs, and voice consultation summaries saved to this ticket
            </p>
          </div>

          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </div>

        <div className="space-y-3">
          {selectedJob.notes.map(note => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{note.author}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">{note.authorRole}</span>
                  <span aria-hidden="true">·</span>
                  <span className={`capitalize font-medium ${
                    note.type === 'safety' ? 'text-amber-600' :
                    note.type === 'technical' ? 'text-blue-600' : 'text-slate-600'
                  }`}>
                    {note.type} Note
                  </span>
                </div>
                <span className="font-mono text-slate-400">{note.timestamp}</span>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {note.content}
              </p>
            </div>
          ))}

          {selectedJob.notes.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              No notes logged yet for this job. Click "Add Note" to record field measurements or pre-job findings.
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Job Photos & Diagnostic Visuals ({selectedJob.photos.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Site inspection captures, gauge manifold readings, and component serial plates
            </p>
          </div>

          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedJob.photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setPreviewPhoto(photo)}
              className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                />
              </div>
              <div className="p-3 bg-white border-t border-slate-200 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    <span className="font-semibold text-blue-600">{photo.category}</span>
                    <span className="font-mono">{photo.timestamp}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>By {photo.uploadedBy}</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">Enlarge</span>
                </div>
              </div>
            </div>
          ))}

          {selectedJob.photos.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span>No photos attached yet. Click "Add Photo" to upload an inspection picture or select diagnostic presets.</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Add Field Note</h3>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNoteSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Note Category</label>
                <select
                  value={noteType}
                  onChange={e => setNoteType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="technical">Technical Observation</option>
                  <option value="safety">Safety & LOTO Checkpoint</option>
                  <option value="client">Client Communication</option>
                  <option value="general">General Work Note</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Observation / Findings *</label>
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Record multimeter readings, pressure observations, or customer signoff notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Add Job Photo</h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePhotoSubmit} className="p-6 space-y-4 text-xs">
              {/* Image Source Selection */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Choose Photo Source</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg text-center cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                    <span className="font-semibold text-slate-700 block">Select Image File</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP from device</span>
                  </button>

                  <div className="p-2 border border-slate-200 rounded-lg flex flex-col justify-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Or pick demo preset:</span>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('gauges')}
                      className="text-left text-[11px] px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded transition-colors"
                    >
                      • Gauge Manifold Reading
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('panel')}
                      className="text-left text-[11px] px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded transition-colors"
                    >
                      • Subpanel Wiring Inspection
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('plate')}
                      className="text-left text-[11px] px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded transition-colors"
                    >
                      • Equipment Rating Nameplate
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Photo Preview if loaded */}
              {photoDataUrl && (
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-900">
                  <span className="text-[10px] text-slate-400 font-mono block mb-1">Image Preview:</span>
                  <div className="aspect-16/9 w-full overflow-hidden rounded bg-black flex items-center justify-center">
                    <img src={photoDataUrl} alt="Preview" className="max-h-48 w-full object-contain" />
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Photo Classification</label>
                <select
                  value={photoCategory}
                  onChange={e => setPhotoCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="diagnostic">Diagnostic / Gauge Reading</option>
                  <option value="before">Before Service Condition</option>
                  <option value="after">Post-Service Verification</option>
                  <option value="nameplate">Serial & Rating Nameplate</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Photo Caption / Note *</label>
                <input
                  type="text"
                  required
                  value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Suction pressure 118 PSI at compressor suction service valve"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Attach to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Photo Viewer Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={e => e.stopPropagation()} 
            className="bg-slate-900 text-white rounded-xl max-w-3xl w-full overflow-hidden border border-slate-750 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 uppercase font-mono font-bold">{previewPhoto.category}</span>
                <h3 className="text-sm font-bold text-white">{previewPhoto.caption}</h3>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center min-h-[360px]">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.caption}
                className="max-h-[60vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Captured by {previewPhoto.uploadedBy} at {previewPhoto.timestamp}</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
