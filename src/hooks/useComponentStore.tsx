
import { create } from 'zustand';
import { Vector3, Euler } from 'three';
import { v4 as uuidv4 } from 'uuid';

export type Component3DType = 'ACB' | 'BusBar' | 'Terminal' | 'DINRail' | 'Contactor' | 'NSX250' | 'Chassis250A';

export interface Component3D {
  id: string;
  type: Component3DType;
  name: string;
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  size?: [number, number, number];
  inventoryItemId?: string; // Reference to inventory item
}

interface ComponentStore {
  components: Component3D[];
  addComponent: (type: Component3DType, position: Vector3, inventoryItemId?: string) => void;
  updateComponent: (id: string, updates: Partial<Component3D>) => void;
  removeComponent: (id: string) => void;
}

export const useComponentStore = create<ComponentStore>((set) => ({
  components: [],
  
  addComponent: (type, position, inventoryItemId) => set((state) => {
    const defaults: Record<Component3DType, Partial<Component3D>> = {
      ACB: { 
        scale: new Vector3(1, 1, 1), 
        size: [1.6, 2.6, 0.8] 
      },
      BusBar: { 
        scale: new Vector3(4, 0.2, 0.4), 
        rotation: new Euler(0, 0, 0),
        size: [4, 0.2, 0.4] 
      },
      Terminal: { 
        scale: new Vector3(0.8, 0.5, 0.6) 
      },
      DINRail: { 
        scale: new Vector3(4, 0.14, 0.4),
        size: [4, 0.14, 0.4]
      },
      Contactor: { 
        scale: new Vector3(1.2, 1.6, 0.8) 
      },
      NSX250: { 
        scale: new Vector3(1.6, 2.4, 0.8) 
      },
      Chassis250A: { 
        scale: new Vector3(2, 2.8, 0.8) 
      }
    };
    
    const newComponent: Component3D = {
      id: uuidv4(),
      type,
      name: type,
      position,
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      inventoryItemId,
      ...defaults[type]
    };
    
    return { components: [...state.components, newComponent] };
  }),
  
  updateComponent: (id, updates) => set((state) => ({
    components: state.components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    )
  })),
  
  removeComponent: (id) => set((state) => ({
    components: state.components.filter(comp => comp.id !== id)
  }))
}));
