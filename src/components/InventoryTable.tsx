
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { InventoryItem, useInventoryStore } from "@/hooks/useInventoryStore";
import { useComponentStore, Component3DType } from "@/hooks/useComponentStore";
import { Vector3 } from "three";

export const InventoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  
  const { items, incrementUsed, getAvailable } = useInventoryStore();
  const { addComponent } = useComponentStore();
  
  // Filter items based on search term and selected panel
  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPanel = selectedPanel ? item.panelName === selectedPanel : true;
    return matchesSearch && matchesPanel;
  });
  
  // Get unique panel names for filtering
  const panelNames = Array.from(new Set(items.map(item => item.panelName)));
  
  const handleAddToCanvas = (item: InventoryItem) => {
    const availableCount = getAvailable(item.id);
    
    if (availableCount > 0) {
      // Add component to the 3D scene
      addComponent(
        item.category as Component3DType, 
        new Vector3(
          Math.random() * 4 - 2,  // Random X position between -2 and 2
          1.5,                    // Fixed Y position 
          Math.random() * 4 - 2   // Random Z position between -2 and 2
        ),
        item.id  // Pass inventory item id to track relation
      );
      
      // Increment used count in inventory
      incrementUsed(item.id);
    }
  };
  
  return (
    <div className="p-4 bg-white border rounded-md shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Component Inventory</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="Search components..." 
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-3 py-2 border rounded-md"
            value={selectedPanel || ""}
            onChange={(e) => setSelectedPanel(e.target.value || null)}
          >
            <option value="">All Panels</option>
            {panelNames.map(panel => (
              <option key={panel} value={panel}>{panel}</option>
            ))}
          </select>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Panel</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Used</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => {
            const availableCount = getAvailable(item.id);
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.panelName}</TableCell>
                <TableCell>{item.quantity - item.usedCount}</TableCell>
                <TableCell>{item.usedCount}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={availableCount === 0}
                    onClick={() => handleAddToCanvas(item)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
