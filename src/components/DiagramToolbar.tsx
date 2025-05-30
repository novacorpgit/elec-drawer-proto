
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw 
} from "lucide-react";

export const DiagramToolbar = () => {
  return (
    <div className="bg-white border-b p-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary mr-6">LV Enclosure Designer</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
