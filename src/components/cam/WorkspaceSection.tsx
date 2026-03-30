import { useState } from 'react';
import Icon from '@/components/ui/icon';

const toolpaths = [
  { id: 1, name: 'Контурная обработка', type: 'Контур', color: '#00ff9d', depth: 5, feed: 800, rpm: 12000, status: 'ok' },
  { id: 2, name: 'Карманная выборка', type: 'Карман', color: '#00e5ff', depth: 12, feed: 500, rpm: 10000, status: 'ok' },
  { id: 3, name: 'Сверление Ø8', type: 'Сверление', color: '#ffd93d', depth: 30, feed: 200, rpm: 3000, status: 'warn' },
  { id: 4, name: 'Финишное фрезерование', type: 'Финиш', color: '#ff6b35', depth: 2, feed: 1200, rpm: 18000, status: 'ok' },
];

export default function WorkspaceSection() {
  const [selected, setSelected] = useState(1);
  const [view, setView] = useState<'2d' | '3d'>('2d');

  return (
    <div className="flex-1 flex gap-3 p-3 min-h-0 animate-fade-in">
      {/* Left panel — toolpath list */}
      <div className="w-64 flex flex-col gap-2 flex-shrink-0">
        <div className="glass-panel rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(0,255,157,0.5)' }}>ТРАЕКТОРИИ</span>
            <button className="btn-neon text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-1">
              <Icon name="Plus" size={11} />
              Добавить
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {toolpaths.map(tp => (
              <button
                key={tp.id}
                onClick={() => setSelected(tp.id)}
                className="w-full text-left p-2.5 rounded-lg transition-all duration-150"
                style={{
                  background: selected === tp.id ? `rgba(0,255,157,0.08)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected === tp.id ? 'rgba(0,255,157,0.3)' : 'rgba(0,255,157,0.06)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tp.color, boxShadow: `0 0 6px ${tp.color}` }} />
                  <span className="text-xs font-golos font-medium truncate" style={{ color: selected === tp.id ? '#fff' : 'rgba(200,230,220,0.7)' }}>{tp.name}</span>
                  {tp.status === 'warn' && <Icon name="AlertTriangle" size={11} style={{ color: '#ffd93d', marginLeft: 'auto' }} />}
                </div>
                <div className="flex gap-3 ml-4">
                  <span className="text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>{tp.type}</span>
                  <span className="text-[9px] font-mono" style={{ color: 'rgba(0,229,255,0.4)' }}>↓{tp.depth}мм</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="glass-panel rounded-xl p-3">
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,255,157,0.5)' }}>ПАРАМЕТРЫ</div>
          {[
            { label: 'Подача', value: '800', unit: 'мм/мин' },
            { label: 'Обороты', value: '12,000', unit: 'об/мин' },
            { label: 'Глубина', value: '5.0', unit: 'мм' },
            { label: 'Время', value: '24:35', unit: 'мин' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'rgba(0,255,157,0.06)' }}>
              <span className="text-[10px] font-golos" style={{ color: 'rgba(160,200,180,0.6)' }}>{s.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-mono font-bold" style={{ color: '#00ff9d' }}>{s.value}</span>
                <span className="text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center — Canvas */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="glass-panel rounded-xl flex-1 relative overflow-hidden">
          {/* Canvas toolbar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(4,9,7,0.9)', border: '1px solid rgba(0,255,157,0.15)' }}>
              {(['2d', '3d'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider transition-all"
                  style={view === v
                    ? { background: 'rgba(0,255,157,0.2)', color: '#00ff9d', boxShadow: '0 0 8px rgba(0,255,157,0.3)' }
                    : { color: 'rgba(0,255,157,0.4)' }}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(4,9,7,0.9)', border: '1px solid rgba(0,255,157,0.15)' }}>
              {['Move', 'Maximize2', 'RotateCcw'].map(ic => (
                <button key={ic} className="toolbar-btn w-7 h-7 rounded-md">
                  <Icon name={ic} size={12} />
                </button>
              ))}
            </div>
          </div>

          {/* Grid canvas */}
          <div className="cam-canvas w-full h-full flex items-center justify-center relative overflow-hidden" style={{ minHeight: 300 }}>
            {/* Grid lines decoration */}
            <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity: 0.6 }}>
              {/* Origin cross */}
              <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="rgba(0,255,157,0.15)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="rgba(0,255,157,0.15)" strokeWidth="1" strokeDasharray="4,4" />

              {/* Toolpaths */}
              {/* Contour */}
              <rect x="25%" y="22%" width="50%" height="56%" rx="4" fill="none" stroke="#00ff9d" strokeWidth="1.5" strokeDasharray="0"
                style={{ filter: 'drop-shadow(0 0 4px #00ff9d)' }} />
              {/* Pocket spiral */}
              <rect x="32%" y="30%" width="36%" height="40%" rx="3" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.8"
                style={{ filter: 'drop-shadow(0 0 3px #00e5ff)' }} />
              <rect x="37%" y="35%" width="26%" height="30%" rx="2" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
              <rect x="42%" y="40%" width="16%" height="20%" rx="1" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.4" />
              {/* Drill points */}
              {[[30, 28], [70, 28], [30, 72], [70, 72]].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={`${cx}%`} cy={`${cy}%`} r="5" fill="none" stroke="#ffd93d" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 3px #ffd93d)' }} />
                  <circle cx={`${cx}%`} cy={`${cy}%`} r="1.5" fill="#ffd93d" />
                  <line x1={`${cx - 2}%`} y1={`${cy}%`} x2={`${cx + 2}%`} y2={`${cy}%`} stroke="#ffd93d" strokeWidth="1" opacity="0.5" />
                  <line x1={`${cx}%`} y1={`${cy - 2}%`} x2={`${cx}%`} y2={`${cy + 2}%`} stroke="#ffd93d" strokeWidth="1" opacity="0.5" />
                </g>
              ))}
              {/* Tool position */}
              <circle cx="50%" cy="50%" r="6" fill="none" stroke="#ff6b35" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px #ff6b35)' }} />
              <circle cx="50%" cy="50%" r="2" fill="#ff6b35" />
              {/* Rapid moves */}
              <line x1="20%" y1="20%" x2="25%" y2="22%" stroke="#ff6b35" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />

              {/* Axis labels */}
              <text x="51%" y="18%" fill="rgba(0,255,157,0.4)" fontSize="10" fontFamily="JetBrains Mono">+Y</text>
              <text x="82%" y="52%" fill="rgba(0,255,157,0.4)" fontSize="10" fontFamily="JetBrains Mono">+X</text>
            </svg>

            {/* Corner labels */}
            <div className="absolute top-14 left-4 text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.35)' }}>
              X: 125.340<br />Y: 87.220<br />Z: -5.000
            </div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono" style={{ color: 'rgba(0,229,255,0.35)' }}>
              МАСШТАБ 1:1 | {view.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-6">
          {[
            { icon: 'Route', label: 'Путь', value: '1,247.3 мм', color: '#00ff9d' },
            { icon: 'Clock', label: 'Время обработки', value: '24:35', color: '#00e5ff' },
            { icon: 'Zap', label: 'Макс. подача', value: '1,200 мм/мин', color: '#ffd93d' },
            { icon: 'Layers', label: 'Проходов', value: '8', color: '#ff6b35' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <Icon name={stat.icon} size={13} style={{ color: stat.color }} />
              <div>
                <div className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.5)' }}>{stat.label}</div>
                <div className="text-xs font-mono font-bold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#00ff9d', boxShadow: '0 0 4px #00ff9d' }} />
            <span className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.6)' }}>ПРОВЕРКА ПРОЙДЕНА</span>
          </div>
        </div>
      </div>

      {/* Right panel — properties */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2">
        <div className="glass-panel rounded-xl p-3">
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,255,157,0.5)' }}>ИНСТРУМЕНТ</div>
          <div className="text-sm font-golos font-semibold mb-1" style={{ color: '#fff' }}>Фреза Ø8мм 4зуба</div>
          <div className="text-[10px] font-golos mb-3" style={{ color: 'rgba(160,200,180,0.5)' }}>HSS-Co, твёрдосплав</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: 'Ø', v: '8.0' },
              { l: 'Зубья', v: '4' },
              { l: 'Вылет', v: '32мм' },
              { l: 'Тип', v: 'Концевая' },
            ].map(({ l, v }) => (
              <div key={l} className="p-2 rounded-lg" style={{ background: 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.08)' }}>
                <div className="text-[8px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>{l}</div>
                <div className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3 flex-1">
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,229,255,0.5)' }}>G-КОД ПРЕВЬЮ</div>
          <div className="text-[9px] font-mono leading-5" style={{ color: 'rgba(0,229,255,0.7)' }}>
            <div><span style={{ color: '#ffd93d' }}>%</span></div>
            <div><span style={{ color: '#ff6b35' }}>O0001</span></div>
            <div style={{ color: 'rgba(160,200,180,0.4)' }}>(CAMFLOW EXPORT)</div>
            <div><span style={{ color: '#00ff9d' }}>G90</span> G94 G17</div>
            <div><span style={{ color: '#00ff9d' }}>G54</span></div>
            <div><span style={{ color: '#00e5ff' }}>T1</span> <span style={{ color: '#00ff9d' }}>M6</span></div>
            <div><span style={{ color: '#00ff9d' }}>S12000</span> <span style={{ color: '#ffd93d' }}>M3</span></div>
            <div><span style={{ color: '#00ff9d' }}>G0</span> X0. Y0.</div>
            <div><span style={{ color: '#00ff9d' }}>G43</span> H1 Z5.</div>
            <div><span style={{ color: '#00ff9d' }}>G1</span> Z-5. F200.</div>
            <div>X125.340 F800.</div>
            <div>Y87.220</div>
            <div>...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
