export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-dp-blue-300 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/70">Loading...</p>
      </div>
    </div>
  );
}
