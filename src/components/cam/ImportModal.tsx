import { useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface ImportModalProps {
  onClose: () => void;
  onImport: (file: ImportedFile) => void;
}

export interface ImportedFile {
  name: string;
  format: string;
  size: string;
  entities: number;
  width: number;
  height: number;
  layers: string[];
}

const SUPPORTED_FORMATS = [
  { ext: 'DXF', desc: 'AutoCAD Drawing Exchange', icon: 'PenLine', color: '#00ff9d' },
  { ext: 'STEP', desc: 'Standard for Exchange of Product', icon: 'Box', color: '#00e5ff' },
  { ext: 'IGES', desc: 'Initial Graphics Exchange', icon: 'Layers', color: '#ffd93d' },
  { ext: 'STL', desc: 'Stereolithography (3D mesh)', icon: 'Triangle', color: '#ff6b35' },
  { ext: 'SVG', desc: 'Scalable Vector Graphics', icon: 'Image', color: '#00ff9d' },
];

type Stage = 'drop' | 'parsing' | 'preview' | 'done';

function fakeParseFile(name: string): ImportedFile {
  const ext = name.split('.').pop()?.toUpperCase() || 'DXF';
  const entityMap: Record<string, number> = { DXF: 247, STEP: 1842, IGES: 934, STL: 12480, SVG: 63 };
  const layerMap: Record<string, string[]> = {
    DXF: ['0', 'Контур', 'Размеры', 'Вспомогательные'],
    STEP: ['Тело', 'Грани', 'Рёбра'],
    IGES: ['Поверхности', 'Кривые'],
    STL: ['Mesh'],
    SVG: ['Layer 1', 'Layer 2'],
  };
  return {
    name,
    format: ext,
    size: `${(Math.random() * 2 + 0.3).toFixed(1)} МБ`,
    entities: entityMap[ext] || 120,
    width: Math.round(Math.random() * 300 + 100),
    height: Math.round(Math.random() * 200 + 80),
    layers: layerMap[ext] || ['Default'],
  };
}

export default function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [stage, setStage] = useState<Stage>('drop');
  const [dragging, setDragging] = useState(false);
  const [parsedFile, setParsedFile] = useState<ImportedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [unit, setUnit] = useState<'mm' | 'inch'>('mm');
  const [scale, setScale] = useState(1.0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setStage('parsing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const parsed = fakeParseFile(file.name);
          setParsedFile(parsed);
          setSelectedLayers([...parsed.layers]);
          setStage('preview');
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 120);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const toggleLayer = (layer: string) => {
    setSelectedLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const handleConfirm = () => {
    if (!parsedFile) return;
    setStage('done');
    setTimeout(() => {
      onImport(parsedFile);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-[640px] max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: 'rgba(6,13,10,0.98)', border: '1px solid rgba(0,255,157,0.2)', boxShadow: '0 0 60px rgba(0,255,157,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(0,255,157,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,255,157,0.12)', border: '1px solid rgba(0,255,157,0.25)' }}>
              <Icon name="Upload" size={16} style={{ color: '#00ff9d' }} />
            </div>
            <div>
              <div className="text-sm font-golos font-bold" style={{ color: '#fff' }}>Импорт файла</div>
              <div className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>DXF · STEP · IGES · STL · SVG</div>
            </div>
          </div>
          <button onClick={onClose} className="toolbar-btn w-8 h-8">
            <Icon name="X" size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">

          {/* STAGE: drop */}
          {stage === 'drop' && (
            <div className="flex flex-col gap-4">
              {/* Drop zone */}
              <div
                className="relative rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                style={{
                  height: 200,
                  border: `2px dashed ${dragging ? '#00ff9d' : 'rgba(0,255,157,0.2)'}`,
                  background: dragging ? 'rgba(0,255,157,0.06)' : 'rgba(0,255,157,0.02)',
                  boxShadow: dragging ? '0 0 30px rgba(0,255,157,0.15)' : 'none',
                }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" className="hidden"
                  accept=".dxf,.step,.stp,.iges,.igs,.stl,.svg"
                  onChange={onInputChange} />

                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all"
                  style={{ background: dragging ? 'rgba(0,255,157,0.2)' : 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)' }}>
                  <Icon name="FileUp" size={28} style={{ color: '#00ff9d', filter: 'drop-shadow(0 0 8px rgba(0,255,157,0.5))' }} />
                </div>
                <div className="text-sm font-golos font-semibold mb-1" style={{ color: '#fff' }}>
                  {dragging ? 'Отпустите файл...' : 'Перетащите файл сюда'}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>
                  или нажмите для выбора · макс. 50 МБ
                </div>
              </div>

              {/* Supported formats */}
              <div>
                <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,255,157,0.4)' }}>ПОДДЕРЖИВАЕМЫЕ ФОРМАТЫ</div>
                <div className="grid grid-cols-5 gap-2">
                  {SUPPORTED_FORMATS.map(f => (
                    <div key={f.ext} className="p-2.5 rounded-xl text-center"
                      style={{ background: `${f.color}06`, border: `1px solid ${f.color}15` }}>
                      <Icon name={f.icon} fallback="File" size={20} style={{ color: f.color, margin: '0 auto 6px' }} />
                      <div className="text-[10px] font-mono font-bold" style={{ color: f.color }}>.{f.ext}</div>
                      <div className="text-[8px] font-golos mt-0.5" style={{ color: 'rgba(160,200,180,0.4)' }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE: parsing */}
          {stage === 'parsing' && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                  style={{ borderTopColor: '#00ff9d', borderRightColor: 'rgba(0,255,157,0.3)' }} />
                <div className="absolute inset-3 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)' }}>
                  <Icon name="FileSearch" size={24} style={{ color: '#00ff9d' }} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-golos font-semibold mb-1" style={{ color: '#fff' }}>Анализ файла...</div>
                <div className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.5)' }}>Разбор геометрии и слоёв</div>
              </div>
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>Прогресс</span>
                  <span className="text-[9px] font-mono" style={{ color: '#00ff9d' }}>{Math.round(Math.min(progress, 100))}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,157,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg,#00ff9d,#00e5ff)', boxShadow: '0 0 8px rgba(0,255,157,0.5)' }} />
                </div>
              </div>
            </div>
          )}

          {/* STAGE: preview */}
          {stage === 'preview' && parsedFile && (
            <div className="flex flex-col gap-4">
              {/* File info */}
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)' }}>
                  <Icon name="FileCheck" size={20} style={{ color: '#00ff9d' }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-golos font-semibold" style={{ color: '#fff' }}>{parsedFile.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.5)' }}>
                    {parsedFile.format} · {parsedFile.size} · {parsedFile.entities} объектов
                  </div>
                </div>
                <div className="flex gap-3">
                  {[
                    { l: 'Ширина', v: `${parsedFile.width} мм` },
                    { l: 'Высота', v: `${parsedFile.height} мм` },
                  ].map(({ l, v }) => (
                    <div key={l} className="text-right">
                      <div className="text-[8px] font-mono" style={{ color: 'rgba(0,255,157,0.35)' }}>{l}</div>
                      <div className="text-xs font-mono font-bold" style={{ color: '#00ff9d' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {/* Preview canvas */}
                <div className="flex-1 cam-canvas rounded-xl relative overflow-hidden" style={{ height: 200 }}>
                  <svg width="100%" height="100%">
                    <rect x="15%" y="20%" width="70%" height="60%" rx="3"
                      fill="rgba(0,255,157,0.04)" stroke="#00ff9d" strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,157,0.4))' }} />
                    <circle cx="30%" cy="35%" r="8" fill="none" stroke="#00e5ff" strokeWidth="1"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.4))' }} />
                    <circle cx="70%" cy="35%" r="8" fill="none" stroke="#00e5ff" strokeWidth="1"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.4))' }} />
                    <circle cx="30%" cy="65%" r="8" fill="none" stroke="#00e5ff" strokeWidth="1"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.4))' }} />
                    <circle cx="70%" cy="65%" r="8" fill="none" stroke="#00e5ff" strokeWidth="1"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.4))' }} />
                    <rect x="35%" y="35%" width="30%" height="30%" rx="2"
                      fill="rgba(0,229,255,0.04)" stroke="#00e5ff" strokeWidth="1" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,255,157,0.08)" strokeWidth="1" strokeDasharray="3,5" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(0,255,157,0.08)" strokeWidth="1" strokeDasharray="3,5" />
                  </svg>
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono" style={{ color: 'rgba(0,255,157,0.3)' }}>ПРЕВЬЮ</div>
                </div>

                {/* Settings */}
                <div className="w-44 flex flex-col gap-3">
                  {/* Units */}
                  <div>
                    <div className="text-[9px] font-mono tracking-widest mb-1.5" style={{ color: 'rgba(0,255,157,0.4)' }}>ЕДИНИЦЫ</div>
                    <div className="grid grid-cols-2 gap-1">
                      {(['mm', 'inch'] as const).map(u => (
                        <button key={u} onClick={() => setUnit(u)}
                          className="py-1 rounded-lg text-[10px] font-mono transition-all"
                          style={unit === u
                            ? { background: 'rgba(0,255,157,0.15)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.35)' }
                            : { background: 'rgba(0,255,157,0.03)', color: 'rgba(0,255,157,0.4)', border: '1px solid rgba(0,255,157,0.08)' }}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scale */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(0,255,157,0.4)' }}>МАСШТАБ</span>
                      <span className="text-[9px] font-mono" style={{ color: '#00ff9d' }}>{scale.toFixed(2)}x</span>
                    </div>
                    <input type="range" min={0.1} max={10} step={0.1} value={scale}
                      onChange={e => setScale(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full outline-none cursor-pointer"
                      style={{ WebkitAppearance: 'none', background: `linear-gradient(90deg,#00ff9d ${((scale - 0.1) / 9.9) * 100}%,rgba(0,255,157,0.1) ${((scale - 0.1) / 9.9) * 100}%)` }} />
                  </div>

                  {/* Layers */}
                  <div>
                    <div className="text-[9px] font-mono tracking-widest mb-1.5" style={{ color: 'rgba(0,255,157,0.4)' }}>СЛОИ</div>
                    <div className="flex flex-col gap-1">
                      {parsedFile.layers.map(layer => (
                        <button key={layer} onClick={() => toggleLayer(layer)}
                          className="flex items-center gap-2 py-1 px-2 rounded-lg text-left transition-all"
                          style={{ background: 'rgba(0,255,157,0.03)', border: '1px solid rgba(0,255,157,0.06)' }}>
                          <div className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0"
                            style={{ background: selectedLayers.includes(layer) ? '#00ff9d' : 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.3)' }}>
                            {selectedLayers.includes(layer) && (
                              <Icon name="Check" size={9} style={{ color: '#050d0a' }} />
                            )}
                          </div>
                          <span className="text-[9px] font-mono truncate" style={{ color: selectedLayers.includes(layer) ? '#fff' : 'rgba(160,200,180,0.5)' }}>{layer}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE: done */}
          {stage === 'done' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,255,157,0.12)', border: '2px solid #00ff9d', boxShadow: '0 0 30px rgba(0,255,157,0.4)' }}>
                <Icon name="CheckCircle" size={32} style={{ color: '#00ff9d' }} />
              </div>
              <div className="text-sm font-golos font-bold" style={{ color: '#fff' }}>Файл загружен!</div>
              <div className="text-[10px] font-mono" style={{ color: 'rgba(0,255,157,0.5)' }}>Открытие в рабочем пространстве...</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(stage === 'drop' || stage === 'preview') && (
          <div className="px-5 py-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(0,255,157,0.1)' }}>
            <button onClick={onClose} className="btn-neon px-4 py-2 rounded-xl text-xs font-golos font-medium">
              Отмена
            </button>
            {stage === 'preview' && (
              <button onClick={handleConfirm}
                disabled={selectedLayers.length === 0}
                className="btn-neon-solid px-5 py-2 rounded-xl text-xs font-golos font-semibold flex items-center gap-2"
                style={{ opacity: selectedLayers.length === 0 ? 0.5 : 1 }}>
                <Icon name="Import" size={14} />
                Импортировать ({selectedLayers.length} сл.)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
