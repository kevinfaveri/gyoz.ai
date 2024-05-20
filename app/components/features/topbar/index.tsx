const Topbar = () => {
  return (
    <div className="w-[70%] bg-background z-10 flex justify-center items-center h-[40px] absolute top-3 border-l-0 border-r-0 border-t-0 border-dotted border-secondary shadow-secondary transition-all duration-300">
      <div className="cursor-pointer flex flex-col items-center space-x-2 w-fit">
        <span className="text-sm font-bold">Gyoza OS</span>
        <span className="text-xs">
          Ask around, find out. DeFi made simple.
        </span>
      </div>
    </div>
  )
}

export default Topbar
