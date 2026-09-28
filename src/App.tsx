import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AssistantView } from './components/AssistantView';
import { KnowledgeView } from './components/KnowledgeView';
import { JobsView } from './components/JobsView';
import { JobDetailView } from './components/JobDetailView';
import { ClientsView } from './components/ClientsView';
import { CommunicationsView } from './components/CommunicationsView';
import { CallSummaryModal } from './components/CallSummaryModal';
import { ToastContainer } from './components/Toast';

const AppContent: React.FC = () => {
  const { activePage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 md:hidden backdrop-blur-xs"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-64 h-full bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)}
          onOpenCreateJob={() => setIsCreateJobModalOpen(true)}
          onOpenAddClient={() => setIsAddClientModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activePage === 'dashboard' && (
            <DashboardView 
              onOpenCreateJob={() => setIsCreateJobModalOpen(true)}
              onOpenAddClient={() => setIsAddClientModalOpen(true)}
            />
          )}

          {activePage === 'assistant' && (
            <AssistantView />
          )}

          {activePage === 'knowledge' && (
            <KnowledgeView />
          )}

          {activePage === 'jobs' && (
            <JobsView 
              isCreateModalOpen={isCreateJobModalOpen}
              setIsCreateModalOpen={setIsCreateJobModalOpen}
            />
          )}

          {activePage === 'job-detail' && (
            <JobDetailView />
          )}

          {activePage === 'clients' && (
            <ClientsView 
              isAddClientModalOpen={isAddClientModalOpen}
              setIsAddClientModalOpen={setIsAddClientModalOpen}
            />
          )}

          {activePage === 'communications' && (
            <CommunicationsView />
          )}
        </main>
      </div>

      {/* Post-Call Summary Modal */}
      <CallSummaryModal />

      {/* Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
