
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Save, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw,
  Box
} from "lucide-react";

export const DiagramToolbar3D = () => {
  return (
    <div className="bg-white border-b p-3 flex items-center justify-between z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary mr-6">LV Enclosure Designer (3D)</h1>
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
      
      <div className="flex space-x-2 items-center">
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
        <div className="border-l h-6 mx-2" />
        <Link to="/">
          <Button variant="outline" size="sm">
            <Box className="h-4 w-4 mr-2" />
            2D View
          </Button>
        </Link>
      </div>
    </div>
  );
};
