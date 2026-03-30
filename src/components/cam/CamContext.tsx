import { createContext, useContext, useState, type ReactNode } from 'react';

export interface ToolpathParams {
  feed: number;
  rpm: number;
  depth: number;
  stepover: number;
  coolant: boolean;
  compensation: string;
  tolerance: number;
}

export interface Toolpath {
  id: number;
  name: string;
  type: string;
  color: string;
  status: string;
  params: ToolpathParams;
}

const defaultParams: ToolpathParams = {
  feed: 800,
  rpm: 12000,
  depth: 5,
  stepover: 40,
  coolant: true,
  compensation: 'left',
  tolerance: 0.01,
};

const initialToolpaths: Toolpath[] = [
  { id: 1, name: 'Контурная обработка', type: 'Контур', color: '#00ff9d', status: 'ok', params: { ...defaultParams } },
  { id: 2, name: 'Карманная выборка', type: 'Карман', color: '#00e5ff', status: 'ok', params: { ...defaultParams, feed: 500, rpm: 10000, depth: 12 } },
  { id: 3, name: 'Сверление Ø8', type: 'Сверление', color: '#ffd93d', status: 'warn', params: { ...defaultParams, feed: 200, rpm: 3000, depth: 30 } },
  { id: 4, name: 'Финишное фрезерование', type: 'Финиш', color: '#ff6b35', status: 'ok', params: { ...defaultParams, feed: 1200, rpm: 18000, depth: 2 } },
];

interface CamContextType {
  toolpaths: Toolpath[];
  selectedId: number;
  setSelectedId: (id: number) => void;
  updateParams: (id: number, params: ToolpathParams) => void;
  getSelectedParams: () => ToolpathParams;
}

const CamContext = createContext<CamContextType | null>(null);

export function CamProvider({ children }: { children: ReactNode }) {
  const [toolpaths, setToolpaths] = useState<Toolpath[]>(initialToolpaths);
  const [selectedId, setSelectedId] = useState(1);

  const updateParams = (id: number, params: ToolpathParams) => {
    setToolpaths(prev => prev.map(tp =>
      tp.id === id ? { ...tp, params, status: 'ok' } : tp
    ));
  };

  const getSelectedParams = (): ToolpathParams => {
    return toolpaths.find(tp => tp.id === selectedId)?.params ?? defaultParams;
  };

  return (
    <CamContext.Provider value={{ toolpaths, selectedId, setSelectedId, updateParams, getSelectedParams }}>
      {children}
    </CamContext.Provider>
  );
}

export function useCam() {
  const ctx = useContext(CamContext);
  if (!ctx) throw new Error('useCam must be used inside CamProvider');
  return ctx;
}
