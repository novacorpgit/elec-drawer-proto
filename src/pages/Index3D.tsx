
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  GizmoHelper, 
  GizmoViewport 
} from '@react-three/drei';
import { ComponentPalette3D } from '@/components/3d/ComponentPalette3D';
import { PropertiesPanel3D } from '@/components/3d/PropertiesPanel3D';
import { DiagramToolbar3D } from '@/components/3d/DiagramToolbar3D';
import { Enclosure3D } from '@/components/3d/models/Enclosure3D';
import { DragControls } from '@/components/3d/DragControls';
import { Ground } from '@/components/3d/Ground';
import { useSelectedObject } from '@/hooks/useSelectedObject';

const Index3D = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { selectedObject } = useSelectedObject();

  return (
    <div className="min-h-screen flex flex-col">
      <DiagramToolbar3D />
      
      <div className="flex-grow relative">
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 10]} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
            />
            <Environment preset="warehouse" />

            <DragControls enabled={!isDragging} setIsDragging={setIsDragging} />
            <OrbitControls enabled={!isDragging} />
            
            <Ground />
            <Enclosure3D position={[0, 1, 0]} size={[8, 4, 6]} />
            
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            </GizmoHelper>
          </Suspense>
        </Canvas>
        
        <ComponentPalette3D />
        
        {selectedObject && (
          <PropertiesPanel3D />
        )}
      </div>
    </div>
  );
};

export default Index3D;
