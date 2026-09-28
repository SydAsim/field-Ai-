import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Job, 
  Client, 
  KnowledgeDocument, 
  CallLog, 
  CallMessage, 
  WhatsAppConversation, 
  TwilioCallLog, 
  ActivePage, 
  Toast, 
  JobStatus 
} from '../types';
import { 
  INITIAL_JOBS, 
  INITIAL_CLIENTS, 
  INITIAL_KNOWLEDGE_DOCS, 
  INITIAL_CALL_LOGS, 
  INITIAL_WHATSAPP_CONVERSATIONS, 
  INITIAL_TWILIO_LOGS 
} from '../data/mockData';

interface ActiveCallState {
  isOngoing: boolean;
  durationSeconds: number;
  messages: CallMessage[];
  status: 'Ready to assist' | 'Connected' | 'Listening' | 'AI Speaking';
  relatedJobId?: string;
  lastSummary?: CallLog['summary'];
}

interface AppContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  selectedJob: Job | undefined;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
  
  // Jobs
  jobs: Job[];
  createJob: (jobData: {
    title: string;
    clientId: string;
    siteAddress: string;
    scheduledDate: string;
    scheduledTime: string;
    priority: Job['priority'];
    systemType: string;
    description: string;
    assignedTechnician: string;
  }) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  addJobNote: (jobId: string, content: string, type: 'general' | 'technical' | 'safety' | 'client') => void;
  addJobPhoto: (jobId: string, photo: { url: string; caption: string; category: 'before' | 'after' | 'diagnostic' | 'nameplate' }) => void;
  
  // Clients
  clients: Client[];
  createClient: (clientData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    slaTier: Client['slaTier'];
    notes: string;
  }) => void;

  // Knowledge Base
  knowledgeDocs: KnowledgeDocument[];
  uploadDocument: (docData: {
    title: string;
    category: KnowledgeDocument['category'];
    description: string;
    contentOverview: string;
    keyPoints: string[];
    steps: { title: string; instruction: string }[];
  }) => void;

  // AI Assistant Call
  activeCall: ActiveCallState;
  startCall: (relatedJobId?: string) => void;
  endCall: () => CallLog | null;
  sendCallMessage: (text: string) => void;
  callLogs: CallLog[];
  showSummaryModal: boolean;
  setShowSummaryModal: (show: boolean) => void;
  currentCompletedCall: CallLog | null;

  // Communications
  whatsAppConversations: WhatsAppConversation[];
  sendWhatsAppMessage: (clientId: string, text: string) => void;
  twilioLogs: TwilioCallLog[];
  simulateTwilioEvent: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: { title: string; message: string; type?: 'success' | 'info' | 'warning' }) => void;
  removeToast: (id: string) => void;
  
  // Helper
  openJobDetail: (jobId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Data persistence via localStorage
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('fieldassist_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('fieldassist_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(() => {
    const saved = localStorage.getItem('fieldassist_docs');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_DOCS;
  });

  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('fieldassist_call_logs');
    return saved ? JSON.parse(saved) : INITIAL_CALL_LOGS;
  });

  const [whatsAppConversations, setWhatsAppConversations] = useState<WhatsAppConversation[]>(() => {
    const saved = localStorage.getItem('fieldassist_wa');
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_CONVERSATIONS;
  });

  const [twilioLogs, setTwilioLogs] = useState<TwilioCallLog[]>(() => {
    const saved = localStorage.getItem('fieldassist_twilio');
    return saved ? JSON.parse(saved) : INITIAL_TWILIO_LOGS;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Active Call State
  const [activeCall, setActiveCall] = useState<ActiveCallState>({
    isOngoing: false,
    durationSeconds: 0,
    messages: [],
    status: 'Ready to assist',
  });
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [currentCompletedCall, setCurrentCompletedCall] = useState<CallLog | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('fieldassist_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('fieldassist_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('fieldassist_docs', JSON.stringify(knowledgeDocs));
  }, [knowledgeDocs]);

  useEffect(() => {
    localStorage.setItem('fieldassist_call_logs', JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    localStorage.setItem('fieldassist_wa', JSON.stringify(whatsAppConversations));
  }, [whatsAppConversations]);

  useEffect(() => {
    localStorage.setItem('fieldassist_twilio', JSON.stringify(twilioLogs));
  }, [twilioLogs]);

  // Call timer effect
  useEffect(() => {
    if (activeCall.isOngoing) {
      timerRef.current = setInterval(() => {
        setActiveCall(prev => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeCall.isOngoing]);

  const addToast = ({ title, message, type = 'success' }: { title: string; message: string; type?: 'success' | 'info' | 'warning' }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openJobDetail = (jobId: string) => {
    setSelectedJobId(jobId);
    setActivePage('job-detail');
  };

  // Job Actions
  const createJob = (jobData: {
    title: string;
    clientId: string;
    siteAddress: string;
    scheduledDate: string;
    scheduledTime: string;
    priority: Job['priority'];
    systemType: string;
    description: string;
    assignedTechnician: string;
  }) => {
    const client = clients.find(c => c.id === jobData.clientId);
    const jobNumber = `JOB-2026-${String(jobs.length + 88).padStart(3, '0')}`;
    const newJob: Job = {
      id: `job-${Date.now()}`,
      jobNumber,
      title: jobData.title,
      clientId: jobData.clientId,
      clientName: client ? client.name : 'Direct Facility Client',
      clientCompany: client ? client.company : 'Commercial Facility',
      siteAddress: jobData.siteAddress,
      status: 'Scheduled',
      priority: jobData.priority,
      scheduledDate: jobData.scheduledDate,
      scheduledTime: jobData.scheduledTime,
      assignedTechnician: jobData.assignedTechnician,
      systemType: jobData.systemType,
      description: jobData.description,
      estimatedDuration: '3.0 Hours',
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Alex Reynolds',
          authorRole: 'Senior Lead Tech',
          timestamp: 'Just now',
          content: 'Job initialized via FieldAssist dispatch console.',
          type: 'general',
        }
      ],
      photos: [],
    };

    setJobs(prev => [newJob, ...prev]);
    // update client active job count
    if (client) {
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, activeJobsCount: c.activeJobsCount + 1, totalJobsCount: c.totalJobsCount + 1 } : c));
    }
    addToast({
      title: 'Job Created',
      message: `${jobNumber} scheduled for ${jobData.scheduledDate}`,
    });
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, status };
      }
      return j;
    }));
    addToast({
      title: 'Status Updated',
      message: `Job status changed to "${status}"`,
      type: 'info',
    });
  };

  const addJobNote = (jobId: string, content: string, type: 'general' | 'technical' | 'safety' | 'client') => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Alex Reynolds',
      authorRole: 'Senior Lead Tech',
      timestamp: 'Just now',
      content,
      type,
    };
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          notes: [newNote, ...j.notes],
        };
      }
      return j;
    }));
    addToast({
      title: 'Note Saved',
      message: 'New field observation added to job records.',
    });
  };

  const addJobPhoto = (jobId: string, photo: { url: string; caption: string; category: 'before' | 'after' | 'diagnostic' | 'nameplate' }) => {
    const newPhoto = {
      id: `photo-${Date.now()}`,
      url: photo.url,
      caption: photo.caption,
      timestamp: 'Just now',
      uploadedBy: 'Alex Reynolds',
      category: photo.category,
    };
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          photos: [newPhoto, ...j.photos],
        };
      }
      return j;
    }));
    addToast({
      title: 'Photo Uploaded',
      message: 'Field photo added to job gallery with visual inspection metadata.',
    });
  };

  // Client Actions
  const createClient = (clientData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    slaTier: Client['slaTier'];
    notes: string;
  }) => {
    const initials = clientData.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: clientData.name,
      company: clientData.company,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      slaTier: clientData.slaTier,
      activeJobsCount: 0,
      totalJobsCount: 0,
      notes: clientData.notes,
      avatarInitials: initials || 'CL',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setClients(prev => [newClient, ...prev]);
    // create a WhatsApp thread for this client too
    const newWaThread: WhatsAppConversation = {
      clientId: newClient.id,
      clientName: newClient.name,
      clientPhone: newClient.phone,
      unreadCount: 0,
      lastActive: 'Just now',
      messages: [
        {
          id: `wa-init-${Date.now()}`,
          direction: 'outgoing',
          text: `Welcome to FieldAssist automated dispatch, ${newClient.name}. We have linked your profile for ${newClient.company}.`,
          timestamp: 'Just now',
          status: 'delivered',
          senderName: 'FieldAssist Automated Dispatch',
        }
      ],
    };
    setWhatsAppConversations(prev => [newWaThread, ...prev]);

    addToast({
      title: 'Client Added',
      message: `${clientData.name} (${clientData.company}) registered.`,
    });
  };

  // Knowledge Library Actions
  const uploadDocument = (docData: {
    title: string;
    category: KnowledgeDocument['category'];
    description: string;
    contentOverview: string;
    keyPoints: string[];
    steps: { title: string; instruction: string }[];
  }) => {
    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      title: docData.title,
      category: docData.category,
      description: docData.description,
      updatedAt: new Date().toISOString().split('T')[0],
      fileSize: '1.8 MB',
      readTime: '5 min read',
      tags: [docData.category, 'Manual', 'Field Verified'],
      content: {
        overview: docData.contentOverview,
        keyPoints: docData.keyPoints,
        steps: docData.steps,
        relatedEquipment: ['Standard Commercial Mechanical Systems'],
      },
    };

    setKnowledgeDocs(prev => [newDoc, ...prev]);
    addToast({
      title: 'Document Added',
      message: `"${docData.title}" indexed into AI knowledge library.`,
    });
  };

  // AI Voice Assistant Calling Logic
  const startCall = (relatedJobId?: string) => {
    const job = jobs.find(j => j.id === relatedJobId);
    
    // Initial conversation requirement from prompt:
    const initialMessages: CallMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        speaker: 'user',
        timestamp: '00:02',
        text: 'What should I check before starting this job?',
      },
      {
        id: `msg-${Date.now()}-2`,
        speaker: 'assistant',
        timestamp: '00:05',
        text: 'Based on the knowledge library, begin by reviewing the safety checklist, inspecting the equipment, and confirming the site requirements.',
        referenceDocId: 'doc-1',
        referenceDocTitle: 'Lockout/Tagout (LOTO) & High Voltage Safety Protocol',
      },
    ];

    setActiveCall({
      isOngoing: true,
      durationSeconds: 5,
      messages: initialMessages,
      status: 'Connected',
      relatedJobId: relatedJobId || (selectedJobId || undefined),
    });

    addToast({
      title: 'AI Call Connected',
      message: 'FieldAssist Voice Assistant connected. Knowledge base online.',
      type: 'info',
    });
  };

  const endCall = () => {
    if (!activeCall.isOngoing && activeCall.durationSeconds === 0) return null;

    const currentSecs = activeCall.durationSeconds;
    const mins = Math.floor(currentSecs / 60);
    const secs = currentSecs % 60;
    const formattedDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const job = jobs.find(j => j.id === activeCall.relatedJobId);

    const callSummary: CallLog['summary'] = {
      overview: `Field consultation with Alex Reynolds regarding ${job ? `${job.title} (${job.jobNumber})` : 'equipment inspection & diagnostic procedures'}.`,
      keyPoints: [
        'Reviewed pre-task safety checklist: zero-energy verification (Live-Dead-Live) and arc flash PPE.',
        'Cross-referenced operating tolerances against knowledge base equipment specifications.',
        'Confirmed sensor readings and system diagnostic checkpoints.',
      ],
      actionItems: [
        'Perform static and dynamic pressure checks on refrigeration circuit.',
        'Verify disconnect terminal torques and phase balance under load.',
        'Record final readings in Job Notes before customer signoff.',
      ],
      safetyNotices: [
        'Ensure NFPA 70E Arc Flash face shield and gloves remain on during energizing checks.',
      ],
    };

    const newCallLog: CallLog = {
      id: `call-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: formattedDuration,
      durationSeconds: currentSecs,
      caller: 'Alex Reynolds (Senior Lead)',
      topic: job ? `${job.title} Consultation` : 'Field Diagnostics & Safety Verification',
      relatedJobNumber: job?.jobNumber,
      summary: callSummary,
      messages: activeCall.messages,
    };

    setCallLogs(prev => [newCallLog, ...prev]);

    setActiveCall({
      isOngoing: false,
      durationSeconds: 0,
      messages: [],
      status: 'Ready to assist',
    });

    setCurrentCompletedCall(newCallLog);
    setShowSummaryModal(true);

    addToast({
      title: 'Call Completed',
      message: `Call duration ${formattedDuration}. Summary and action items generated.`,
    });

    return newCallLog;
  };

  // Sending a question in the simulated call
  const sendCallMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: CallMessage = {
      id: `msg-${Date.now()}-u`,
      speaker: 'user',
      timestamp: formatTimeSecs(activeCall.durationSeconds),
      text: text.trim(),
    };

    setActiveCall(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      status: 'AI Speaking',
    }));

    // Generate dynamic realistic AI answer matching the query
    setTimeout(() => {
      let aiText = '';
      let refDocId: string | undefined;
      let refDocTitle: string | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('check') && lower.includes('before starting')) {
        aiText = 'Based on the knowledge library, begin by reviewing the safety checklist, inspecting the equipment, and confirming the site requirements.';
        refDocId = 'doc-1';
        refDocTitle = 'Lockout/Tagout (LOTO) & High Voltage Safety Protocol';
      } else if (lower.includes('refrigerant') || lower.includes('pressure') || lower.includes('r-410a')) {
        aiText = 'For R-410A systems at 85°F ambient outdoor temperature, normal suction pressure is typically 115–125 PSIG (evaporator saturation 40–44°F) and liquid head pressure is approximately 320–355 PSIG with 10–12°F subcooling.';
        refDocId = 'doc-2';
        refDocTitle = 'Commercial HVAC & Heat Pump Maintenance Guide';
      } else if (lower.includes('lockout') || lower.includes('tagout') || lower.includes('loto') || lower.includes('safety')) {
        aiText = 'Emergency LOTO requires 4 steps: 1) Notify site operator, 2) Open breaker in single motion, 3) Bleed DC capacitor banks (wait 5 mins for <5V), 4) Perform Live-Dead-Live 3-phase meter check.';
        refDocId = 'doc-1';
        refDocTitle = 'Lockout/Tagout (LOTO) & High Voltage Safety Protocol';
      } else if (lower.includes('danfoss') || lower.includes('vfd') || lower.includes('alarm') || lower.includes('f002')) {
        aiText = 'Danfoss Alarm F002 / W02 is Inverter Overcurrent. Check for motor winding short circuit with a 1000V Megger insulation tester, verify motor full load amps (FLA) in Parameter 1-24, and check for locked blower bearings.';
        refDocId = 'doc-3';
        refDocTitle = 'Three-Phase Motor & VFD Installation Manual';
      } else if (lower.includes('subcooling') || lower.includes('superheat') || lower.includes('txv')) {
        aiText = 'Target subcooling on TXV systems is 10°F to 14°F at rated airflow. High subcooling with high superheat suggests a restricted TXV or clogged liquid line filter-drier.';
        refDocId = 'doc-2';
        refDocTitle = 'Commercial HVAC & Heat Pump Maintenance Guide';
      } else if (lower.includes('thermal') || lower.includes('limit')) {
        aiText = 'To test secondary thermal limit switches: de-energize power, disconnect one spade lead, and measure continuity across terminals. It should read <0.3 ohms closed. If open at room temperature, the bimetal disc is tripped or open.';
        refDocId = 'doc-4';
        refDocTitle = 'Chiller & Compressor Diagnostic Troubleshooting Guide';
      } else {
        aiText = `According to our field technical database, verified procedure recommends inspecting all electrical terminations, checking supply voltage balance within 2%, and cross-checking operating pressures before cycling the load.`;
        refDocId = 'doc-2';
        refDocTitle = 'Commercial HVAC & Heat Pump Maintenance Guide';
      }

      const aiMsg: CallMessage = {
        id: `msg-${Date.now()}-ai`,
        speaker: 'assistant',
        timestamp: formatTimeSecs(activeCall.durationSeconds + 2),
        text: aiText,
        referenceDocId: refDocId,
        referenceDocTitle: refDocTitle,
      };

      setActiveCall(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
        status: 'Connected',
      }));
    }, 1200);
  };

  // WhatsApp
  const sendWhatsAppMessage = (clientId: string, text: string) => {
    if (!text.trim()) return;

    const outMsg = {
      id: `wa-out-${Date.now()}`,
      direction: 'outgoing' as const,
      text: text.trim(),
      timestamp: 'Just now',
      status: 'delivered' as const,
      senderName: 'Alex Reynolds (Field Tech)',
    };

    setWhatsAppConversations(prev => prev.map(conv => {
      if (conv.clientId === clientId) {
        return {
          ...conv,
          lastActive: 'Just now',
          messages: [...conv.messages, outMsg],
        };
      }
      return conv;
    }));

    addToast({
      title: 'WhatsApp Message Sent',
      message: `Message sent via simulated FieldAssist WhatsApp Gateway.`,
      type: 'info',
    });

    // Simulated client reply after 1.8s
    setTimeout(() => {
      const client = clients.find(c => c.id === clientId);
      const incomingReplies = [
        `Thanks for the update, Alex. We have confirmed the site access.`,
        `Received! Security has the work order registered at the gate.`,
        `Sounds good. Let me know when the diagnostic is complete!`,
      ];
      const replyText = incomingReplies[Math.floor(Math.random() * incomingReplies.length)];

      const incMsg = {
        id: `wa-in-${Date.now()}`,
        direction: 'incoming' as const,
        text: replyText,
        timestamp: 'Just now',
        status: 'delivered' as const,
        senderName: client ? client.name : 'Client Contact',
      };

      setWhatsAppConversations(prev => prev.map(conv => {
        if (conv.clientId === clientId) {
          return {
            ...conv,
            unreadCount: conv.unreadCount + 1,
            lastActive: 'Just now',
            messages: [...conv.messages, incMsg],
          };
        }
        return conv;
      }));

      addToast({
        title: 'New WhatsApp Reply',
        message: `${client?.name || 'Client'}: "${replyText.substring(0, 35)}..."`,
        type: 'info',
      });
    }, 1800);
  };

  // Twilio simulation
  const simulateTwilioEvent = () => {
    const newLog: TwilioCallLog = {
      id: `tw-${Date.now()}`,
      direction: 'Inbound',
      fromNumber: '+1 (555) 781-4420',
      toNumber: '+1 (555) 349-2841',
      duration: '01:15',
      status: 'Forwarded to Tech',
      timestamp: 'Just now',
      aiTranscribed: true,
      notes: 'Elena Rostova (Apex BioTech): Automated voice check-in regarding AHU-4B replacement timing.',
    };

    setTwilioLogs(prev => [newLog, ...prev]);
    addToast({
      title: 'Twilio Event Triggered',
      message: 'Simulated inbound call from +1 (555) 781-4420 logged and transcribed.',
      type: 'info',
    });
  };

  const resetDemoData = () => {
    localStorage.removeItem('fieldassist_jobs');
    localStorage.removeItem('fieldassist_clients');
    localStorage.removeItem('fieldassist_docs');
    localStorage.removeItem('fieldassist_call_logs');
    localStorage.removeItem('fieldassist_wa');
    localStorage.removeItem('fieldassist_twilio');
    setJobs(INITIAL_JOBS);
    setClients(INITIAL_CLIENTS);
    setKnowledgeDocs(INITIAL_KNOWLEDGE_DOCS);
    setCallLogs(INITIAL_CALL_LOGS);
    setWhatsAppConversations(INITIAL_WHATSAPP_CONVERSATIONS);
    setTwilioLogs(INITIAL_TWILIO_LOGS);
    setSelectedJobId(null);
    addToast({
      title: 'Demo Data Reset',
      message: 'Prototype reset to default demonstration data.',
      type: 'info',
    });
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedJobId,
        setSelectedJobId,
        selectedJob,
        selectedClientId,
        setSelectedClientId,
        selectedDocId,
        setSelectedDocId,
        jobs,
        createJob,
        updateJobStatus,
        addJobNote,
        addJobPhoto,
        clients,
        createClient,
        knowledgeDocs,
        uploadDocument,
        activeCall,
        startCall,
        endCall,
        sendCallMessage,
        callLogs,
        showSummaryModal,
        setShowSummaryModal,
        currentCompletedCall,
        whatsAppConversations,
        sendWhatsAppMessage,
        twilioLogs,
        simulateTwilioEvent,
        toasts,
        addToast,
        removeToast,
        openJobDetail,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function formatTimeSecs(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
