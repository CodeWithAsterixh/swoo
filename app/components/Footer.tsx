export default function Footer() {
  return (
    <footer className="relative bg-base-200 border-t border-base-300 text-base-content overflow-hidden">
      {/* THEME-BASED GRADIENT BLOB */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-40 blur-3xl z-0"
        style={{
          background: `
            radial-gradient(
              ellipse at 50% 40%,
              oklch(58% 0.233 277.117 / 0.45),  /* primary */
              oklch(77% 0.152 181.912 / 0.25),  /* accent */
              transparent 70%
            )
          `
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Branding */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-primary-content">S</span>
          </div>

          <div>
            <div className="font-bold text-lg tracking-tight text-base-content">
              Swoo
            </div>
            <div className="text-base-content/70 text-sm max-w-xs">
              Effortless business card & template design for everyone.
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5">
          {/* Twitter */}
          <a href="#" aria-label="Twitter" className="group">
            <svg
              className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M22 4.01c-.77.35-1.6.59-2.47.7A4.13 4.13 0 0021.4 2.2a8.19 8.19 0 01-2.6 1A4.11 4.11 0 0012 6.13c0 .32.04.64.1.94A11.65 11.65 0 013 3.16a4.11 4.11 0 001.27 5.48c-.7-.02-1.36-.22-1.94-.54v.05a4.13 4.13 0 003.3 4.03c-.32.09-.66.14-1.01.14-.25 0-.48-.02-.71-.07a4.13 4.13 0 003.84 2.85A8.25 8.25 0 012 19.54a11.62 11.62 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022 4.01z" />
            </svg>
          </a>

          {/* GitHub */}
          <a href="#" aria-label="GitHub" className="group">
            <svg
              className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.03 1-2.75-.1-.26-.44-1.3.1-2.7 0 0 .83-.27 2.75 1.02A9.36 9.36 0 0112 7.43c.84.004 1.68.11 2.47.32 1.92-1.29 2.75-1.02 2.75-1.02.54 1.4.2 2.44.1 2.7.62.72 1 1.63 1 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z" />
            </svg>
          </a>

          {/* Discord */}
          <a href="#" aria-label="Discord" className="group">
            <svg
              className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152..."/>
            </svg>
          </a>
        </div>
      </div>

      <div className="relative z-10 text-center text-xs text-base-content/60 mt-8 pb-2">
        © {new Date().getFullYear()} Swoo. All rights reserved.
      </div>
    </footer>
  );
}
