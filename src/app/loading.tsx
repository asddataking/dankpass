// DANKPASS: Loading component for suspense boundaries
export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        <p className="text-gray-400">Please wait while we load your page.</p>
      </div>
    </div>
  )
}
