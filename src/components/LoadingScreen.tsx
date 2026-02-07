export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading your results...</p>
      </div>
    </div>
  );
}
