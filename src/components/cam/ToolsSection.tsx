import { useState } from 'react';
import Icon from '@/components/ui/icon';

const tools = [
  { id: 1, name: 'Концевая фреза Ø8', brand: 'Sandvik', material: 'HSS-Co', diameter: 8, flutes: 4, length: 32, rpm: 12000, feed: 800, type: 'mill', status: 'ok' },
  { id: 2, name: 'Концевая фреза Ø12', brand: 'ISCAR', material: 'Твёрдосплав', diameter: 12, flutes: 4, length: 45, rpm: 8000, feed: 1200, type: 'mill', status: 'ok' },
  { id: 3, name: 'Сверло Ø6.5', brand: 'Guhring', material: 'HSS', diameter: 6.5, flutes: 2, length: 60, rpm: 4000, feed: 150, type: 'drill', status: 'warn' },
  { id: 4, name: 'Сверло Ø10', brand: 'Dormer', material: 'Твёрдосплав', diameter: 10, flutes: 2, length: 80, rpm: 2500, feed: 200, type: 'drill', status: 'ok' },
  { id: 5, name: 'Торцевая фреза Ø50', brand: 'Mitsubishi', material: 'Пластины', diameter: 50, flutes: 5, length: 40, rpm: 2000, feed: 2500, type: 'face', status: 'ok' },
  { id: 6, name: 'Гравёр 60°', brand: 'Sorotec', material: 'HSS-Co', diameter: 0.3, flutes: 1, length: 38, rpm: 24000, feed: 300, type: 'engrave', status: 'ok' },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  mill: { label: 'Фрезерование', color: '#00ff9d' },
  drill: { label: 'Сверление', color: '#00e5ff' },
  face: { label: 'Торцевание', color: '#ffd93d' },
  engrave: { label: 'Гравировка', color: '#ff6b35' },
};

export default function ToolsSection() {
  const [selected, setSelected] = useState(1);
  const tool = tools.find(t => t.id === selected)!;

  return (
    <div className="flex-1 flex gap-3 p-3 min-h-0 animate-fade-in">
      {/* Tool list */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest mb-0.5" style={{ color: 'rgba(0,255,157,0.5)' }}>БИБЛИОТЕКА ИНСТРУМЕНТОВ</div>
              <div className="text-xs font-golos" style={{ color: 'rgba(160,200,180,0.5)' }}>{tools.length} инструментов</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-neon text-[10px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Icon name="Upload" size={12} />
                Импорт
              </button>
              <button className="btn-neon-solid text-[10px] font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Icon name="Plus" size={12} />
                Новый
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {tools.map(t => {
              const { label, color } = typeLabels[t.type];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-150"
                  style={{
                    background: selected === t.id ? 'rgba(0,255,157,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected === t.id ? 'rgba(0,255,157,0.25)' : 'rgba(0,255,157,0.06)'}`,
                  }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                    <Icon name={t.type === 'drill' ? 'Drill' : t.type === 'engrave' ? 'Pen' : 'Wrench'}
                      fallback="Wrench" size={18} style={{ color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-golos font-semibold" style={{ color: selected === t.id ? '#fff' : 'rgba(200,230,220,0.8)' }}>{t.name}</span>
                      {t.status === 'warn' && <Icon name="AlertTriangle" size={12} style={{ color: '#ffd93d' }} />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tag-badge" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>{label}</span>
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(160,200,180,0.4)' }}>{t.brand}</span>
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(160,200,180,0.4)' }}>{t.material}</span>
                    </div>
                  </div>

                  {/* Params */}
                  <div className="flex gap-4 flex-shrink-0">
                    {[
                      { l: 'Ø', v: `${t.diameter}мм` },
                      { l: 'RPM', v: t.rpm.toLocaleString() },
                      { l: 'F', v: `${t.feed}` },
                    ].map(({ l, v }) => (
                      <div key={l} className="text-right">
                        <div className="text-[8px] font-mono" style={{ color: 'rgba(0,255,157,0.35)' }}>{l}</div>
                        <div className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tool detail */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,255,157,0.5)' }}>ДЕТАЛИ</div>
          <div className="text-base font-golos font-bold mb-1" style={{ color: '#fff' }}>{tool.name}</div>
          <div className="text-[10px] font-golos mb-4" style={{ color: 'rgba(160,200,180,0.5)' }}>{tool.brand} · {tool.material}</div>

          {/* Visual tool representation */}
          <div className="rounded-xl p-4 mb-4 flex items-end justify-center gap-1" style={{ background: 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.1)', minHeight: 80 }}>
            <div className="flex flex-col items-center gap-0.5">
              <div className="rounded-sm" style={{ width: 16, height: 32, background: 'linear-gradient(180deg,rgba(0,255,157,0.6),rgba(0,229,255,0.4))', boxShadow: '0 0 10px rgba(0,255,157,0.3)' }} />
              <div className="rounded-b-sm" style={{ width: 10, height: 20, background: 'linear-gradient(180deg,rgba(0,229,255,0.5),rgba(0,229,255,0.2))', boxShadow: '0 0 8px rgba(0,229,255,0.3)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { l: 'Диаметр', v: `${tool.diameter} мм` },
              { l: 'Зубья', v: tool.flutes },
              { l: 'Длина', v: `${tool.length} мм` },
              { l: 'Тип', v: typeLabels[tool.type].label },
              { l: 'Макс. об/мин', v: tool.rpm.toLocaleString() },
              { l: 'Подача', v: `${tool.feed} мм/мин` },
            ].map(({ l, v }) => (
              <div key={l} className="p-2 rounded-lg" style={{ background: 'rgba(0,255,157,0.03)', border: '1px solid rgba(0,255,157,0.07)' }}>
                <div className="text-[8px] font-mono mb-0.5" style={{ color: 'rgba(0,255,157,0.4)' }}>{l}</div>
                <div className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-neon-solid w-full py-2.5 rounded-xl text-sm font-golos font-semibold flex items-center justify-center gap-2">
          <Icon name="CheckCircle" size={15} />
          Применить инструмент
        </button>
      </div>
    </div>
  );
}
