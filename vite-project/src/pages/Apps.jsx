export function Apps() {
  return (
    <div className="flex items-center h-screen flex-col">
      {/* search bar */}
      <input type="text" className="input w-96 fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-13 bg-base-100 backdrop-blur-3xl" placeholder="Search for an app..."></input>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* app icons */}
      </div>
    </div>
  );
}
