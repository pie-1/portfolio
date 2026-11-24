import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense, useRef } from 'react'
import Corridor from './scenes/Corridor'
import Player from './systems/Player'
import FollowCamera from './systems/FollowCamera'
import Door from './systems/Door'

export default function Experience() {
  const playerBodyRef = useRef(null)

  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 50 }}
      dpr={[1, 2]}
      shadows
    >
      <color attach="background" args={['#f5f5f5']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      <Physics gravity={[0, -20, 0]}>
        <Suspense fallback={null}>
          <Corridor length={100} />
          
          {/* Using the new English names */}
          <Door 
            position={[-2.9, 0, -10]} 
            rotation={[0, Math.PI / 2, 0]} 
            image="/textures/doors/door-projects.webp" 
            label="PROJECTS" 
          />
          <Door 
            position={[2.9, 0, -25]} 
            rotation={[0, -Math.PI / 2, 0]} 
            image="/textures/doors/door-about.webp" 
            label="ABOUT ME" 
          />
          <Door 
            position={[-2.9, 0, -40]} 
            rotation={[0, Math.PI / 2, 0]} 
            image="/textures/doors/door-contact.webp" 
            label="CONTACT" 
          />
          <Door 
            position={[2.9, 0, -55]} 
            rotation={[0, -Math.PI / 2, 0]} 
            image="/textures/doors/door-social.webp" 
            label="SOCIALS" 
          />
        </Suspense>

        <Player bodyRef={playerBodyRef} />
      </Physics>

      <FollowCamera targetRef={playerBodyRef} />
    </Canvas>
  )
}