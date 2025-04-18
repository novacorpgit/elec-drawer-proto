
import { useRef } from "react";
import { GridHelper } from "three";
import { useFrame } from "@react-three/fiber";

export const Ground = () => {
  const gridRef = useRef<GridHelper>(null);

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.x = -Math.PI / 2; // Keep grid flat
    }
  });

  return (
    <group>
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Grid */}
      <gridHelper 
        ref={gridRef}
        args={[50, 50, "#888888", "#cccccc"]} 
        position={[0, 0.01, 0]} 
      />
    </group>
  );
};
