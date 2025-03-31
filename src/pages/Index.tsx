
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
        grid: $(go.Panel, "Grid", 
          { gridCellSize: new go.Size(10, 10) },
          $(go.Shape, "LineH", { stroke: "#E5E7EB", strokeWidth: 0.5 }),
          $(go.Shape, "LineV", { stroke: "#E5E7EB", strokeWidth: 0.5 })
        ),
        "grid.visible": true,
        "grid.background": "white",
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

      // Define realistic template for ACB (Air Circuit Breaker)
      myDiagram.nodeTemplateMap.add("ACB",
        $(go.Node, "Spot",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Panel, "Vertical",
            $(go.Shape, "Rectangle", {
              fill: "#E0E0E0", // Light gray background
              stroke: "#333333",
              strokeWidth: 1.5,
              width: 80,
              height: 130
            }),
            // Circuit breaker face plate
            $(go.Panel, "Spot",
              $(go.Shape, "Rectangle", {
                fill: "#2E3238", // Dark gray/black face
                stroke: "#000000",
                strokeWidth: 1,
                width: 70,
                height: 100,
                margin: new go.Margin(5, 0, 0, 0),
                alignment: go.Spot.Top
              }),
              // Operating handle
              $(go.Shape, "Rectangle", {
                fill: "#FF0000", // Red handle
                stroke: "#000000",
                strokeWidth: 1,
                width: 20,
                height: 15,
                alignment: new go.Spot(0.5, 0.3)
              }),
              // Label for ON/OFF
              $(go.TextBlock, "I/O", { 
                stroke: "white",
                font: "bold 10pt sans-serif",
                alignment: new go.Spot(0.5, 0.6)
              }),
              // Rating label
              $(go.TextBlock, "3200A", { 
                stroke: "white",
                font: "8pt sans-serif",
                alignment: new go.Spot(0.5, 0.8)
              })
            ),
            // Terminal connections
            $(go.Panel, "Horizontal",
              { alignment: go.Spot.Bottom, margin: 5 },
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333",
                width: 15,
                height: 8
              }),
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 15,
                height: 8,
                margin: new go.Margin(0, 10, 0, 10)
              }),
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 15,
                height: 8
              })
            ),
            $(go.TextBlock, "ACB", { 
              margin: 5,
              font: "bold 10pt sans-serif"
            })
          )
        )
      );

      // Define realistic template for Bus Bar
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
            fill: "#FFD700", // Gold color for copper
            stroke: "#B8860B", // Darker gold for outline
            strokeWidth: 1,
            height: 10, // Default thin height for busbar
          }),
          // Connection points along the bar
          $(go.Panel, "Horizontal",
            { alignment: go.Spot.Center },
            new go.Binding("itemArray", "size", (size) => {
              const sizeParts = size.split(" ");
              const width = parseInt(sizeParts[0] || "200");
              const numPoints = Math.max(2, Math.floor(width / 50));
              const points = [];
              for (let i = 0; i < numPoints; i++) {
                points.push(i);
              }
              return points;
            }),
            {
              itemTemplate: $(go.Panel, "Spot",
                $(go.Shape, "Circle", {
                  fill: "#B8860B",
                  stroke: null,
                  width: 6,
                  height: 6,
                  alignment: go.Spot.Center,
                }),
                {
                  alignmentFocus: go.Spot.Center,
                  // Position circles along the bar
                  alignment: (num, count) => 
                    new go.Spot(num/(count-1), 0.5)
                }
              )
            }
          ),
          $(go.TextBlock, { 
            margin: new go.Margin(15, 5, 0, 5),
            font: "9pt sans-serif",
          },
          new go.Binding("text", "name"))
        )
      );

      // Define realistic template for Terminal Block
      myDiagram.nodeTemplateMap.add("Terminal",
        $(go.Node, "Auto",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Panel, "Table",
            { defaultRowSeparatorStroke: "#111111" },
            // Terminal body
            $(go.RowColumnDefinition, { column: 0, width: 40 }),
            $(go.RowColumnDefinition, { column: 1, width: 40 }),
            
            // First terminal
            $(go.Shape, "Rectangle", { 
              row: 0, column: 0,
              fill: "#DBEAFE", // Light blue
              stroke: "#1E40AF", // Darker blue
              strokeWidth: 1,
              height: 25
            }),
            $(go.Shape, "Rectangle", { 
              row: 0, column: 1,
              fill: "#DBEAFE",  
              stroke: "#1E40AF",
              strokeWidth: 1,
              height: 25
            }),
            
            // Second terminal
            $(go.Shape, "Rectangle", { 
              row: 1, column: 0,
              fill: "#DBEAFE", 
              stroke: "#1E40AF",
              strokeWidth: 1,
              height: 25
            }),
            $(go.Shape, "Rectangle", { 
              row: 1, column: 1,
              fill: "#DBEAFE", 
              stroke: "#1E40AF",
              strokeWidth: 1,
              height: 25
            }),
            
            // Terminal screws
            $(go.Shape, "Circle", { 
              row: 0, column: 0, 
              fill: "#333333",
              width: 8, height: 8,
              alignment: go.Spot.Center
            }),
            $(go.Shape, "Circle", { 
              row: 0, column: 1, 
              fill: "#333333",
              width: 8, height: 8,
              alignment: go.Spot.Center
            }),
            $(go.Shape, "Circle", { 
              row: 1, column: 0, 
              fill: "#333333",
              width: 8, height: 8,
              alignment: go.Spot.Center
            }),
            $(go.Shape, "Circle", { 
              row: 1, column: 1, 
              fill: "#333333",
              width: 8, height: 8,
              alignment: go.Spot.Center
            }),
            
            // Label at the bottom
            $(go.TextBlock, "Terminal", {
              row: 2,
              column: 0,
              columnSpan: 2,
              margin: new go.Margin(5, 0, 0, 0),
              font: "9pt sans-serif",
              alignment: go.Spot.Center
            })
          )
        )
      );

      // Define realistic template for DIN Rail
      myDiagram.nodeTemplateMap.add("DINRail",
        $(go.Node, "Auto",
          {
            resizable: true,
            resizeObjectName: "SHAPE",
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Panel, "Vertical", { name: "PANEL" },
            $(go.Shape, "Rectangle", {
              name: "SHAPE",
              fill: "#C8C8C9", // Metallic gray
              stroke: "#4B5563",
              strokeWidth: 1,
              height: 7
            }),
            // Rail lip details
            $(go.Panel, "Horizontal", 
              { alignment: go.Spot.Top },
              new go.Binding("itemArray", "size", (size) => {
                const sizeParts = size.split(" ");
                const width = parseInt(sizeParts[0] || "200");
                const numSegments = Math.max(4, Math.floor(width / 25));
                const segments = [];
                for (let i = 0; i < numSegments; i++) {
                  segments.push(i);
                }
                return segments;
              }),
              {
                itemTemplate: $(go.Panel, "Auto",
                  $(go.Shape, "Rectangle", {
                    fill: "#9CA3AF",
                    stroke: null,
                    width: 20,
                    height: 3,
                  }),
                  {
                    // Position segments along the rail
                    alignment: (num, count) => 
                      new go.Spot(num/(count-1), 0)
                  }
                )
              }
            ),
            $(go.TextBlock, "DIN Rail", { 
              margin: new go.Margin(10, 0, 0, 0),
              font: "9pt sans-serif",
              alignment: go.Spot.Bottom
            })
          )
        )
      );

      // Define realistic template for Contactor
      myDiagram.nodeTemplateMap.add("Contactor",
        $(go.Node, "Auto",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Panel, "Vertical",
            // Main contactor body
            $(go.Shape, "Rectangle", {
              fill: "#E6E6FA", // Lavender color
              stroke: "#6B21A8",
              strokeWidth: 1.5,
              width: 60,
              height: 80
            }),
            
            // Terminal connections - top row
            $(go.Panel, "Horizontal", 
              { alignment: go.Spot.Top, margin: new go.Margin(0, 0, 0, 0) },
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 10, 
                height: 5
              }),
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 10, 
                height: 5,
                margin: new go.Margin(0, 10, 0, 10)
              }),
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 10, 
                height: 5
              })
            ),
            
            // Middle section with model number
            $(go.Panel, "Spot", 
              { alignment: go.Spot.Center, margin: new go.Margin(10, 0, 10, 0) },
              $(go.Shape, "Rectangle", {
                fill: "#F3E8FF", // Lighter purple
                stroke: "#6B21A8",
                strokeWidth: 1,
                width: 50,
                height: 30
              }),
              $(go.TextBlock, "LC1D", { 
                font: "bold 10pt sans-serif"
              })
            ),
            
            // Bottom terminals
            $(go.Panel, "Horizontal", 
              { alignment: go.Spot.Bottom, margin: new go.Margin(0, 0, 0, 0) },
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 10, 
                height: 5
              }),
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 10, 
                height: 5,
                margin: new go.Margin(0, 10, 0, 10)
              }),
              $(go.Shape, "Rectangle", {
                fill: "#B8B8B8", 
                stroke: "#333333", 
                width: 10, 
                height: 5
              })
            ),
            
            $(go.TextBlock, "Contactor", { 
              margin: new go.Margin(5, 0, 0, 0),
              font: "9pt sans-serif"
            })
          )
        )
      );

      // Define template for Schneider NSX 250 Breaker
      myDiagram.nodeTemplateMap.add("NSX250",
        $(go.Node, "Spot",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Panel, "Vertical",
            $(go.Shape, "Rectangle", {
              fill: "#C8C8C9", // Silver-gray color similar to Schneider breakers
              stroke: "#333333",
              strokeWidth: 1,
              width: 80,
              height: 120
            }),
            // Main breaker toggle part 
            $(go.Panel, "Spot",
              $(go.Shape, "Rectangle", {
                fill: "#222222", // Dark gray for the breaker face
                stroke: "#000000",
                strokeWidth: 0.5,
                width: 60,
                height: 30,
                margin: new go.Margin(5, 0, 0, 0),
                alignment: go.Spot.Top
              }),
              // Operating handle
              $(go.Shape, "Rectangle", {
                fill: "#ea384c", // Red toggle
                stroke: "#000000",
                strokeWidth: 0.5,
                width: 20,
                height: 15,
                alignment: go.Spot.Top
              })
            ),
            // Terminals
            $(go.Panel, "Horizontal", 
              { alignment: go.Spot.Bottom, margin: new go.Margin(5, 0, 0, 0) },
              $(go.Shape, "Rectangle", {
                fill: "#C8C8C9",
                stroke: "#333333", 
                width: 15, 
                height: 8
              }),
              $(go.Shape, "Rectangle", {
                fill: "#C8C8C9", 
                stroke: "#333333", 
                width: 15, 
                height: 8,
                margin: new go.Margin(0, 5, 0, 5)
              }),
              $(go.Shape, "Rectangle", {
                fill: "#C8C8C9", 
                stroke: "#333333", 
                width: 15, 
                height: 8
              })
            ),
            $(go.TextBlock, "NSX 250", { 
              margin: new go.Margin(5, 0, 0, 0), 
              font: "bold 9pt sans-serif",
              alignment: go.Spot.Bottom
            })
          )
        )
      );

      // Define template for Schneider 250A Chassis
      myDiagram.nodeTemplateMap.add("Chassis250A",
        $(go.Node, "Auto",
          {
            resizable: false,
            locationSpot: go.Spot.Center
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Panel, "Vertical",
            $(go.Shape, "Rectangle", {
              fill: "#9F9EA1", // Silver-gray color for chassis
              stroke: "#333333",
              strokeWidth: 1.5,
              width: 100,
              height: 140
            }),
            // Mounting holes
            $(go.Panel, "Horizontal", 
              { alignment: go.Spot.TopCenter, margin: new go.Margin(10, 0, 0, 0) },
              $(go.Shape, "Circle", { fill: "#000000", width: 6, height: 6 }),
              $(go.Shape, "Circle", { fill: "#000000", width: 6, height: 6, margin: new go.Margin(0, 70, 0, 0) })
            ),
            // Bottom mounting holes
            $(go.Panel, "Horizontal", 
              { alignment: go.Spot.BottomCenter, margin: new go.Margin(0, 0, 10, 0) },
              $(go.Shape, "Circle", { fill: "#000000", width: 6, height: 6 }),
              $(go.Shape, "Circle", { fill: "#000000", width: 6, height: 6, margin: new go.Margin(0, 70, 0, 0) })
            ),
            // Connection points
            $(go.Panel, "Vertical", 
              { alignment: go.Spot.Center },
              $(go.Panel, "Horizontal",
                $(go.Shape, "Rectangle", { fill: "#AAADB0", stroke: "#333333", width: 60, height: 10 })
              ),
              $(go.Panel, "Horizontal", { margin: new go.Margin(10, 0, 0, 0) },
                $(go.Shape, "Rectangle", { fill: "#AAADB0", stroke: "#333333", width: 60, height: 10 })
              )
            ),
            $(go.TextBlock, "250A Chassis", { 
              margin: new go.Margin(5, 0, 0, 0), 
              font: "9pt sans-serif",
              alignment: go.Spot.Bottom
            })
          )
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
