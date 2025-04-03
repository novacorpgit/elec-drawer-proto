
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group } from "three";
import { Component3D } from "@/hooks/useComponentStore";

interface ComponentProps {
  component: Component3D;
}

export const NSX2503D = ({ component }: ComponentProps) => {
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

  const { scale } = component;

  return (
    <group ref={groupRef}>
      {/* Base gray box */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[scale.x, scale.y, scale.z]} />
        <meshStandardMaterial color={"#C8C8C9"} /> {/* Silver-gray color */}
      </mesh>
      
      {/* Main breaker face - the black part */}
      <mesh castShadow position={[0, scale.y * 0.1, scale.z/2 + 0.01]}>
        <boxGeometry args={[scale.x * 0.75, scale.y * 0.25, 0.05]} />
        <meshStandardMaterial color={"#222222"} /> {/* Dark gray/black for the breaker face */}
      </mesh>
      
      {/* Operating handle */}
      <mesh castShadow position={[0, scale.y * 0.1, scale.z/2 + 0.06]}>
        <boxGeometry args={[scale.x * 0.25, scale.y * 0.15, 0.05]} />
        <meshStandardMaterial color={"#ea384c"} /> {/* Red toggle */}
      </mesh>
      
      {/* Terminal connections */}
      <group position={[0, -scale.y/2 - 0.05, 0]}>
        <mesh castShadow position={[-scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.2, 0.15, scale.z * 0.5]} />
          <meshStandardMaterial color={"#C8C8C9"} />
        </mesh>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[scale.x * 0.2, 0.15, scale.z * 0.5]} />
          <meshStandardMaterial color={"#C8C8C9"} />
        </mesh>
        <mesh castShadow position={[scale.x/4, 0, 0]}>
          <boxGeometry args={[scale.x * 0.2, 0.15, scale.z * 0.5]} />
          <meshStandardMaterial color={"#C8C8C9"} />
        </mesh>
      </group>
      
      {/* NSX 250 label */}
      <Text
        position={[0, -scale.y/2 - 0.25, 0]}
        fontSize={0.15}
        color="black"
      >
        {component.name || "NSX 250"}
      </Text>
    </group>
  );
};
