
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelectedObject } from "@/hooks/useSelectedObject";
import { useComponentStore, Component3D } from "@/hooks/useComponentStore";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import { useState, useEffect } from "react";
import { Vector3 } from "three";
import { Trash2 } from "lucide-react";

export const PropertiesPanel3D = () => {
  const { selectedObject } = useSelectedObject();
  const { components, updateComponent, removeComponent } = useComponentStore();
  const { decrementUsed } = useInventoryStore();
  const [component, setComponent] = useState<Component3D | null>(null);

  useEffect(() => {
    if (selectedObject && selectedObject.userData.componentId) {
      const foundComponent = components.find(c => c.id === selectedObject.userData.componentId);
      if (foundComponent) {
        setComponent(foundComponent);
      }
    } else {
      setComponent(null);
    }
  }, [selectedObject, components]);

  if (!component) return null;

  const handleNameChange = (value: string) => {
    updateComponent(component.id, { name: value });
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = new Vector3(
      axis === 'x' ? value : component.position.x,
      axis === 'y' ? value : component.position.y,
      axis === 'z' ? value : component.position.z
    );
    updateComponent(component.id, { position: newPosition });
  };

  const handleDelete = () => {
    // If this component is linked to an inventory item, decrement its used count
    if (component.inventoryItemId) {
      decrementUsed(component.inventoryItemId);
    }
    
    // Remove the component
    removeComponent(component.id);
  };

  const handleSizeChange = (dimension: 0 | 1 | 2, value: number) => {
    if (!component.size) return;
    
    const newSize: [number, number, number] = [...component.size];
    newSize[dimension] = value;
    
    updateComponent(component.id, { 
      size: newSize,
      scale: new Vector3(
        dimension === 0 ? value : component.scale.x,
        dimension === 1 ? value : component.scale.y,
        dimension === 2 ? value : component.scale.z
      )
    });
  };

  return (
    <div className="properties-panel absolute bottom-4 right-4 z-10 bg-white">
      <div className="properties-title">Properties: {component.name}</div>
      
      <div className="property-group">
        <div className="property-label">Name</div>
        <Input
          className="property-input"
          value={component.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500 mb-1">Position</div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="property-label">X</div>
            <Input
              className="property-input"
              type="number"
              step="0.1"
              value={component.position.x.toFixed(1)}
              onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <div className="property-label">Y</div>
            <Input
              className="property-input"
              type="number"
              step="0.1"
              value={component.position.y.toFixed(1)}
              onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <div className="property-label">Z</div>
            <Input
              className="property-input"
              type="number"
              step="0.1"
              value={component.position.z.toFixed(1)}
              onChange={(e) => handlePositionChange('z', parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      {component.size && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500 mb-1">Size</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="property-label">Width</div>
              <Input
                className="property-input"
                type="number"
                step="0.1"
                value={component.size[0].toFixed(1)}
                onChange={(e) => handleSizeChange(0, parseFloat(e.target.value))}
              />
            </div>
            <div>
              <div className="property-label">Height</div>
              <Input
                className="property-input"
                type="number"
                step="0.1"
                value={component.size[1].toFixed(1)}
                onChange={(e) => handleSizeChange(1, parseFloat(e.target.value))}
              />
            </div>
            <div>
              <div className="property-label">Depth</div>
              <Input
                className="property-input"
                type="number"
                step="0.1"
                value={component.size[2].toFixed(1)}
                onChange={(e) => handleSizeChange(2, parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t flex justify-end">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};
