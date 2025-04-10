
import { create } from 'zustand';

export type InventoryItem = {
  id: string;
  category: string;
  description: string;
  quantity: number;
  panelName: string;
  usedCount: number;
};

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'usedCount'>) => void;
  removeItem: (id: string) => void;
  incrementUsed: (id: string) => void;
  decrementUsed: (id: string) => void;
  getAvailable: (id: string) => number;
}

// Initial inventory data
const initialItems: Omit<InventoryItem, 'id' | 'usedCount'>[] = [
  { category: 'ACB', description: 'Air Circuit Breaker 630A', quantity: 5, panelName: 'Panel A' },
  { category: 'BusBar', description: 'Copper Bus Bar 30x5mm', quantity: 12, panelName: 'Panel B' },
  { category: 'Terminal', description: 'Power Distribution Terminal', quantity: 30, panelName: 'Panel A' },
  { category: 'DINRail', description: 'Standard 35mm DIN Rail', quantity: 8, panelName: 'Panel C' },
  { category: 'Contactor', description: '3-Phase Contactor 40A', quantity: 15, panelName: 'Panel B' },
  { category: 'NSX250', description: 'Molded Case Circuit Breaker 250A', quantity: 7, panelName: 'Panel A' },
  { category: 'Chassis250A', description: 'Mounting Chassis for 250A Breaker', quantity: 7, panelName: 'Panel C' },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: initialItems.map((item, index) => ({
    ...item,
    id: `inv-${index}`,
    usedCount: 0
  })),
  
  addItem: (item) => set((state) => ({
    items: [
      ...state.items,
      {
        ...item,
        id: `inv-${state.items.length}`,
        usedCount: 0
      }
    ]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  incrementUsed: (id) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, usedCount: item.usedCount + 1 } : item
    )
  })),
  
  decrementUsed: (id) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, usedCount: Math.max(0, item.usedCount - 1) } : item
    )
  })),
  
  getAvailable: (id) => {
    const item = get().items.find(item => item.id === id);
    return item ? item.quantity - item.usedCount : 0;
  }
}));
