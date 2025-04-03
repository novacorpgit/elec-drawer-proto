
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const DINRail3D = ({ component }: ComponentProps) => {
  const groupRef = useRef<Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.componentId = component.id;
    }
  }, [component.id]);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(component.position);
      if (component.rotation) {
        groupRef.current.rotation.set(
          component.rotation.x,
          component.rotation.y,
          component.rotation.z
        );
      }
    }
  });

  const width = component.size ? component.size[0] : component.scale.x;
  const height = component.size ? component.size[1] : component.scale.y;
  const depth = component.size ? component.size[2] : component.scale.z;

  // Calculate segments for the rail
  const numSegments = Math.max(4, Math.floor(width / 0.5));
  const segments = [];
  for (let i = 0; i < numSegments; i++) {
    const position = (i / (numSegments - 1)) * width - width / 2;
    segments.push(position);
  }

  return (
    <group ref={groupRef}>
      {/* Main rail body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={"#C8C8C9"} /> {/* Metallic gray */}
      </mesh>
      
      {/* Rail lip details */}
      {segments.map((position, index) => (
        <mesh 
          key={index} 
          castShadow 
          position={[position, height, 0]}
        >
          <boxGeometry args={[0.4, 0.06, depth]} />
          <meshStandardMaterial color={"#9CA3AF"} />
        </mesh>
      ))}
      
      {/* Label */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "DIN Rail"}
      </Text>
    </group>
  );
};
