export function AppFooter() {
  return (
    <footer className="mt-auto w-full border-t-[3px] border-on-background bg-surface-container">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <span className="text-center text-sm font-bold uppercase text-on-surface md:text-left">
          Agent Skills Hub — Local instance
        </span>
        <nav className="flex flex-wrap justify-center gap-6 font-bold uppercase">
          <span className="cursor-default text-outline">Privacy</span>
          <span className="cursor-default text-outline">Docs</span>
          <span className="cursor-default text-outline">Support</span>
        </nav>
        <div className="flex flex-col items-center gap-1 md:items-end">
          <p className="text-sm font-bold text-on-surface-variant">© {new Date().getFullYear()}</p>
          <p className="text-center text-xs text-on-surface-variant md:text-right">
            Created by <span className="font-bold text-on-surface">Shai Adams</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
