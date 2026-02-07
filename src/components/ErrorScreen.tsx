interface Props {
  message: string;
}

export function ErrorScreen({ message }: Props) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm text-center border border-gray-100">
        <p className="text-red-600 text-sm mb-4">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
