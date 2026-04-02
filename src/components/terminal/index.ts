import { useState } from 'react';
import CyberpunkBackground from '@/components/CyberpunkBackground';
import Terminal from '@/components/Terminal';
import SideMenu from '@/components/SideMenu';
import ContentPanel from '@/components/ContentPanel';
import ScanlineOverlay from '@/components/ScanlineOverlay';
import GlitchText from '@/components/GlitchText';
import { 
  PanelLeftClose, 
  PanelLeftOpen,
  Monitor,
  Layout
} from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'terminal' | 'gui'>('split');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <CyberpunkBackground />
      
      {/* Scanline Overlay */}
      <ScanlineOverlay />

      {/* Main Interface */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="h-12 bg-card/90 backdrop-blur-md border-b border-primary/30 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-primary"
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-terminal text-xs text-muted-foreground">
                SYSTEM ONLINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GlitchText 
              text="NETRUNNER_PORTFOLIO" 
              className="font-cyber text-sm text-primary hidden md:block"
              glitchIntensity="low"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-sm p-1">
              <button
                onClick={() => setViewMode('gui')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'gui' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                title="GUI Only"
              >
                <Layout className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'split' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                title="Split View"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('terminal')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'terminal' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                title="Terminal Only"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-terminal text-muted-foreground">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Hidden in terminal mode */}
          {viewMode !== 'terminal' && sidebarOpen && (
            <aside className="w-64 flex-shrink-0 animate-slide-in-left">
              <SideMenu 
                onSelect={setActiveSection} 
                activeSection={activeSection}
              />
            </aside>
          )}

          {/* Main Panels */}
          <main className="flex-1 flex gap-2 p-2 overflow-hidden">
            {/* GUI Content Panel */}
            {(viewMode === 'gui' || viewMode === 'split') && (
              <div className={`
                bg-card/80 backdrop-blur-sm border border-primary/20 rounded-sm overflow-hidden
                ${viewMode === 'split' ? 'w-1/2' : 'w-full'}
                animate-fade-in
              `}>
                <div className="h-8 bg-muted/30 border-b border-primary/20 flex items-center px-4">
                  <span className="font-terminal text-xs text-muted-foreground">
                    // {activeSection.toUpperCase()}_DATA
                  </span>
                </div>
                <ContentPanel activeSection={activeSection} />
              </div>
            )}

            {/* Terminal Panel */}
            {(viewMode === 'terminal' || viewMode === 'split') && (
              <div className={`
                overflow-hidden rounded-sm
                ${viewMode === 'split' ? 'w-1/2' : 'w-full'}
                animate-fade-in
              `}>
                <Terminal />
              </div>
            )}
          </main>
        </div>

        {/* Bottom Status Bar */}
        <footer className="h-8 bg-card/90 backdrop-blur-md border-t border-primary/30 flex items-center justify-between px-4 text-xs font-terminal">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>RAM: <span className="text-secondary">32TB</span></span>
            <span>CPU: <span className="text-primary">98.7%</span></span>
            <span>NET: <span className="text-accent">SECURE</span></span>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>LOCATION: <span className="text-warning">NIGHT CITY</span></span>
            <span className="text-primary">v2.077</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
