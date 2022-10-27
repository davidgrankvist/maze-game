interface RoomLoaderProps {
  isHost: boolean;
}
export function RoomLoader({ isHost }: RoomLoaderProps) {
  const titleText = isHost ? "Creating room" : "Joining room";
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center mb-60">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{titleText}</h1>
          <p className="py-6">In the meantime, ponder on the meaning of life.</p>
          <progress className="w-3/4 progress progress-info"></progress>
        </div>
      </div>
    </div>
    
  )
}
