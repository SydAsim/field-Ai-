import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Send, 
  Clock, 
  FileText, 
  CheckCircle2, 
  HelpCircle,
  Briefcase,
  History,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AI_SUGGESTED_PROMPTS } from '../data/mockData';
import { CallLog } from '../types';

export const AssistantView: React.FC = () => {
  const { 
    activeCall, 
    startCall, 
    endCall, 
    sendCallMessage, 
    callLogs, 
    jobs,
    setSelectedDocId,
    setActivePage 
  } = useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedCallHistory, setSelectedCallHistory] = useState<CallLog | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript to bottom when new messages arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCall.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    if (!activeCall.isOngoing) {
      startCall();
    }
    sendCallMessage(inputQuestion);
    setInputQuestion('');
  };

  const handlePromptClick = (prompt: string) => {
    if (!activeCall.isOngoing) {
      startCall();
    }
    sendCallMessage(prompt);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Status Overview */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FIELD SERVICE AI VOICE ENGINE · SECURE FIELD LINK</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            AI Voice Field Assistant
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Hands-free voice consultation for technicians on the job. Instant answers grounded in the verified safety procedures and OEM technical library.
          </p>
        </div>

        {/* Call Status Badge */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-3 rounded-lg border border-slate-700">
          <div className="relative">
            <span className={`w-3 h-3 rounded-full block ${
              activeCall.isOngoing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
            }`} />
            {activeCall.isOngoing && (
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
            )}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Assistant Status</div>
            <div className="text-xs font-bold text-white tracking-wide">
              {activeCall.isOngoing ? activeCall.status : 'Ready to assist'}
            </div>
          </div>
          {activeCall.isOngoing && (
            <div className="pl-3 border-l border-slate-700 text-xs font-mono font-bold text-emerald-400 tabular-nums">
              {formatTimer(activeCall.durationSeconds)}
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Call Hub & Live Transcript Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Phone Interface (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col items-center justify-between min-h-[480px]">
          {/* Top Info */}
          <div className="w-full flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Virtual Voice Channel</span>
            <span className="font-mono text-slate-500">Audio 48kHz HD</span>
          </div>

          {/* Central Call Hub / Visualizer */}
          <div className="my-auto py-8 flex flex-col items-center text-center">
            {/* Pulsing Visualizer Rings */}
            <div className="relative flex items-center justify-center">
              {activeCall.isOngoing && (
                <>
                  <div className="absolute w-44 h-44 rounded-full bg-blue-500/10 animate-ping duration-1000"></div>
                  <div className="absolute w-36 h-36 rounded-full bg-blue-500/15 animate-pulse"></div>
                </>
              )}
              
              {/* Central Big Action Button */}
              <button
                onClick={() => {
                  if (activeCall.isOngoing) {
                    endCall();
                  } else {
                    startCall();
                  }
                }}
                className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all shadow-xl cursor-pointer ${
                  activeCall.isOngoing
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 hover:scale-105'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:scale-105'
                }`}
                aria-label={activeCall.isOngoing ? 'End AI Phone Call' : 'Start AI Phone Call'}
              >
                {activeCall.isOngoing ? (
                  <>
                    <PhoneOff className="w-9 h-9 mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">End Call</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-9 h-9 mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Start Call</span>
                  </>
                )}
              </button>
            </div>

            {/* Status & Timer beneath button */}
            <div className="mt-6">
              <h3 className="text-base font-bold text-slate-900">
                {activeCall.isOngoing ? 'Simulated AI Call Active' : 'Start Voice Consultation'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeCall.isOngoing
                  ? 'Speaking with FieldAssist AI Knowledge Core'
                  : 'Click the call button to begin hands-free conversation'}
              </p>

              {activeCall.isOngoing && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-bold text-slate-700 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Duration: {formatTimer(activeCall.durationSeconds)}</span>
                </div>
              )}
            </div>

            {/* Audio Wave Simulation Bars when call active */}
            {activeCall.isOngoing && (
              <div className="flex items-center gap-1.5 mt-5 h-8">
                <span className="w-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0ms] h-4"></span>
                <span className="w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms] h-7"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms] h-5"></span>
                <span className="w-1 bg-blue-400 rounded-full animate-bounce [animation-delay:100ms] h-8"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-bounce [animation-delay:200ms] h-6"></span>
                <span className="w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:400ms] h-3"></span>
                <span className="w-1 bg-blue-600 rounded-full animate-bounce [animation-delay:250ms] h-7"></span>
              </div>
            )}
          </div>

          {/* Bottom helper footnote */}
          <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Prototype Demo Mode</span>
            <span>No mic permissions needed</span>
          </div>
        </div>

        {/* Right Column: Live Conversation Transcript & Prompt bar (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
          {/* Transcript Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Live Voice Transcript</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {activeCall.messages.length} exchanges
            </span>
          </div>

          {/* Transcript Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {!activeCall.isOngoing && activeCall.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Mic className="w-10 h-10 text-slate-300 mb-3" />
                <h4 className="text-xs font-bold text-slate-700">No active voice conversation</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                  Click "Start Call" or select one of the suggested field queries below to simulate a real-time voice exchange with the AI.
                </p>
              </div>
            ) : (
              activeCall.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.speaker === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    <span className="font-semibold text-slate-600">
                      {msg.speaker === 'user' ? 'Alex Reynolds (Professional)' : 'FieldAssist AI'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.speaker === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    
                    {/* Referenced document link */}
                    {msg.referenceDocTitle && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium truncate flex items-center gap-1">
                          <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>Ref: {msg.referenceDocTitle}</span>
                        </span>
                        <button
                          onClick={() => {
                            if (msg.referenceDocId) {
                              setSelectedDocId(msg.referenceDocId);
                              setActivePage('knowledge');
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold underline ml-2 shrink-0"
                        >
                          View doc
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick Suggested Field Questions */}
          <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-200">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Quick Voice Inquiries (Click to ask):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {AI_SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Text/Speech Query Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white rounded-b-xl">
            <input
              type="text"
              value={inputQuestion}
              onChange={e => setInputQuestion(e.target.value)}
              placeholder="Ask a technical or safety question to the assistant..."
              className="flex-1 text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>

      {/* Call History Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>AI Voice Consultation History</span>
            </h2>
            <p className="text-xs text-slate-500">
              Past field assistant voice calls, transcripts, and auto-generated action items
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {callLogs.length} total calls recorded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {callLogs.map(call => (
            <div
              key={call.id}
              onClick={() => setSelectedCallHistory(call)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                  <span className="font-semibold text-slate-700">{call.date} · {call.time}</span>
                  <span className="font-mono tabular-nums text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {call.duration}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                  {call.topic}
                </h3>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {call.summary.overview}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">
                  {call.summary.actionItems.length} action items
                </span>
                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                  View Digest <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Call Transcript Drawer / Modal if opened */}
      {selectedCallHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{selectedCallHistory.topic}</h3>
                <p className="text-xs text-slate-400">
                  {selectedCallHistory.date} at {selectedCallHistory.time} · Duration: {selectedCallHistory.duration}
                </p>
              </div>
              <button
                onClick={() => setSelectedCallHistory(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Summary Overview</span>
                <p className="text-slate-700">{selectedCallHistory.summary.overview}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1.5">Action Items</span>
                <ul className="space-y-1">
                  {selectedCallHistory.summary.actionItems.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900 block mb-2">Original Call Exchanges</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCallHistory.messages.map(m => (
                    <div key={m.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold mb-0.5">
                        {m.speaker === 'user' ? 'Technician' : 'FieldAssist AI'} ({m.timestamp})
                      </div>
                      <p className="text-slate-800 text-[11px]">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCallHistory(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
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
