import { useState } from 'react';
import Icon from '@/components/ui/icon';

const projects = [
  { id: 1, name: 'Корпус редуктора', client: 'МашПром ООО', material: 'Алюминий 6061', ops: 12, time: '4ч 23м', updated: '30 мар 2026', status: 'done', progress: 100 },
  { id: 2, name: 'Фланец насоса Ø150', client: 'НефтеТех', material: 'Сталь 30ХГСА', ops: 8, time: '2ч 10м', updated: '29 мар 2026', status: 'active', progress: 65 },
  { id: 3, name: 'Плита основания', client: 'РобоСистем', material: 'Чугун СЧ20', ops: 5, time: '1ч 45м', updated: '28 мар 2026', status: 'draft', progress: 30 },
  { id: 4, name: 'Шестерня Z=24', client: 'АвтоДеталь', material: 'Сталь 40Х', ops: 6, time: '3ч 02м', updated: '27 мар 2026', status: 'done', progress: 100 },
  { id: 5, name: 'Крышка подшипника', client: 'ТurboParts', material: 'Бронза БрАЖ', ops: 4, time: '0ч 58м', updated: '26 мар 2026', status: 'error', progress: 50 },
];

const statusMap: Record<string, { label: string; color: string }> = {
  done: { label: 'ГОТОВО', color: '#00ff9d' },
  active: { label: 'В РАБОТЕ', color: '#00e5ff' },
  draft: { label: 'ЧЕРНОВИК', color: '#ffd93d' },
  error: { label: 'ОШИБКА', color: '#ff3b5c' },
};

export default function ProjectsSection() {
  const [search, setSearch] = useState('');
  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 p-3 flex flex-col gap-3 min-h-0 animate-fade-in overflow-auto">
      {/* Header */}
      <div className="glass-panel rounded-xl p-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-base font-golos font-bold" style={{ color: '#fff' }}>Проекты</div>
          <div className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>{projects.length} проектов · {projects.filter(p => p.status === 'done').length} завершено</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,255,157,0.4)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono outline-none"
              style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)', color: '#00ff9d', width: 180 }}
            />
          </div>
          <button className="btn-neon-solid text-[10px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Icon name="Plus" size={12} />
            Новый проект
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        {[
          { icon: 'FolderOpen', label: 'Всего', value: projects.length, color: '#00ff9d' },
          { icon: 'CheckCircle', label: 'Завершено', value: projects.filter(p => p.status === 'done').length, color: '#00ff9d' },
          { icon: 'Clock', label: 'В работе', value: projects.filter(p => p.status === 'active').length, color: '#00e5ff' },
          { icon: 'AlertCircle', label: 'С ошибкой', value: projects.filter(p => p.status === 'error').length, color: '#ff3b5c' },
        ].map(stat => (
          <div key={stat.label} className="glass-panel rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
              <Icon name={stat.icon} size={16} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.5)' }}>{stat.label}</div>
              <div className="text-lg font-mono font-bold" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Project list */}
      <div className="flex flex-col gap-2">
        {filtered.map(p => {
          const { label, color } = statusMap[p.status];
          return (
            <div key={p.id} className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:border-opacity-30 transition-all cursor-pointer group"
              style={{ border: '1px solid rgba(0,255,157,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,157,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,157,0.08)')}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                <Icon name="Box" size={18} style={{ color }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-golos font-semibold" style={{ color: '#fff' }}>{p.name}</span>
                  <span className="tag-badge" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(160,200,180,0.5)' }}>{p.client}</span>
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(160,200,180,0.35)' }}>·</span>
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(160,200,180,0.5)' }}>{p.material}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="w-28 flex-shrink-0">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>Прогресс</span>
                  <span className="text-[9px] font-mono" style={{ color }}>{p.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,157,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%`, background: `linear-gradient(90deg,${color},${color}aa)`, boxShadow: `0 0 8px ${color}50` }} />
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 flex-shrink-0">
                {[{ l: 'Операций', v: p.ops }, { l: 'Время', v: p.time }].map(({ l, v }) => (
                  <div key={l} className="text-right">
                    <div className="text-[8px] font-mono" style={{ color: 'rgba(0,255,157,0.35)' }}>{l}</div>
                    <div className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Date & actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.35)' }}>{p.updated}</span>
                <button className="toolbar-btn w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="MoreHorizontal" size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
