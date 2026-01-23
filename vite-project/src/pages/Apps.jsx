export function Apps() {
  return (
    <div className="flex items-center h-screen flex-col">
      {/* search bar */}
      <input type="text" className="input w-100 mt-20" placeholder="Search for an app..."></input>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* app icons */}
      </div>
    </div>
  );
}
