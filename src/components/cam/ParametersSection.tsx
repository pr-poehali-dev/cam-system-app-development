import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color?: string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, unit, color = '#00ff9d', onChange }: SliderFieldProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-xs font-golos" style={{ color: 'rgba(160,200,180,0.7)' }}>{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{value} <span style={{ color: 'rgba(0,255,157,0.4)', fontWeight: 400 }}>{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full outline-none cursor-pointer"
        style={{
          WebkitAppearance: 'none',
          background: `linear-gradient(90deg, ${color} ${((value - min) / (max - min)) * 100}%, rgba(0,255,157,0.1) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}

export default function ParametersSection() {
  const [feed, setFeed] = useState(800);
  const [rpm, setRpm] = useState(12000);
  const [depth, setDepth] = useState(5);
  const [stepover, setStepover] = useState(40);
  const [coolant, setCoolant] = useState(true);
  const [compensation, setCompensation] = useState('left');
  const [tolerance, setTolerance] = useState(0.01);

  return (
    <div className="flex-1 p-3 flex gap-3 min-h-0 animate-fade-in overflow-auto">
      {/* Column 1 */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(0,255,157,0.5)' }}>РЕЖИМЫ РЕЗАНИЯ</div>
          <SliderField label="Подача" value={feed} min={50} max={5000} unit="мм/мин" onChange={setFeed} />
          <SliderField label="Обороты шпинделя" value={rpm} min={100} max={30000} unit="об/мин" color="#00e5ff" onChange={setRpm} />
          <SliderField label="Глубина резания" value={depth} min={0} max={50} unit="мм" color="#ffd93d" onChange={setDepth} />
          <SliderField label="Перекрытие (stepover)" value={stepover} min={1} max={100} unit="%" color="#ff6b35" onChange={setStepover} />

          {/* Calculated results */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.1)' }}>
            <div className="text-[9px] font-mono tracking-widest mb-2" style={{ color: 'rgba(0,255,157,0.4)' }}>РАСЧЁТ</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: 'Vc (скорость резания)', v: `${((Math.PI * 8 * rpm) / 1000).toFixed(0)} м/мин` },
                { l: 'fz (подача на зуб)', v: `${(feed / (rpm * 4) * 1000).toFixed(3)} мм` },
                { l: 'MRR', v: `${((feed * depth * stepover / 100 * 8) / 1000).toFixed(2)} см³/мин` },
              ].map(({ l, v }) => (
                <div key={l}>
                  <div className="text-[8px] font-mono mb-0.5" style={{ color: 'rgba(0,255,157,0.35)' }}>{l}</div>
                  <div className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(0,229,255,0.5)' }}>ДОПУСКИ</div>
          <SliderField label="Точность" value={Math.round(tolerance * 1000)} min={1} max={100} unit="мкм" color="#00e5ff"
            onChange={v => setTolerance(v / 1000)} />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['Черновая (0.1мм)', 'Получист. (0.05мм)', 'Чист. (0.01мм)'].map(t => (
              <button key={t} className="py-1.5 px-2 rounded-lg text-[9px] font-mono text-center transition-all btn-neon"
                onClick={() => setTolerance(t.includes('0.1') ? 0.1 : t.includes('0.05') ? 0.05 : 0.01)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(255,107,53,0.5)' }}>СТРАТЕГИЯ</div>

          <div className="mb-4">
            <div className="text-xs font-golos mb-2" style={{ color: 'rgba(160,200,180,0.7)' }}>Компенсация инструмента</div>
            <div className="grid grid-cols-3 gap-1.5">
              {['none', 'left', 'right'].map(c => {
                const labels: Record<string, string> = { none: 'Нет', left: 'Левая', right: 'Правая' };
                return (
                  <button key={c} onClick={() => setCompensation(c)}
                    className="py-1.5 rounded-lg text-[10px] font-mono transition-all"
                    style={compensation === c
                      ? { background: 'rgba(255,107,53,0.2)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.4)' }
                      : { background: 'rgba(255,255,255,0.02)', color: 'rgba(160,200,180,0.5)', border: '1px solid rgba(0,255,157,0.08)' }}>
                    {labels[c]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs font-golos mb-2" style={{ color: 'rgba(160,200,180,0.7)' }}>Направление обхода</div>
            <div className="grid grid-cols-2 gap-1.5">
              {['climb', 'conventional'].map(d => {
                const labels: Record<string, string> = { climb: 'Попутное', conventional: 'Встречное' };
                return (
                  <button key={d}
                    className="py-1.5 rounded-lg text-[10px] font-mono transition-all btn-neon">
                    {labels[d]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-b" style={{ borderColor: 'rgba(0,255,157,0.08)' }}>
            <div>
              <div className="text-xs font-golos" style={{ color: 'rgba(160,200,180,0.7)' }}>Охлаждение</div>
              <div className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.35)' }}>СОЖ/воздух</div>
            </div>
            <button
              onClick={() => setCoolant(c => !c)}
              className="w-10 h-5 rounded-full relative transition-all"
              style={{ background: coolant ? 'rgba(0,229,255,0.3)' : 'rgba(0,255,157,0.08)', border: `1px solid ${coolant ? 'rgba(0,229,255,0.5)' : 'rgba(0,255,157,0.15)'}` }}>
              <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                style={{ left: coolant ? 'calc(100% - 18px)' : '2px', background: coolant ? '#00e5ff' : 'rgba(0,255,157,0.4)', boxShadow: coolant ? '0 0 6px rgba(0,229,255,0.6)' : 'none' }} />
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex-1">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(0,255,157,0.5)' }}>БЕЗОПАСНОСТЬ</div>
          {[
            { l: 'Плоскость безопасности (Z)', v: '50 мм', icon: 'Shield' },
            { l: 'Зазор отвода', v: '5 мм', icon: 'ArrowUp' },
            { l: 'Скорость отвода', v: '5000 мм/мин', icon: 'Zap' },
            { l: 'Проверка коллизий', v: 'Включена', icon: 'ScanSearch' },
          ].map(({ l, v, icon }) => (
            <div key={l} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: 'rgba(0,255,157,0.06)' }}>
              <div className="flex items-center gap-2">
                <Icon name={icon} fallback="Settings" size={13} style={{ color: 'rgba(0,255,157,0.5)' }} />
                <span className="text-xs font-golos" style={{ color: 'rgba(160,200,180,0.65)' }}>{l}</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</span>
            </div>
          ))}
          <button className="btn-neon-solid w-full mt-4 py-2.5 rounded-xl text-sm font-golos font-semibold flex items-center justify-center gap-2">
            <Icon name="Save" size={15} />
            Сохранить параметры
          </button>
        </div>
      </div>
    </div>
  );
}
