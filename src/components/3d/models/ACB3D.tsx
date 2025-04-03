
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const ACB3D = ({ component }: ComponentProps) => {
  const groupRef = useRef<Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      // Store component ID in the object for raycasting
      groupRef.current.userData.componentId = component.id;
    }
  }, [component.id]);
  
  useFrame(() => {
    if (groupRef.current) {
      // Update position from component state
      groupRef.current.position.copy(component.position);
      
      // Apply rotation if specified
      if (component.rotation) {
        groupRef.current.rotation.set(
          component.rotation.x,
          component.rotation.y,
          component.rotation.z
        );
      }
    }
  });

  const { scale } = component;

  return (
    <group ref={groupRef}>
      {/* Main body - gray background */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[scale.x, scale.y, scale.z]} />
        <meshStandardMaterial color={"#E0E0E0"} />
      </mesh>
      
      {/* Circuit breaker face plate */}
      <mesh castShadow position={[0, 0, scale.z/2 + 0.01]}>
        <boxGeometry args={[scale.x * 0.85, scale.y * 0.75, 0.05]} />
        <meshStandardMaterial color={"#2E3238"} />
      </mesh>
      
      {/* Operating handle */}
      <mesh castShadow position={[0, scale.y * 0.15, scale.z/2 + 0.06]}>
        <boxGeometry args={[scale.x * 0.3, scale.y * 0.1, 0.05]} />
        <meshStandardMaterial color={"#FF0000"} />
      </mesh>
      
      {/* Label for ON/OFF */}
      <Text
        position={[0, -0.1, scale.z/2 + 0.07]}
        fontSize={0.15}
        color="white"
      >
        I/O
      </Text>
      
      {/* Rating label */}
      <Text
        position={[0, -0.3, scale.z/2 + 0.07]}
        fontSize={0.12}
        color="white"
      >
        3200A
      </Text>
      
      {/* Terminal connections */}
      <group position={[0, -scale.y/2 - 0.1, 0]}>
        <mesh castShadow position={[-scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
        <mesh castShadow position={[scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.15, 0.1, scale.z * 0.5]} />
          <meshStandardMaterial color={"#B8B8B8"} />
        </mesh>
      </group>
      
      {/* ACB label */}
      <Text
        position={[0, -scale.y/2 - 0.25, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "ACB"}
      </Text>
    </group>
  );
};
