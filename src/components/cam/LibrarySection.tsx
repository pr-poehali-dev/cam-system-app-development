import { useState } from 'react';
import Icon from '@/components/ui/icon';

const materials = [
  { id: 1, name: 'Алюминий 6061-T6', group: 'Цветные металлы', hardness: 95, density: 2.7, sfm: 600, color: '#00e5ff' },
  { id: 2, name: 'Сталь 30ХГСА', group: 'Конструкционные стали', hardness: 280, density: 7.85, sfm: 200, color: '#ffd93d' },
  { id: 3, name: 'Нержавеющая 316L', group: 'Нержавеющие стали', hardness: 175, density: 7.98, sfm: 130, color: '#ff6b35' },
  { id: 4, name: 'Бронза БрАЖ9-4', group: 'Цветные металлы', hardness: 120, density: 7.6, sfm: 400, color: '#00e5ff' },
  { id: 5, name: 'Чугун СЧ20', group: 'Чугуны', hardness: 200, density: 7.2, sfm: 160, color: '#ffd93d' },
  { id: 6, name: 'Пластик АБС', group: 'Пластики', hardness: 40, density: 1.05, sfm: 1200, color: '#00ff9d' },
];

const operations = [
  { id: 1, name: 'Контурное фрезерование', icon: 'Square', desc: 'Обработка по контуру 2D профиля', category: 'Фрезерование' },
  { id: 2, name: 'Карманная выборка', icon: 'Layers', desc: 'Выборка замкнутого кармана', category: 'Фрезерование' },
  { id: 3, name: 'Сверление', icon: 'Circle', desc: 'Цикл сверления G81/G83', category: 'Сверление' },
  { id: 4, name: 'Торцевое фрезерование', icon: 'Minus', desc: 'Чистовая обработка поверхности', category: 'Фрезерование' },
  { id: 5, name: 'Растачивание', icon: 'CircleDot', desc: 'Расточка отверстий G76', category: 'Точение' },
  { id: 6, name: 'Гравировка', icon: 'Pen', desc: 'Гравировка текста и логотипов', category: 'Спец' },
];

type Tab = 'materials' | 'operations' | 'postprocs';

export default function LibrarySection() {
  const [tab, setTab] = useState<Tab>('materials');

  return (
    <div className="flex-1 p-3 flex flex-col gap-3 min-h-0 animate-fade-in overflow-auto">
      {/* Tabs */}
      <div className="glass-panel rounded-xl p-1 flex gap-1 flex-shrink-0" style={{ width: 'fit-content' }}>
        {(['materials', 'operations', 'postprocs'] as Tab[]).map(t => {
          const labels: Record<Tab, string> = { materials: 'Материалы', operations: 'Операции', postprocs: 'Постпроцессоры' };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-xs font-golos font-medium transition-all"
              style={tab === t
                ? { background: 'rgba(0,255,157,0.15)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.3)', boxShadow: '0 0 10px rgba(0,255,157,0.15)' }
                : { color: 'rgba(160,200,180,0.5)', border: '1px solid transparent' }}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {tab === 'materials' && (
        <div className="grid grid-cols-2 gap-3">
          {materials.map(m => (
            <div key={m.id} className="glass-panel rounded-xl p-4 cursor-pointer transition-all"
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${m.color}30`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,157,0.1)')}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-golos font-semibold mb-0.5" style={{ color: '#fff' }}>{m.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: 'rgba(160,200,180,0.5)' }}>{m.group}</div>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                  <Icon name="Layers" size={15} style={{ color: m.color }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: 'Твёрд. HB', v: m.hardness },
                  { l: 'Плотн.', v: `${m.density}` },
                  { l: 'SFM', v: m.sfm },
                ].map(({ l, v }) => (
                  <div key={l} className="p-2 rounded-lg text-center" style={{ background: 'rgba(0,255,157,0.03)', border: '1px solid rgba(0,255,157,0.07)' }}>
                    <div className="text-[8px] font-mono mb-0.5" style={{ color: 'rgba(0,255,157,0.4)' }}>{l}</div>
                    <div className="text-xs font-mono font-bold" style={{ color: m.color }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'operations' && (
        <div className="grid grid-cols-3 gap-3">
          {operations.map(op => (
            <div key={op.id} className="glass-panel rounded-xl p-4 cursor-pointer transition-all hover:border-green-500/20 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.15)' }}>
                <Icon name={op.icon} fallback="Box" size={20} style={{ color: '#00ff9d' }} />
              </div>
              <div className="text-sm font-golos font-semibold mb-1" style={{ color: '#fff' }}>{op.name}</div>
              <div className="text-[10px] font-golos mb-3" style={{ color: 'rgba(160,200,180,0.5)' }}>{op.desc}</div>
              <span className="tag-badge" style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' }}>
                {op.category}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'postprocs' && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Fanuc 0i-MF', ext: '.NC', machines: 'Фрезерные', desc: 'Стандартный постпроцессор Fanuc' },
            { name: 'Siemens 840D', ext: '.MPF', machines: 'Фрезерные/Токарные', desc: 'Siemens Sinumerik 840D sl' },
            { name: 'Heidenhain iTNC530', ext: '.H', machines: 'Фрезерные', desc: 'Диалект Heidenhain' },
            { name: 'HAAS Mill', ext: '.NC', machines: 'Фрезерные HAAS', desc: 'Специфика HAAS VF/UMC' },
            { name: 'Mazak Mazatrol', ext: '.EIA', machines: 'Mazak', desc: 'Mazatrol SmoothX' },
            { name: 'Generic G-code', ext: '.NC', machines: 'Универсальный', desc: 'ISO 6983 стандарт' },
          ].map(pp => (
            <div key={pp.name} className="glass-panel rounded-xl p-4 flex items-start gap-3 cursor-pointer"
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,157,0.1)')}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}>
                <Icon name="Cpu" size={18} style={{ color: '#00e5ff' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-golos font-semibold" style={{ color: '#fff' }}>{pp.name}</span>
                  <span className="tag-badge" style={{ background: 'rgba(0,255,157,0.1)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.2)' }}>{pp.ext}</span>
                </div>
                <div className="text-[10px] font-mono mb-1" style={{ color: 'rgba(160,200,180,0.5)' }}>{pp.machines}</div>
                <div className="text-[10px] font-golos" style={{ color: 'rgba(160,200,180,0.4)' }}>{pp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
