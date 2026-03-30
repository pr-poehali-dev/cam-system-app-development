import Icon from '@/components/ui/icon';

export type Section =
  | 'workspace'
  | 'tools'
  | 'projects'
  | 'simulation'
  | 'library'
  | 'parameters'
  | 'export'
  | 'help';

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'workspace', label: 'Рабочее пространство', icon: 'Monitor', badge: 'ACTIVE' },
  { id: 'tools', label: 'Инструменты', icon: 'Wrench' },
  { id: 'projects', label: 'Проекты', icon: 'FolderOpen' },
  { id: 'simulation', label: 'Симуляция', icon: 'Play' },
  { id: 'library', label: 'Библиотека', icon: 'BookOpen' },
  { id: 'parameters', label: 'Параметры', icon: 'SlidersHorizontal' },
  { id: 'export', label: 'Экспорт', icon: 'Download' },
  { id: 'help', label: 'Справка', icon: 'HelpCircle' },
];

interface SidebarProps {
  active: Section;
  onChange: (s: Section) => void;
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="w-[220px] flex-shrink-0 h-screen flex flex-col" style={{ background: 'rgba(4,9,7,0.95)', borderRight: '1px solid rgba(0,255,157,0.1)' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(0,255,157,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-glow-pulse" style={{ background: 'linear-gradient(135deg,#00ff9d,#00c97a)', boxShadow: '0 0 16px rgba(0,255,157,0.5)' }}>
            <span className="text-xs font-bold font-mono" style={{ color: '#050d0a' }}>CF</span>
          </div>
          <div>
            <div className="text-sm font-bold font-golos neon-text">CamFlow</div>
            <div className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(0,255,157,0.4)' }}>CAM v2.5.1</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 relative group"
            style={{
              animationDelay: `${i * 0.05}s`,
              ...(active === item.id
                ? { background: 'linear-gradient(135deg,rgba(0,255,157,0.12),rgba(0,229,255,0.05))', borderLeft: '2px solid #00ff9d', color: '#00ff9d' }
                : { borderLeft: '2px solid transparent', color: 'rgba(0,255,157,0.45)' })
            }}
          >
            <Icon
              name={item.icon}
              size={16}
              className={active === item.id ? 'neon-text' : ''}
              style={{ color: active === item.id ? '#00ff9d' : 'rgba(0,255,157,0.45)' }}
            />
            <span className="text-xs font-golos font-medium tracking-wide">{item.label}</span>
            {item.badge && (
              <span className="ml-auto tag-badge" style={{ background: 'rgba(0,255,157,0.15)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.3)' }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Status bar */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(0,255,157,0.1)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#00ff9d', boxShadow: '0 0 6px #00ff9d' }} />
          <span className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.6)' }}>СИСТЕМА ГОТОВА</span>
        </div>
        <div className="text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.3)' }}>
          CPU: 23% | RAM: 4.2GB
        </div>
      </div>
    </aside>
  );
}
