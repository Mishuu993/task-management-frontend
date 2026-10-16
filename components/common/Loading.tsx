export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
      </div>
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  );
}
