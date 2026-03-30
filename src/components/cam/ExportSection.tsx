import { useState } from 'react';
import Icon from '@/components/ui/icon';

const postprocs = [
  { id: 'fanuc', name: 'Fanuc 0i-MF', ext: 'NC', desc: 'Стандартный контроллер Fanuc' },
  { id: 'siemens', name: 'Siemens 840D', ext: 'MPF', desc: 'Sinumerik 840D sl' },
  { id: 'heidenhain', name: 'Heidenhain', ext: 'H', desc: 'iTNC 530 / TNC 620' },
  { id: 'haas', name: 'HAAS Mill', ext: 'NC', desc: 'HAAS VF/UMC серия' },
  { id: 'generic', name: 'Generic ISO', ext: 'NC', desc: 'ISO 6983 стандарт' },
];

const gcode = `%
O0001 (CAMFLOW EXPORT v2.5.1)
(DATE: 30-03-2026)
(MATERIAL: ALUMINIUM 6061)
(TOOL: D8 4-FLUTE ENDMILL)
(BLANK: 200x150x30mm)

G90 G94 G17 G40 G49 G80
G21
G54

T1 M6
(TOOL: D8 КОНЦЕВАЯ ФРЕЗА 4 ЗУБА)
G43 H1
S12000 M3
M8

G0 X0.000 Y0.000
Z50.000

(--- КОНТУРНАЯ ОБРАБОТКА ---)
G0 X-4.000 Y-4.000
Z5.000
G1 Z-5.000 F200.
G1 X125.340 F800.
G1 Y87.220
G1 X0.000
G1 Y0.000
G0 Z50.000

(--- КАРМАННАЯ ВЫБОРКА ---)
G0 X10.000 Y10.000
Z5.000
G1 Z-12.000 F150.
...

M9
M5
G91 G28 Z0
G28 X0 Y0
M30
%`;

interface OptionRowProps { label: string; defaultValue: boolean; }
function OptionRow({ label, defaultValue }: OptionRowProps) {
  const [on, setOn] = useState(defaultValue);
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(0,255,157,0.06)' }}>
      <span className="text-xs font-golos" style={{ color: 'rgba(160,200,180,0.65)' }}>{label}</span>
      <button onClick={() => setOn(o => !o)}
        className="w-8 h-4 rounded-full relative transition-all"
        style={{ background: on ? 'rgba(0,255,157,0.25)' : 'rgba(0,255,157,0.06)', border: `1px solid ${on ? 'rgba(0,255,157,0.4)' : 'rgba(0,255,157,0.1)'}` }}>
        <div className="w-3 h-3 rounded-full absolute top-0.5 transition-all"
          style={{ left: on ? 'calc(100% - 14px)' : '2px', background: on ? '#00ff9d' : 'rgba(0,255,157,0.3)' }} />
      </button>
    </div>
  );
}

export default function ExportSection() {
  const [selected, setSelected] = useState('fanuc');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 1800);
  };

  return (
    <div className="flex-1 p-3 flex gap-3 min-h-0 animate-fade-in">
      {/* Left — settings */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(0,255,157,0.5)' }}>ПОСТПРОЦЕССОР</div>
          <div className="flex flex-col gap-1.5">
            {postprocs.map(pp => (
              <button
                key={pp.id}
                onClick={() => setSelected(pp.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all"
                style={{
                  background: selected === pp.id ? 'rgba(0,255,157,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected === pp.id ? 'rgba(0,255,157,0.3)' : 'rgba(0,255,157,0.06)'}`,
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: selected === pp.id ? 'rgba(0,255,157,0.15)' : 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.1)' }}>
                  <Icon name="Cpu" size={15} style={{ color: selected === pp.id ? '#00ff9d' : 'rgba(0,255,157,0.4)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-golos font-semibold" style={{ color: selected === pp.id ? '#fff' : 'rgba(200,220,210,0.7)' }}>{pp.name}</div>
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.4)' }}>{pp.desc}</div>
                </div>
                <span className="tag-badge flex-shrink-0" style={{ background: 'rgba(0,255,157,0.1)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.2)' }}>
                  .{pp.ext}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,229,255,0.5)' }}>ОПЦИИ</div>
          <OptionRow label="Нумерация строк" defaultValue={true} />
          <OptionRow label="Комментарии" defaultValue={true} />
          <OptionRow label="Отвод в конце" defaultValue={true} />
          <OptionRow label="Сжать G-код" defaultValue={false} />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-neon-solid py-3 rounded-xl text-sm font-golos font-bold flex items-center justify-center gap-2 transition-all"
          style={{ opacity: generating ? 0.7 : 1 }}
        >
          {generating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: '#050d0a' }} />
              Генерация...
            </>
          ) : done ? (
            <>
              <Icon name="CheckCircle" size={16} />
              Готово к загрузке!
            </>
          ) : (
            <>
              <Icon name="Zap" size={16} />
              Сгенерировать G-код
            </>
          )}
        </button>

        {done && (
          <button className="btn-neon py-2.5 rounded-xl text-sm font-golos font-semibold flex items-center justify-center gap-2">
            <Icon name="Download" size={15} />
            Скачать .NC файл
          </button>
        )}
      </div>

      {/* Right — preview */}
      <div className="flex-1 glass-panel rounded-xl flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(0,255,157,0.1)' }}>
          <div className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(0,255,157,0.5)' }}>ПРЕВЬЮ G-КОДА</div>
          <div className="flex items-center gap-2">
            <span className="tag-badge" style={{ background: 'rgba(0,255,157,0.1)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.2)' }}>157 строк</span>
            <span className="tag-badge" style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' }}>4.2 KB</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-[11px] font-mono leading-5" style={{ color: 'rgba(0,229,255,0.8)' }}>
            {gcode.split('\n').map((line, i) => (
              <div key={i} className="flex gap-3 hover:bg-white/[0.02] rounded px-1">
                <span style={{ color: 'rgba(0,255,157,0.2)', minWidth: 28, textAlign: 'right' }}>{i + 1}</span>
                <span style={{
                  color: line.startsWith('(') ? 'rgba(160,200,180,0.4)'
                    : line.startsWith('G') ? '#00ff9d'
                    : line.startsWith('M') ? '#ffd93d'
                    : line.startsWith('T') ? '#00e5ff'
                    : line.startsWith('S') || line.startsWith('F') ? '#ff6b35'
                    : line === '%' ? '#ff3b5c'
                    : 'rgba(200,230,220,0.7)'
                }}>{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}