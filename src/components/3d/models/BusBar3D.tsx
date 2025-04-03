
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const BusBar3D = ({ component }: ComponentProps) => {
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

  // Calculate connection points along the bar
  const numPoints = Math.max(2, Math.floor(width / 0.5));
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const position = (i / (numPoints - 1)) * width - width / 2;
    points.push(position);
  }

  return (
    <group ref={groupRef}>
      {/* Main bus bar body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={"#FFD700"} /> {/* Gold color for copper */}
      </mesh>
      
      {/* Connection points */}
      {points.map((position, index) => (
        <mesh 
          key={index} 
          castShadow 
          position={[position, height/2 + 0.05, 0]}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
          <meshStandardMaterial color={"#B8860B"} /> {/* Darker gold for outline */}
        </mesh>
      ))}
      
      {/* Label */}
      <Text
        position={[0, -height, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "Bus Bar"}
      </Text>
    </group>
  );
};
