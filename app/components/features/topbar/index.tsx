const Topbar = () => {
  return (
    <div className="w-full flex justify-center items-center h-[40px] absolute top-0 border-l-0 border-r-0 border-t-0 border-dotted border-secondary shadow-secondary">
      <div className="cursor-pointer flex flex-col items-center space-x-2 w-fit">
        <span className="text-sm font-bold">Gyoza OS</span>
        <span className="text-xs">
          Chat around, find out. DeFi made simple.
        </span>
      </div>
    </div>
  )
}

export default Topbar
