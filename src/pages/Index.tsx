import { useState } from 'react';
import Sidebar, { type Section } from '@/components/cam/Sidebar';
import Topbar from '@/components/cam/Topbar';
import WorkspaceSection from '@/components/cam/WorkspaceSection';
import ToolsSection from '@/components/cam/ToolsSection';
import ProjectsSection from '@/components/cam/ProjectsSection';
import SimulationSection from '@/components/cam/SimulationSection';
import LibrarySection from '@/components/cam/LibrarySection';
import ParametersSection from '@/components/cam/ParametersSection';
import ExportSection from '@/components/cam/ExportSection';
import HelpSection from '@/components/cam/HelpSection';
import { CamProvider } from '@/components/cam/CamContext';

export default function Index() {
  const [section, setSection] = useState<Section>('workspace');

  const renderSection = () => {
    switch (section) {
      case 'workspace': return <WorkspaceSection />;
      case 'tools': return <ToolsSection />;
      case 'projects': return <ProjectsSection />;
      case 'simulation': return <SimulationSection />;
      case 'library': return <LibrarySection />;
      case 'parameters': return <ParametersSection onNavigate={setSection} />;
      case 'export': return <ExportSection />;
      case 'help': return <HelpSection />;
      default: return <WorkspaceSection />;
    }
  };

  return (
    <CamProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: '#060d0b' }}>
        <Sidebar active={section} onChange={setSection} />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <Topbar section={section} />
          <main className="flex-1 flex min-h-0 overflow-hidden">
            {renderSection()}
          </main>
        </div>
      </div>
    </CamProvider>
  );
}