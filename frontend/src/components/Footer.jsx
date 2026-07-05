export default function Footer() {
  return (
    <footer className="border-t border-[#253549] bg-[#162232] py-8 px-6 mt-16 font-body text-[#8B9DB5]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side: Vibe credits */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-sm font-display tracking-wider text-[#F0EDE6]">
            <span className="text-[#FF6B4A] font-semibold">//</span> Made with vibe by{" "}
            <a
              href="https://github.com/qckhanh195"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB830] hover:text-[#FF6B4A] transition-colors font-medium no-underline"
            >
              qckhanh195
            </a>
          </p>
          <p className="text-xs text-[#4A6180]">
            © {new Date().getFullYear()} GameStore. Tất cả quyền được bảo lưu.
          </p>
        </div>

        {/* Right side: Data source */}
        <div className="flex items-center gap-2 text-xs md:text-right font-display tracking-widest text-[#4A6180]">
          <span>DATA FROM</span>
          <a
            href="https://store.steampowered.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FFB830] hover:text-[#FF6B4A] transition-colors font-medium no-underline"
          >
            STEAM
          </a>
        </div>
      </div>
    </footer>
  );
}
