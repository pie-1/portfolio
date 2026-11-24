import { useRef } from 'react'
import Player from '../systems/Player'
import FollowCamera from '../systems/FollowCamera'

export default function TestScene() {
  const playerBodyRef = useRef(null)

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Just a test box to run past */}
      <mesh position={[2, 0.5, -5]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <Player bodyRef={playerBodyRef} />
      <FollowCamera targetRef={playerBodyRef} />
    </>
  )
}