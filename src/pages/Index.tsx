
import { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import { DiagramToolbar } from "@/components/DiagramToolbar";
import { ComponentPalette } from "@/components/ComponentPalette";
import { PropertiesPanel } from "@/components/PropertiesPanel";

const Index = () => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagram, setDiagram] = useState<go.Diagram | null>(null);
  const [selectedNode, setSelectedNode] = useState<go.Node | null>(null);

  useEffect(() => {
    if (diagramRef.current) {
      // Initialize the GoJS diagram
      const $ = go.GraphObject.make;
      
      const myDiagram = $(go.Diagram, diagramRef.current, {
        "undoManager.isEnabled": true,
        "grid.visible": true,
        "grid.gridCellSize": new go.Size(10, 10), // 10mm grid
        "grid.background": "white",
        "grid.gridLineColor": "#E5E7EB",
        allowDrop: true,
        "draggingTool.dragsLink": false,
        "draggingTool.isGridSnapEnabled": true,
        "resizingTool.isGridSnapEnabled": true,
        "rotatingTool.snapAngleMultiple": 90,
        "rotatingTool.snapAngleEpsilon": 45,
      });
      
      // Define the enclosure template as a resizable rectangle
      myDiagram.nodeTemplateMap.add("Enclosure",
        $(go.Node, "Auto",
          {
            resizable: true,
            resizeObjectName: "SHAPE",
            minSize: new go.Size(100, 100),
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Shape, "Rectangle", {
            name: "SHAPE",
            fill: "white",
            stroke: "black",
            strokeWidth: 2
          }),
          $(go.TextBlock, { margin: 5 },
            new go.Binding("text", "name"))
        )
      );

      // Define template for ACB (Air Circuit Breaker)
      myDiagram.nodeTemplateMap.add("ACB",
        $(go.Node, "Auto",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Rectangle", {
            fill: "#D1FAE5",
            stroke: "#064E3B",
            strokeWidth: 2,
            width: 60,
            height: 40
          }),
          $(go.TextBlock, "ACB", { margin: 5, font: "bold 10pt sans-serif" })
        )
      );

      // Define template for Bus Bar
      myDiagram.nodeTemplateMap.add("BusBar",
        $(go.Node, "Auto",
          {
            resizable: true,
            resizeObjectName: "SHAPE",
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Shape, "Rectangle", {
            name: "SHAPE",
            fill: "#FEF3C7",
            stroke: "#92400E",
            strokeWidth: 2,
          }),
          $(go.TextBlock, "Bus Bar", { margin: 5, font: "10pt sans-serif" })
        )
      );

      // Define template for Terminal Block
      myDiagram.nodeTemplateMap.add("Terminal",
        $(go.Node, "Auto",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Rectangle", {
            fill: "#DBEAFE",
            stroke: "#1E40AF",
            strokeWidth: 1,
            width: 30,
            height: 20
          }),
          $(go.TextBlock, "T", { 
            margin: 2, 
            font: "bold 8pt sans-serif",
            alignment: go.Spot.Center 
          })
        )
      );

      // Define template for DIN Rail
      myDiagram.nodeTemplateMap.add("DINRail",
        $(go.Node, "Auto",
          {
            resizable: true,
            resizeObjectName: "SHAPE",
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Shape, "Rectangle", {
            name: "SHAPE",
            fill: "#E5E7EB",
            stroke: "#4B5563",
            strokeWidth: 1,
            height: 10
          }),
          $(go.TextBlock, "DIN Rail", { 
            margin: 5, 
            font: "8pt sans-serif",
            alignment: go.Spot.Center
          })
        )
      );

      // Define template for Contactor
      myDiagram.nodeTemplateMap.add("Contactor",
        $(go.Node, "Auto",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Rectangle", {
            fill: "#F3E8FF",
            stroke: "#6B21A8",
            strokeWidth: 1.5,
            width: 40,
            height: 40
          }),
          $(go.TextBlock, "C", { 
            margin: 2, 
            font: "bold 10pt sans-serif",
            alignment: go.Spot.Center 
          })
        )
      );

      // Handle node selection to update the properties panel
      myDiagram.addDiagramListener("ChangedSelection", (e) => {
        const node = e.diagram.selection.first();
        setSelectedNode(node instanceof go.Node ? node : null);
      });

      setDiagram(myDiagram);

      // Initial diagram setup with an enclosure
      myDiagram.model = new go.GraphLinksModel({
        nodeDataArray: [
          { key: "enclosure1", category: "Enclosure", name: "Enclosure", loc: "300 200", size: "400 500" }
        ],
        linkDataArray: []
      });

      // Handle external object drops
      myDiagram.addDiagramListener("ExternalObjectsDropped", (e) => {
        e.diagram.selection.each((node) => {
          // Check if the node is inside the enclosure area
          const enclosure = e.diagram.findNodeForKey("enclosure1");
          if (enclosure && node.data.category !== "Enclosure") {
            const encRect = enclosure.actualBounds;
            const nodeRect = node.actualBounds;
            
            // If the node is not inside the enclosure, move it inside
            if (!encRect.containsRect(nodeRect)) {
              // Calculate a position inside the enclosure
              const newLoc = new go.Point(
                Math.max(encRect.x + nodeRect.width/2, 
                  Math.min(encRect.right - nodeRect.width/2, node.location.x)),
                Math.max(encRect.y + nodeRect.height/2, 
                  Math.min(encRect.bottom - nodeRect.height/2, node.location.y))
              );
              node.location = newLoc;
            }
          }
        });
      });

      return () => {
        myDiagram.div = null;
      };
    }
  }, []);

  // Handle property updates
  const handlePropertyChange = (property: string, value: string) => {
    if (!diagram || !selectedNode) return;
    
    diagram.startTransaction("change property");
    const data = selectedNode.data;
    
    switch (property) {
      case "name":
        diagram.model.setDataProperty(data, "name", value);
        break;
      case "width":
      case "height":
        const oldSize = go.Size.parse(data.size);
        const newSize = new go.Size(
          property === "width" ? parseInt(value) : oldSize.width,
          property === "height" ? parseInt(value) : oldSize.height
        );
        diagram.model.setDataProperty(data, "size", go.Size.stringify(newSize));
        break;
    }
    
    diagram.commitTransaction("change property");
  };

  // Function to add a new component to the diagram from the palette
  const handleAddComponent = (category: string) => {
    if (!diagram) return;
    
    const enclosure = diagram.findNodeForKey("enclosure1");
    if (!enclosure) return;
    
    const enclosureBounds = enclosure.actualBounds;
    
    let size = "60 40"; // default size
    if (category === "BusBar") size = "200 20";
    if (category === "DINRail") size = "200 10";
    
    // Place new component in center of enclosure
    const loc = `${enclosureBounds.center.x} ${enclosureBounds.center.y}`;
    
    diagram.startTransaction("add component");
    const newData = { 
      key: `${category}${Date.now()}`,
      category: category, 
      name: category,
      loc: loc,
      size: size
    };
    
    diagram.model.addNodeData(newData);
    diagram.commitTransaction("add component");
    
    // Select the new component
    const newNode = diagram.findNodeForKey(newData.key);
    if (newNode) diagram.select(newNode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DiagramToolbar />
      
      <div className="flex-grow relative">
        <div 
          ref={diagramRef} 
          className="diagram-container" 
        />
        
        <ComponentPalette onAddComponent={handleAddComponent} />
        
        {selectedNode && (
          <PropertiesPanel 
            selectedNode={selectedNode} 
            onPropertyChange={handlePropertyChange} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
