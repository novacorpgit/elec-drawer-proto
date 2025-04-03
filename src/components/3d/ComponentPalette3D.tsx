
import { useState } from "react";
import { Vector3 } from "three";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useComponentStore, Component3DType } from "@/hooks/useComponentStore";

export const ComponentPalette3D = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const addComponent = useComponentStore((state) => state.addComponent);

  const components = [
    { id: "ACB" as Component3DType, name: "ACB", color: "#D1FAE5" },
    { id: "BusBar" as Component3DType, name: "Bus Bar", color: "#FEF3C7" },
    { id: "Terminal" as Component3DType, name: "Terminal", color: "#DBEAFE" },
    { id: "DINRail" as Component3DType, name: "DIN Rail", color: "#E5E7EB" },
    { id: "Contactor" as Component3DType, name: "Contactor", color: "#F3E8FF" },
    { id: "NSX250" as Component3DType, name: "NSX 250 Breaker", color: "#C8C8C9" },
    { id: "Chassis250A" as Component3DType, name: "250A Chassis", color: "#9F9EA1" },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: Component3DType) => {
    e.dataTransfer.setData("component-type", componentType);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleAddComponent = (componentType: Component3DType) => {
    // Add component in the center of the enclosure
    addComponent(componentType, new Vector3(0, 2, 0));
  };

  return (
    <div className="component-palette absolute top-4 right-4 z-10">
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer bg-white"
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
        <div className="component-list bg-white">
          {components.map((component) => (
            <div 
              key={component.id} 
              className="component-item"
              onClick={() => handleAddComponent(component.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
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
