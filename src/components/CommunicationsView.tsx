import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquareShare, 
  Phone, 
  Send, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  ShieldCheck, 
  User, 
  Bot, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CommunicationsView: React.FC = () => {
  const { 
    whatsAppConversations, 
    sendWhatsAppMessage, 
    twilioLogs, 
    simulateTwilioEvent, 
    clients,
    jobs,
    openJobDetail
  } = useApp();

  const [activeClientId, setActiveClientId] = useState<string>(
    whatsAppConversations[0]?.clientId || ''
  );
  const [typedMessage, setTypedMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'twilio'>('whatsapp');

  const selectedConversation = whatsAppConversations.find(
    c => c.clientId === activeClientId
  );
  const currentClient = clients.find(c => c.id === activeClientId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeClientId) return;
    sendWhatsAppMessage(activeClientId, typedMessage);
    setTypedMessage('');
  };

  const handleSendQuickTemplate = (text: string) => {
    if (!activeClientId) return;
    sendWhatsAppMessage(activeClientId, text);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Demo Mode Notice */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] uppercase font-bold">
              Demo Simulation Mode
            </span>
            <span>EXTERNAL CARRIER DISPATCH GATEWAYS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            WhatsApp & Twilio Gateway
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Preview the automated client communication pipeline. Synchronizes technician status, appointment confirmations, and two-way client chat.
          </p>
        </div>

        {/* Tab switch between WhatsApp & Twilio */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'whatsapp'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            WhatsApp Client Portal
          </button>
          <button
            onClick={() => setActiveTab('twilio')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'twilio'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Twilio Voice & SMS Hub
          </button>
        </div>
      </div>

      {activeTab === 'whatsapp' ? (
        /* WhatsApp Simulator Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden min-h-[580px]">
          {/* Left Column: Conversations List (4 cols) */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Client Conversations</span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                  WA Cloud API Active
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {whatsAppConversations.map(conv => {
                const isSelected = conv.clientId === activeClientId;
                const lastMsg = conv.messages[conv.messages.length - 1];
                return (
                  <div
                    key={conv.clientId}
                    onClick={() => setActiveClientId(conv.clientId)}
                    className={`p-3.5 hover:bg-slate-100/70 transition-colors cursor-pointer flex items-start gap-3 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      {conv.clientName.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.clientName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lastMsg ? lastMsg.timestamp.replace('Today at ', '') : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mb-1 truncate">
                        {conv.clientPhone}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: WhatsApp Active Chat Interface (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#efeae2]/40">
            {selectedConversation ? (
              <>
                {/* Chat Top Bar */}
                <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {selectedConversation.clientName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {selectedConversation.clientName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {selectedConversation.clientPhone} · {currentClient?.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 hidden sm:inline text-[11px]">
                      End-to-End Encrypted Demo
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                  <div className="text-center my-2">
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-mono">
                      FieldAssist Automated Dispatch Gateway · Demo Channel
                    </span>
                  </div>

                  {selectedConversation.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.direction === 'outgoing' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[78%] rounded-xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                          msg.direction === 'outgoing'
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`mt-1 text-[10px] flex items-center justify-end gap-1 font-mono ${
                            msg.direction === 'outgoing' ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {msg.direction === 'outgoing' && (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Field Dispatch Templates */}
                <div className="p-2.5 bg-slate-100 border-t border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Dispatch Quick Messages:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleSendQuickTemplate('Your job appointment is scheduled for tomorrow at 10 AM.')}
                      className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded border border-slate-200 cursor-pointer transition-colors"
                    >
                      "Your job appointment is scheduled for tomorrow at 10 AM."
                    </button>
                    <button
                      onClick={() => handleSendQuickTemplate('Senior Tech Alex has arrived on site and completed zero-energy safety lockout.')}
                      className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded border border-slate-200 cursor-pointer transition-colors"
                    >
                      "Tech Alex arrived on site & completed lockout."
                    </button>
                    <button
                      onClick={() => handleSendQuickTemplate('Service diagnostic complete. Condenser coils cleaned and system operational.')}
                      className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded border border-slate-200 cursor-pointer transition-colors"
                    >
                      "Service complete. Coils cleaned & operational."
                    </button>
                  </div>
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={e => setTypedMessage(e.target.value)}
                    placeholder="Type simulated WhatsApp message to client..."
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!typedMessage.trim()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                Select a client conversation from the left to preview simulated messaging.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Twilio Voice & SMS Hub Section */
        <div className="space-y-6">
          {/* Twilio Setup Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Twilio Dispatch Phone</span>
              <div className="text-lg font-bold font-mono text-slate-900">+1 (555) 349-2841</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                SIP Trunk Active · US-East
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Automated Voice IVR</span>
              <div className="text-lg font-bold text-slate-900">AI Speech-to-Text</div>
              <div className="text-[11px] text-slate-500 mt-2">
                Automatic call forwarding to Senior Tech Alex Reynolds
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Interactive Simulation</span>
                <p className="text-[11px] text-slate-600">Simulate an incoming client call & webhook event</p>
              </div>
              <button
                onClick={simulateTwilioEvent}
                className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneIncoming className="w-3.5 h-3.5" />
                <span>Simulate Inbound Call</span>
              </button>
            </div>
          </div>

          {/* Twilio Call Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Twilio Telephony Call Logs</h3>
                <p className="text-xs text-slate-500">Recorded inbound and outbound client dispatch calls with transcript status</p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {twilioLogs.length} events logged
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {twilioLogs.map(log => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      {log.direction === 'Inbound' ? (
                        <PhoneIncoming className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <PhoneOutgoing className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                        <span className="font-semibold text-slate-800">{log.direction} Call</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{log.timestamp}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{log.duration}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{log.notes}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {log.status}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Transcribed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
