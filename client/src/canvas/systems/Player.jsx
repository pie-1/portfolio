import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import CharacterModel from './CharacterModel'

export default function Player({ bodyRef }) {
  const groupRef = useRef() // To rotate the whole character
  const { world } = useRapier()
  const controllerRef = useRef()
  
  const scrollInput = useRef(0)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const controller = world.createCharacterController(0.01)
    controller.enableAutostep(0.3, 0.2, true)
    controller.enableSnapToGround(0.3)
    controller.setApplyImpulsesToDynamicBodies(true)
    controllerRef.current = controller
  }, [world])

  useEffect(() => {
    const handleWheel = (e) => {
      scrollInput.current += e.deltaY * 0.005
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useFrame((_, delta) => {
    if (!bodyRef?.current || !controllerRef.current) return

    const body = bodyRef.current
    const controller = controllerRef.current

    scrollInput.current = THREE.MathUtils.clamp(scrollInput.current, -0.5, 0.5)

    // Determine if moving
    const moving = Math.abs(scrollInput.current) > 0.01
    if (moving !== isMoving) setIsMoving(moving)

    // Move physics
    const desiredMovement = { x: 0, y: -0.1, z: -scrollInput.current }
    controller.computeColliderMovement(body.collider, desiredMovement)
    const correctedMovement = controller.computedMovement()
    
    const currentPos = body.translation()
    body.setNextKinematicTranslation({
      x: currentPos.x + correctedMovement.x,
      y: currentPos.y + correctedMovement.y,
      z: currentPos.z + correctedMovement.z,
    })

    // Smooth rotation: Face the direction we are moving
    if (groupRef.current) {
      const targetRotation = scrollInput.current > 0 ? 0 : Math.PI
      // Only rotate if we are actually moving
      if (moving) {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotation,
          delta * 10
        )
      }
    }

    scrollInput.current = THREE.MathUtils.lerp(scrollInput.current, 0, delta * 3)
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders={false}
      position={[0, 1, 0]}
    >
      <CapsuleCollider args={[0.5, 0.3]} />
      
    <group ref={groupRef}>
    {/* Shift the model up so feet touch the floor */}
    <group position={[0, 1.5, 0]}>
        <CharacterModel isMoving={isMoving} />
    </group>
    </group>
    </RigidBody>
  )
}