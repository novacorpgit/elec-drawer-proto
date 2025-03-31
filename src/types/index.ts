
export interface ElectricalComponent {
  id: string;
  type: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Enclosure {
  id: string;
  width: number;
  height: number;
}

export interface ComponentData {
  key: string;
  category: string;
  name: string;
  loc?: string;
  size?: string;
}
