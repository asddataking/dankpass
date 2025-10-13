export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="muted mb-6">We hit a snag loading this page. You can try again or go back home.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Try again</button>
          <a href="/dashboard" className="btn-ghost">Go to Dashboard</a>
        </div>
      </div>
    </div>
  );
}
