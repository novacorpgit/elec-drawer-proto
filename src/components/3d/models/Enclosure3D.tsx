
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useHelper } from "@react-three/drei";
import { BoxHelper, Group, Vector3, Box3 } from "three";
import { useComponentStore, Component3D } from "@/hooks/useComponentStore";
import { ACB3D } from "@/components/3d/models/ACB3D";
import { BusBar3D } from "@/components/3d/models/BusBar3D";
import { Terminal3D } from "@/components/3d/models/Terminal3D";
import { DINRail3D } from "@/components/3d/models/DINRail3D";
import { Contactor3D } from "@/components/3d/models/Contactor3D";
import { NSX2503D } from "@/components/3d/models/NSX2503D";
import { Chassis250A3D } from "@/components/3d/models/Chassis250A3D";

interface Enclosure3DProps {
  position?: [number, number, number];
  size?: [number, number, number];
}

export const Enclosure3D = ({ 
  position = [0, 0, 0], 
  size = [10, 6, 4] 
}: Enclosure3DProps) => {
  const boxRef = useRef<Group>(null);
  const box = new Box3();
  useHelper(boxRef, BoxHelper, "black");
  
  const components = useComponentStore(state => state.components);

  useFrame(() => {
    if (boxRef.current) {
      box.setFromObject(boxRef.current);
      // Keep all components inside enclosure here if needed
    }
  });

  // Render appropriate component based on type
  const renderComponent = (component: Component3D) => {
    const props = {
      key: component.id,
      component: component
    };
    
    switch (component.type) {
      case "ACB":
        return <ACB3D {...props} />;
      case "BusBar":
        return <BusBar3D {...props} />;
      case "Terminal":
        return <Terminal3D {...props} />;
      case "DINRail":
        return <DINRail3D {...props} />;
      case "Contactor":
        return <Contactor3D {...props} />;
      case "NSX250":
        return <NSX2503D {...props} />;
      case "Chassis250A":
        return <Chassis250A3D {...props} />;
      default:
        return null;
    }
  };

  return (
    <group position={new Vector3(...position)}>
      {/* Enclosure frame */}
      <group ref={boxRef}>
        {/* Front wall (transparent) */}
        <mesh position={[0, size[1]/2, size[2]/2]} castShadow>
          <boxGeometry args={[size[0], size[1], 0.1]} />
          <meshStandardMaterial transparent={true} opacity={0.2} color={"#9CA3AF"} />
        </mesh>
        
        {/* Back wall */}
        <mesh position={[0, size[1]/2, -size[2]/2]} castShadow>
          <boxGeometry args={[size[0], size[1], 0.1]} />
          <meshStandardMaterial color={"#9CA3AF"} />
        </mesh>
        
        {/* Left wall */}
        <mesh position={[-size[0]/2, size[1]/2, 0]} castShadow>
          <boxGeometry args={[0.1, size[1], size[2]]} />
          <meshStandardMaterial color={"#9CA3AF"} />
        </mesh>
        
        {/* Right wall */}
        <mesh position={[size[0]/2, size[1]/2, 0]} castShadow>
          <boxGeometry args={[0.1, size[1], size[2]]} />
          <meshStandardMaterial color={"#9CA3AF"} />
        </mesh>
        
        {/* Top */}
        <mesh position={[0, size[1], 0]} castShadow>
          <boxGeometry args={[size[0], 0.1, size[2]]} />
          <meshStandardMaterial color={"#9CA3AF"} />
        </mesh>
        
        {/* Bottom */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[size[0], 0.1, size[2]]} />
          <meshStandardMaterial color={"#9CA3AF"} />
        </mesh>
        
        {/* Components inside the enclosure */}
        {components.map(renderComponent)}
      </group>
      
      {/* Enclosure label */}
      <mesh position={[0, -0.3, size[2]/2 + 0.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color={"white"} />
      </mesh>
    </group>
  );
};
