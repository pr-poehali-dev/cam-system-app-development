import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

export default function SimulationSection() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPlaying(false); return 100; }
          return p + 0.4 * speed;
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const reset = () => { setPlaying(false); setProgress(0); };

  const elapsed = Math.floor((progress / 100) * 1475);
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 min-h-0 animate-fade-in">
      {/* Main simulation area */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Canvas */}
        <div className="flex-1 glass-panel rounded-xl relative overflow-hidden" style={{ minHeight: 300 }}>
          <div className="cam-canvas w-full h-full relative">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Workpiece outline */}
              <rect x="15%" y="15%" width="70%" height="70%" rx="4" fill="rgba(0,229,255,0.04)" stroke="rgba(0,229,255,0.3)" strokeWidth="1.5" />

              {/* Completed path (green) */}
              <path
                d={`M 25% 25% L ${15 + progress * 0.5}% 25%`}
                fill="none" stroke="#00ff9d" strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 4px #00ff9d)', opacity: 0.9 }}
              />
              <path d="M 25% 25% L 25% 75% L 75% 75% L 75% 25%" fill="none" stroke="rgba(0,255,157,0.15)" strokeWidth="1" strokeDasharray="4,3" />

              {/* Remaining path (dashed) */}
              <path d="M 25% 25% L 75% 25% L 75% 75% L 25% 75%" fill="none" stroke="rgba(0,255,157,0.2)" strokeWidth="1" strokeDasharray="4,4" />

              {/* Material removal simulation */}
              <rect x="15%" y="15%" width={`${progress * 0.7}%`} height="70%" fill="rgba(0,255,157,0.03)" />

              {/* Tool head */}
              {progress < 100 && (
                <g transform={`translate(${150 + progress * 2.5}, 80)`}>
                  <circle r="6" fill="none" stroke="#ff6b35" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px #ff6b35)' }} />
                  <circle r="2" fill="#ff6b35" />
                  <line x1="0" y1="-6" x2="0" y2="-18" stroke="#ff6b35" strokeWidth="1.5" opacity="0.6" />
                </g>
              )}

              {/* Grid overlay */}
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(0,255,157,0.06)" strokeWidth="1" strokeDasharray="2,6" />
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(0,255,157,0.06)" strokeWidth="1" strokeDasharray="2,6" />

              {/* Axis labels */}
              <text x="91%" y="53%" fill="rgba(0,255,157,0.35)" fontSize="9" fontFamily="JetBrains Mono">X</text>
              <text x="51%" y="9%" fill="rgba(0,255,157,0.35)" fontSize="9" fontFamily="JetBrains Mono">Y</text>
            </svg>

            {/* Overlay info */}
            <div className="absolute top-3 left-3 space-y-1">
              <div className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: 'rgba(4,9,7,0.85)', border: '1px solid rgba(0,255,157,0.15)', color: '#00ff9d' }}>
                X: {(125.34 * progress / 100).toFixed(3)}
              </div>
              <div className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: 'rgba(4,9,7,0.85)', border: '1px solid rgba(0,229,255,0.15)', color: '#00e5ff' }}>
                Y: {(87.22 * progress / 100).toFixed(3)}
              </div>
              <div className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: 'rgba(4,9,7,0.85)', border: '1px solid rgba(255,107,53,0.15)', color: '#ff6b35' }}>
                Z: {(-5.0 * progress / 100).toFixed(3)}
              </div>
            </div>

            {progress === 100 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 rounded-2xl" style={{ background: 'rgba(4,9,7,0.9)', border: '1px solid rgba(0,255,157,0.3)' }}>
                  <div className="text-4xl mb-2" style={{ color: '#00ff9d', textShadow: '0 0 20px rgba(0,255,157,0.8)' }}>✓</div>
                  <div className="text-sm font-golos font-bold" style={{ color: '#fff' }}>Симуляция завершена</div>
                  <div className="text-[10px] font-mono mt-1" style={{ color: 'rgba(0,255,157,0.5)' }}>Без коллизий · 24:35</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-2">
          <div className="glass-panel rounded-xl p-3">
            <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,255,157,0.5)' }}>СТАТУС</div>
            {[
              { l: 'Время', v: `${mm}:${ss.toString().padStart(2, '0')} / 24:35`, color: '#00e5ff' },
              { l: 'Прогресс', v: `${Math.min(100, Math.round(progress))}%`, color: '#00ff9d' },
              { l: 'Строка G-кода', v: `N${Math.round(progress * 4.2)}`, color: '#ffd93d' },
              { l: 'Коллизий', v: '0', color: '#00ff9d' },
              { l: 'Подача', v: '800 мм/мин', color: '#00e5ff' },
            ].map(s => (
              <div key={s.l} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'rgba(0,255,157,0.06)' }}>
                <span className="text-[10px] font-golos" style={{ color: 'rgba(160,200,180,0.55)' }}>{s.l}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.v}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-xl p-3">
            <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,229,255,0.5)' }}>СКОРОСТЬ</div>
            <div className="grid grid-cols-4 gap-1">
              {[0.5, 1, 2, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all"
                  style={speed === s
                    ? { background: 'rgba(0,255,157,0.2)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.4)', boxShadow: '0 0 8px rgba(0,255,157,0.3)' }
                    : { background: 'rgba(0,255,157,0.04)', color: 'rgba(0,255,157,0.5)', border: '1px solid rgba(0,255,157,0.1)' }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-3 flex-1">
            <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(255,107,53,0.6)' }}>АНАЛИЗ</div>
            <div className="space-y-2">
              {[
                { l: 'Быстрые перемещения', v: 45, color: '#ff6b35' },
                { l: 'Рабочие перемещения', v: 89, color: '#00ff9d' },
                { l: 'Дуговые движения', v: 23, color: '#00e5ff' },
              ].map(item => (
                <div key={item.l}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.5)' }}>{item.l}</span>
                    <span className="text-[9px] font-mono" style={{ color: item.color }}>{item.v}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.v}%`, background: item.color, opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline + controls */}
      <div className="glass-panel rounded-xl px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={reset} className="toolbar-btn w-8 h-8">
            <Icon name="SkipBack" size={14} />
          </button>
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: playing ? 'rgba(255,107,53,0.2)' : 'linear-gradient(135deg,#00ff9d,#00c97a)', boxShadow: playing ? '0 0 12px rgba(255,107,53,0.4)' : '0 0 12px rgba(0,255,157,0.4)' }}
          >
            <Icon name={playing ? 'Pause' : 'Play'} size={16} style={{ color: playing ? '#ff6b35' : '#050d0a' }} />
          </button>
          <button className="toolbar-btn w-8 h-8">
            <Icon name="SkipForward" size={14} />
          </button>

          {/* Timeline */}
          <div className="flex-1 relative">
            <div className="h-2 rounded-full overflow-hidden cursor-pointer" style={{ background: 'rgba(0,255,157,0.1)' }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#00ff9d,#00e5ff)', boxShadow: '0 0 8px rgba(0,255,157,0.5)' }} />
            </div>
            <div className="absolute -top-0.5 transition-all" style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}>
              <div className="w-3 h-3 rounded-full border-2" style={{ background: '#00ff9d', borderColor: '#050d0a', boxShadow: '0 0 6px #00ff9d' }} />
            </div>
          </div>

          <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: 'rgba(0,255,157,0.5)' }}>
            {mm}:{ss.toString().padStart(2, '0')} / 24:35
          </span>
        </div>
      </div>
    </div>
  );
}
