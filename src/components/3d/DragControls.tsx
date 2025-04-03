
import { useThree, useFrame } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import { Raycaster, Vector3, Object3D, Plane, Intersection } from 'three';
import { useSelectedObject } from '@/hooks/useSelectedObject';
import { useComponentStore } from '@/hooks/useComponentStore';

interface DragControlsProps {
  enabled: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export const DragControls = ({ enabled, setIsDragging }: DragControlsProps) => {
  const { scene, camera, gl } = useThree();
  const { selectObject, selectedObject } = useSelectedObject();
  const updateComponent = useComponentStore(state => state.updateComponent);
  
  const [isDragging, setDragging] = useState(false);
  const [dragObject, setDragObject] = useState<Object3D | null>(null);
  const raycaster = useRef(new Raycaster());
  const dragStartPoint = useRef(new Vector3());
  const dragPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const intersection = useRef(new Vector3());
  const offset = useRef(new Vector3());

  // Listen for pointer events on the canvas
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      if (isDragging) return;

      // Convert mouse position to normalized device coordinates
      const mouse = {
        x: (event.clientX / gl.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / gl.domElement.clientHeight) * 2 + 1
      };

      // Update the raycaster
      raycaster.current.setFromCamera(mouse, camera);

      // Find all intersected objects
      const intersects = raycaster.current.intersectObjects(scene.children, true);
      
      // Filter out non-draggable objects
      const draggableIntersects = intersects.filter(intersect => {
        let obj = intersect.object;
        while (obj && !obj.userData.componentId) {
          obj = obj.parent!;
        }
        return obj && obj.userData.componentId;
      });

      if (draggableIntersects.length > 0) {
        const intersect = draggableIntersects[0];
        let target = intersect.object;
        
        // Find the parent with componentId
        while (target && !target.userData.componentId) {
          target = target.parent!;
        }
        
        if (target && target.userData.componentId) {
          // Start dragging
          setDragging(true);
          setIsDragging(true);
          setDragObject(target);
          selectObject(target);
          
          // Set up the drag plane
          const planeNormal = camera.getWorldDirection(new Vector3());
          dragPlane.current.setFromNormalAndCoplanarPoint(
            new Vector3(0, 1, 0), // Always drag on the Y plane
            intersect.point
          );
          
          // Store the initial intersection point
          dragStartPoint.current.copy(intersect.point);
          
          // Calculate the offset from the object's position
          offset.current.copy(target.position).sub(intersect.point);
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging || !dragObject) return;

      // Convert mouse position to normalized device coordinates
      const mouse = {
        x: (event.clientX / gl.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / gl.domElement.clientHeight) * 2 + 1
      };

      // Update the raycaster
      raycaster.current.setFromCamera(mouse, camera);

      // Find where the ray intersects the drag plane
      if (raycaster.current.ray.intersectPlane(dragPlane.current, intersection.current)) {
        // Move the object to the new position, maintaining the offset
        const newPosition = new Vector3().copy(intersection.current).add(offset.current);
        
        // Update the object position
        dragObject.position.copy(newPosition);
        
        // Update the component state
        if (dragObject.userData.componentId) {
          updateComponent(dragObject.userData.componentId, { 
            position: new Vector3(newPosition.x, newPosition.y, newPosition.z) 
          });
        }
      }
    };

    const onPointerUp = () => {
      if (isDragging) {
        setDragging(false);
        setIsDragging(false);
        setDragObject(null);
      }
    };

    // Add event listeners
    gl.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Clean up
    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [camera, enabled, gl, isDragging, scene, selectObject, setIsDragging, updateComponent]);

  return null;
};
