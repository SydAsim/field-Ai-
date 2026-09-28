import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Upload, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HardDrive, 
  ExternalLink, 
  PhoneCall, 
  X, 
  Plus,
  Shield,
  Wrench,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { KnowledgeDocument } from '../types';

export const KnowledgeView: React.FC = () => {
  const { 
    knowledgeDocs, 
    uploadDocument, 
    selectedDocId, 
    setSelectedDocId,
    startCall, 
    setActivePage 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('Safety Procedures');
  const [newDesc, setNewDesc] = useState('');
  const [newOverview, setNewOverview] = useState('');
  const [newKeyPoints, setNewKeyPoints] = useState('');
  const [newSteps, setNewSteps] = useState('');

  const categories = [
    'All',
    'Safety Procedures',
    'Equipment Maintenance',
    'Installation',
    'Troubleshooting',
    'Compliance & Standards',
  ];

  const filteredDocs = knowledgeDocs.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeDocModal = knowledgeDocs.find(d => d.id === selectedDocId);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const points = newKeyPoints
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    const stepsArray = newSteps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((instruction, idx) => ({
        title: `Step ${idx + 1}`,
        instruction,
      }));

    uploadDocument({
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim(),
      contentOverview: newOverview.trim() || newDesc.trim(),
      keyPoints: points.length > 0 ? points : ['Standard operational procedure guidelines.'],
      steps: stepsArray.length > 0 ? stepsArray : [{ title: 'Step 1: Preparation', instruction: 'Follow site guidelines.' }],
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewOverview('');
    setNewKeyPoints('');
    setNewSteps('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Safety Procedures':
        return <Shield className="w-4 h-4 text-emerald-600" />;
      case 'Equipment Maintenance':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'Installation':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Troubleshooting':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI FIELD CORPUS · EMBEDDED KNOWLEDGE REPOSITORY</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Knowledge Library
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Verified standard operating procedures, OEM service manuals, and wiring schematics referenced by FieldAssist AI during live voice calls.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search manuals, fault codes, safety protocols..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Categories as clean segmented buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Category indicator + file metadata */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  {getCategoryIcon(doc.category)}
                  <span>{doc.category}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span>{doc.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.fileSize}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {doc.description}
              </p>
            </div>

            {/* Tags & Action row */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Updated {doc.updatedAt}</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Open Reader <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No documents found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No matching guides found for "{searchQuery}". Try a different keyword or upload a new manual.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Document Reader Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
                    {activeDocModal.category} · Verified Field Spec
                  </div>
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    {activeDocModal.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
              {/* Document Metadata Bar */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                <div className="flex items-center gap-4">
                  <span>Updated: <strong className="text-slate-900">{activeDocModal.updatedAt}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Est. Read: <strong className="text-slate-900">{activeDocModal.readTime}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Size: <strong className="text-slate-900">{activeDocModal.fileSize}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Index Ready</span>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Procedure Overview
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
                  {activeDocModal.content.overview}
                </p>
              </div>

              {/* Warnings if any */}
              {activeDocModal.content.warnings && activeDocModal.content.warnings.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Critical Safety Requirements</span>
                  </div>
                  {activeDocModal.content.warnings.map((w, idx) => (
                    <p key={idx} className="text-amber-800 text-xs pl-6">
                      • {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Key Technical Rules */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Technical Specifications & Checkpoints
                </h4>
                <div className="space-y-2">
                  {activeDocModal.content.keyPoints.map((kp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-md border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span className="text-slate-800">{kp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by step execution */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Step-by-Step Execution Sequence
                </h4>
                <div className="space-y-3">
                  {activeDocModal.content.steps.map((st, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3.5 bg-white">
                      <div className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                          {idx + 1}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-slate-600 pl-7">{st.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Equipment */}
              {activeDocModal.content.relatedEquipment && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Applies to equipment:</span>
                  <span>{activeDocModal.content.relatedEquipment.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Modal Footer with "Consult AI on this Doc" CTA */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedDocId(null);
                  startCall();
                  setActivePage('assistant');
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Ask AI About This Doc in Voice Call</span>
              </button>
              <button
                onClick={() => setSelectedDocId(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Upload Knowledge Document</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Liebert CRAC Unit Diagnostic Standard"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Safety Procedures">Safety Procedures</option>
                  <option value="Equipment Maintenance">Equipment Maintenance</option>
                  <option value="Installation">Installation</option>
                  <option value="Troubleshooting">Troubleshooting</option>
                  <option value="Compliance & Standards">Compliance & Standards</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Brief Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Summary of this manual for quick search matching..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Key Technical Points (one per line)</label>
                <textarea
                  rows={3}
                  value={newKeyPoints}
                  onChange={e => setNewKeyPoints(e.target.value)}
                  placeholder="Target suction: 118 PSI&#10;Verify breaker disconnect&#10;Torque specs: 85 ft-lbs"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Steps / Execution (one per line)</label>
                <textarea
                  rows={3}
                  value={newSteps}
                  onChange={e => setNewSteps(e.target.value)}
                  placeholder="De-energize main disconnect&#10;Check line-to-line continuity&#10;Attach safety padlock and tag"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-[11px]">
                💡 In this prototype, newly uploaded documents are instantly indexed and made available to the AI voice consultation engine!
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Upload & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
