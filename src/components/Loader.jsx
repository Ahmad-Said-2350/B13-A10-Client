export default function Loader({ fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen bg-page" : "py-20"
      }`}
    >
      <div className="w-10 h-10 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
      <p className="text-xs text-muted tracking-widest uppercase">Loading</p>
    </div>
  );
}
