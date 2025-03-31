
import * as go from "gojs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropertiesPanelProps {
  selectedNode: go.Node;
  onPropertyChange: (property: string, value: string) => void;
}

export const PropertiesPanel = ({ selectedNode, onPropertyChange }: PropertiesPanelProps) => {
  if (!selectedNode) return null;

  const data = selectedNode.data;
  const category = data.category;
  const name = data.name || category;
  
  // Get size if available
  let width = "", height = "";
  if (data.size) {
    const size = go.Size.parse(data.size);
    width = Math.round(size.width).toString();
    height = Math.round(size.height).toString();
  }

  return (
    <div className="properties-panel">
      <div className="properties-title">Properties: {name}</div>
      
      <div className="property-group">
        <div className="property-label">Name</div>
        <Input
          className="property-input"
          value={name}
          onChange={(e) => onPropertyChange("name", e.target.value)}
        />
      </div>
      
      {(category === "Enclosure" || category === "BusBar" || category === "DINRail") && (
        <>
          <div className="property-group">
            <div className="property-label">Width (mm)</div>
            <Input
              className="property-input"
              type="number"
              value={width}
              onChange={(e) => onPropertyChange("width", e.target.value)}
            />
          </div>
          
          <div className="property-group">
            <div className="property-label">Height (mm)</div>
            <Input
              className="property-input"
              type="number"
              value={height}
              onChange={(e) => onPropertyChange("height", e.target.value)}
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <div className="property-label">Type</div>
        <Input
          className="property-input"
          value={category}
          disabled
        />
      </div>
      
      {/* Position information */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500 mb-1">Position</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="property-label">X</div>
            <Input
              className="property-input"
              type="text"
              value={Math.round(selectedNode.location.x)}
              disabled
            />
          </div>
          <div>
            <div className="property-label">Y</div>
            <Input
              className="property-input"
              type="text"
              value={Math.round(selectedNode.location.y)}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};
