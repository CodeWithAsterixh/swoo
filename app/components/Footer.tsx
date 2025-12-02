export default function Footer() {
  return (
    <footer className="relative bg-base-200 border-t border-base-300 text-base-content overflow-hidden">
      {/* Gradient blob background */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-40 blur-3xl z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #ffb86b 0%, #ffb86b22 60%, transparent 100%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Branding and description */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-primary-content">S</span>
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight">Swoo</div>
            <div className="text-base-content/70 text-sm max-w-xs">
              Effortless business card & template design for everyone.
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="flex gap-5">
          <a href="#" aria-label="Twitter" className="group">
            <svg className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 4.01c-.77.35-1.6.59-2.47.7A4.13 4.13 0 0021.4 2.2a8.19 8.19 0 01-2.6 1A4.11 4.11 0 0012 6.13c0 .32.04.64.1.94A11.65 11.65 0 013 3.16a4.11 4.11 0 001.27 5.48c-.7-.02-1.36-.22-1.94-.54v.05a4.13 4.13 0 003.3 4.03c-.32.09-.66.14-1.01.14-.25 0-.48-.02-.71-.07a4.13 4.13 0 003.84 2.85A8.25 8.25 0 012 19.54a11.62 11.62 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022 4.01z" /></svg>
          </a>
          <a href="#" aria-label="GitHub" className="group">
            <svg className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.03 1-2.75-.1-.26-.44-1.3.1-2.7 0 0 .83-.27 2.75 1.02A9.36 9.36 0 0112 7.43c.84.004 1.68.11 2.47.32 1.92-1.29 2.75-1.02 2.75-1.02.54 1.4.2 2.44.1 2.7.62.72 1 1.63 1 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z" /></svg>
          </a>
          <a href="#" aria-label="Discord" className="group">
            <svg className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276c-.598.3428-1.2205.6447-1.8733.8923a.0766.0766 0 00-.0406.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1822 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.1046 2.1568 2.4189 0 1.3333-.9555 2.419-2.1569 2.419zm7.9748 0c-1.1822 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9554-2.4189 2.1568-2.4189 1.2108 0 2.1757 1.1046 2.1568 2.4189 0 1.3333-.946 2.419-2.1568 2.419z" /></svg>
          </a>
        </div>
      </div>

      <div className="relative z-10 text-center text-xs text-base-content/60 mt-8 pb-2">
        © {new Date().getFullYear()} Swoo. All rights reserved.
      </div>
    </footer>
  );
}
