import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  FileText, 
  Check, 
  X, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CallSummaryModal: React.FC = () => {
  const { 
    showSummaryModal, 
    setShowSummaryModal, 
    currentCompletedCall, 
    jobs, 
    addJobNote,
    addToast,
    openJobDetail
  } = useApp();

  const [selectedJobToAttach, setSelectedJobToAttach] = useState<string>(
    jobs[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);
  const [attached, setAttached] = useState(false);

  if (!showSummaryModal || !currentCompletedCall) return null;

  const handleCopy = () => {
    const text = `FieldAssist Call Summary (${currentCompletedCall.date} ${currentCompletedCall.time})
Topic: ${currentCompletedCall.topic}
Duration: ${currentCompletedCall.duration}

Overview:
${currentCompletedCall.summary.overview}

Key Points:
${currentCompletedCall.summary.keyPoints.map(p => `• ${p}`).join('\n')}

Action Items:
${currentCompletedCall.summary.actionItems.map(a => `• ${a}`).join('\n')}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    addToast({ title: 'Copied', message: 'Summary copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttachToJob = () => {
    if (!selectedJobToAttach) return;
    const summaryText = `[AI Voice Consultation Summary]
Duration: ${currentCompletedCall.duration}
Overview: ${currentCompletedCall.summary.overview}
Key Points:
- ${currentCompletedCall.summary.keyPoints.join('\n- ')}
Action Items:
- ${currentCompletedCall.summary.actionItems.join('\n- ')}`;

    addJobNote(selectedJobToAttach, summaryText, 'technical');
    setAttached(true);
    addToast({
      title: 'Summary Attached',
      message: 'Consultation notes attached to job record.',
    });
    setTimeout(() => {
      setShowSummaryModal(false);
      openJobDetail(selectedJobToAttach);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI Consultation Summary</h3>
              <p className="text-xs text-slate-400">Post-Call Field Digest & Action Plan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-blue-300 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentCompletedCall.duration}</span>
            </div>
            <button
              onClick={() => setShowSummaryModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Overview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-semibold text-slate-900 block mb-1 text-xs">Call Overview</span>
            <p className="text-slate-600">{currentCompletedCall.summary.overview}</p>
          </div>

          {/* Key Points */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Key Technical Points</span>
            </h4>
            <ul className="space-y-1.5">
              {currentCompletedCall.summary.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4 text-blue-600" />
              <span>Suggested Next Steps</span>
            </h4>
            <div className="space-y-2">
              {currentCompletedCall.summary.actionItems.map((action, idx) => (
                <div key={idx} className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-md flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Notice if any */}
          {currentCompletedCall.summary.safetyNotices && currentCompletedCall.summary.safetyNotices.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">Safety Compliance Reminder</span>
                <p className="text-amber-800 text-xs">
                  {currentCompletedCall.summary.safetyNotices.join(' ')}
                </p>
              </div>
            </div>
          )}

          {/* Attach to Job Section */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-900 block mb-2">Attach to Active Job</span>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <select
                value={selectedJobToAttach}
                onChange={e => setSelectedJobToAttach(e.target.value)}
                className="w-full sm:flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.jobNumber} · {j.title.substring(0, 42)}... ({j.status})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAttachToJob}
                disabled={attached}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                {attached ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Attached to Job</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Attach Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={() => setShowSummaryModal(false)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
