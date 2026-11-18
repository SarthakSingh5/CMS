export function A4Preview({ children }) {
  return (
    <div className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-zinc-100 dark:bg-black/40 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-[800px] mb-12">
        {/* Printable sheet container */}
        <div
          id="cv-print-sheet"
          className="bg-white text-zinc-900 rounded-xl shadow-2xl border border-black/10 overflow-hidden transition-all print:shadow-none print:border-none print:rounded-none print:m-0 print:p-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

