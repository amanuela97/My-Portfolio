export function Footer() {
  return (
    <footer className="py-8 text-center border-t border-slate-800">
      <p className="text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Built by Amanuel Zewdie. Design
        inspired by{" "}
        <a
          href="https://brittanychiang.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Brittany Chiang
        </a>
      </p>
    </footer>
  );
}
