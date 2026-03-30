import Icon from '@/components/ui/icon';

const faqs = [
  { q: 'Как создать новую траекторию инструмента?', a: 'Перейдите в раздел "Рабочее пространство", нажмите "Добавить" в панели траекторий и выберите тип операции.' },
  { q: 'Как настроить параметры резания?', a: 'В разделе "Параметры" можно задать подачу, обороты, глубину резания и другие режимы. Значения рассчитываются автоматически.' },
  { q: 'Какие постпроцессоры поддерживаются?', a: 'Fanuc, Siemens 840D, Heidenhain iTNC, HAAS, Mazak и Generic ISO G-code. Настройка в разделе "Экспорт".' },
  { q: 'Как запустить симуляцию обработки?', a: 'Перейдите в раздел "Симуляция" и нажмите кнопку воспроизведения. Можно менять скорость и позицию инструмента.' },
  { q: 'Как импортировать 3D модель?', a: 'Используйте кнопку импорта в разделе "Проекты". Поддерживаются форматы STEP, IGES, STL, DXF.' },
];

const shortcuts = [
  { key: 'Ctrl+Z', desc: 'Отменить' },
  { key: 'Ctrl+Y', desc: 'Повторить' },
  { key: 'Space', desc: 'Пуск/стоп симуляции' },
  { key: 'F5', desc: 'Сгенерировать траектории' },
  { key: 'F7', desc: 'Проверить коллизии' },
  { key: 'Ctrl+E', desc: 'Экспорт G-кода' },
  { key: 'Ctrl+S', desc: 'Сохранить проект' },
  { key: 'R', desc: 'Сбросить вид' },
];

export default function HelpSection() {
  return (
    <div className="flex-1 p-3 flex gap-3 min-h-0 animate-fade-in overflow-auto">
      {/* FAQ */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(0,255,157,0.5)' }}>ЧАСТЫЕ ВОПРОСЫ</div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(0,255,157,0.03)', border: '1px solid rgba(0,255,157,0.08)' }}>
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(0,255,157,0.12)', border: '1px solid rgba(0,255,157,0.2)' }}>
                    <span className="text-[9px] font-mono font-bold" style={{ color: '#00ff9d' }}>?</span>
                  </div>
                  <span className="text-sm font-golos font-semibold" style={{ color: '#fff' }}>{faq.q}</span>
                </div>
                <p className="text-xs font-golos leading-5 ml-7" style={{ color: 'rgba(160,200,180,0.6)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(0,229,255,0.5)' }}>ПОДДЕРЖКА</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'BookOpen', label: 'Документация', desc: 'Полное руководство', color: '#00ff9d' },
              { icon: 'Video', label: 'Обучающие видео', desc: 'YouTube канал', color: '#00e5ff' },
              { icon: 'MessageSquare', label: 'Техподдержка', desc: 'support@camflow.ru', color: '#ffd93d' },
            ].map(({ icon, label, desc, color }) => (
              <div key={label} className="p-3 rounded-xl text-center cursor-pointer transition-all"
                style={{ background: `${color}08`, border: `1px solid ${color}15` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}30`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${color}15`)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                  <Icon name={icon} fallback="HelpCircle" size={20} style={{ color }} />
                </div>
                <div className="text-xs font-golos font-semibold mb-0.5" style={{ color: '#fff' }}>{label}</div>
                <div className="text-[9px] font-mono" style={{ color: 'rgba(160,200,180,0.4)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcuts + version */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-3">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'rgba(255,107,53,0.5)' }}>ГОРЯЧИЕ КЛАВИШИ</div>
          <div className="flex flex-col gap-1">
            {shortcuts.map(({ key, desc }) => (
              <div key={key} className="flex items-center justify-between py-1.5">
                <span className="text-[10px] font-golos" style={{ color: 'rgba(160,200,180,0.6)' }}>{desc}</span>
                <kbd className="px-2 py-0.5 rounded text-[9px] font-mono" style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)', color: '#00ff9d' }}>{key}</kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="text-[10px] font-mono tracking-widest mb-3" style={{ color: 'rgba(0,255,157,0.5)' }}>О СИСТЕМЕ</div>
          <div className="space-y-2">
            {[
              { l: 'Версия', v: 'CamFlow 2.5.1' },
              { l: 'Лицензия', v: 'Professional' },
              { l: 'Ядро', v: 'OpenCAMLib 3.1' },
              { l: 'Платформа', v: 'Web / React' },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between py-1.5 border-b" style={{ borderColor: 'rgba(0,255,157,0.06)' }}>
                <span className="text-[10px] font-golos" style={{ color: 'rgba(160,200,180,0.5)' }}>{l}</span>
                <span className="text-[10px] font-mono" style={{ color: '#00ff9d' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 rounded-lg text-center" style={{ background: 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.1)' }}>
            <div className="text-[9px] font-mono" style={{ color: 'rgba(0,255,157,0.4)' }}>Build 20260330-prod</div>
          </div>
        </div>
      </div>
    </div>
  );
}
