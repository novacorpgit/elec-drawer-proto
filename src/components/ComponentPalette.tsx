
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ComponentPaletteProps {
  onAddComponent: (category: string) => void;
}

export const ComponentPalette = ({ onAddComponent }: ComponentPaletteProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const components = [
    { id: "ACB", name: "ACB", color: "#D1FAE5" },
    { id: "BusBar", name: "Bus Bar", color: "#FEF3C7" },
    { id: "Terminal", name: "Terminal", color: "#DBEAFE" },
    { id: "DINRail", name: "DIN Rail", color: "#E5E7EB" },
    { id: "Contactor", name: "Contactor", color: "#F3E8FF" },
    { id: "Enclosure", name: "Enclosure", color: "#FFFFFF" }
  ];

  return (
    <div className="component-palette">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-medium">Component Palette</h3>
        {isCollapsed ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="component-list">
          {components.map((component) => (
            <div 
              key={component.id} 
              className="component-item"
              onClick={() => onAddComponent(component.id)}
            >
              <div 
                className="component-item-icon" 
                style={{ 
                  backgroundColor: component.color,
                  border: "1px solid #333",
                  borderRadius: "2px"
                }}
              />
              <div className="component-item-label">{component.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
