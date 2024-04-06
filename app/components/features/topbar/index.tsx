const Topbar = () => {
  return (
    <div className="w-full px-2 py-3 absolute top-0 border-l-0 border-r-0 border-t-0 border-dotted border-secondary shadow-secondary">
      <div className="cursor-pointer flex items-center space-x-2 w-fit">
        <img src="/gyozai.png" alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="text-sm">GyozAI</span>
      </div>
    </div>
  )
}

export default Topbar
