const Loading = ({ animated = true }: { animated: boolean }) => {
  return (
    <div className="relative flex justify-center items-center h-20 w-20">
      {animated && (
        <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      )}
      <img
        src="/gyoza.png"
        className="rounded-full h-14 w-14"
        alt="Gyoza OS mascot"
      />
    </div>
  )
}

export default Loading
