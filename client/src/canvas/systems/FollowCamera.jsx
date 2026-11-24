import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function FollowCamera({ targetRef }) {
  const { camera } = useThree()
  const currentPos = useRef(new THREE.Vector3(0, 2, 6))

  useFrame((_, delta) => {
    if (!targetRef?.current) return
    
    // Get the player's current position
    const playerPos = targetRef.current.translation()
    
    // We want the camera to be behind (+Z) and above (+Y) the player
    const targetCamPos = new THREE.Vector3(
      playerPos.x,
      playerPos.y + 3, // 3 units above
      playerPos.z + 6  // 6 units behind
    )
    
    // Smoothly move the camera towards that target position
    currentPos.current.lerp(targetCamPos, delta * 5)
    
    // Apply the position to the actual camera
    camera.position.copy(currentPos.current)
    
    // Make the camera look slightly ahead of the player
    camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z - 2)
  })

  return null
}