// Loading de las páginas del panel (dentro del layout con sidebar).
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-main-600 border-t-transparent" />
    </div>
  );
}
