import Icon from '@/components/ui/icon';

interface TopbarProps {
  section: string;
}

const sectionLabels: Record<string, string> = {
  workspace: 'Рабочее пространство',
  tools: 'Инструменты',
  projects: 'Проекты',
  simulation: 'Симуляция',
  library: 'Библиотека',
  parameters: 'Параметры',
  export: 'Экспорт',
  help: 'Справка',
};

export default function Topbar({ section }: TopbarProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="h-12 flex items-center justify-between px-4 flex-shrink-0"
      style={{ background: 'rgba(4,9,7,0.9)', borderBottom: '1px solid rgba(0,255,157,0.1)', backdropFilter: 'blur(12px)' }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(0,255,157,0.35)' }}>CAMFLOW</span>
        <Icon name="ChevronRight" size={12} style={{ color: 'rgba(0,255,157,0.25)' }} />
        <span className="text-xs font-golos font-semibold neon-text">{sectionLabels[section] || section}</span>
      </div>

      {/* Center toolbar */}
      <div className="flex items-center gap-1">
        {['Undo2', 'Redo2', 'ZoomIn', 'ZoomOut', 'Maximize2', 'Grid3X3'].map((icon) => (
          <button key={icon} className="toolbar-btn">
            <Icon name={icon} size={14} />
          </button>
        ))}
        <div className="w-px h-6 mx-1" style={{ background: 'rgba(0,255,157,0.15)' }} />
        {['Play', 'Pause', 'Square'].map((icon) => (
          <button key={icon} className="toolbar-btn">
            <Icon name={icon} size={14} />
          </button>
        ))}
      </div>

      {/* Right info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#00ff9d', boxShadow: '0 0 4px #00ff9d' }} />
          <span className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.5)' }}>ONLINE</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.35)' }}>{timeStr}</span>
        <button className="toolbar-btn">
          <Icon name="Bell" size={14} />
        </button>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-mono"
          style={{ background: 'linear-gradient(135deg,rgba(0,255,157,0.2),rgba(0,229,255,0.1))', border: '1px solid rgba(0,255,157,0.3)', color: '#00ff9d' }}>
          ЮА
        </div>
      </div>
    </header>
  );
}
