const Loading = () => {
  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></div>
      <img
        src="/gyozai.png"
        className="rounded-full h-8 w-8"
        alt="Gyoza AI is thinking..."
      />
    </div>
  )
}

export default Loading
