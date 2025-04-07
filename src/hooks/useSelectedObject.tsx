
import { create } from 'zustand/vanilla';
import { Object3D } from 'three';

type SelectedObjectState = {
  selectedObject: Object3D | null;
  selectObject: (object: Object3D | null) => void;
}

export const useSelectedObject = create<SelectedObjectState>((set) => ({
  selectedObject: null,
  selectObject: (object) => set({ selectedObject: object }),
}));
