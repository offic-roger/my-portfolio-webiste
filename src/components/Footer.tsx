"use client";

export default function Footer() {
  return (
    <footer
      className="relative w-full py-12 px-6 md:px-10 bg-[#0A0A0A] border-t border-white/10"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left: Tagline & Copyright */}
        <div className="flex flex-col gap-2">
          <p className="text-white/80 text-[14px] font-body max-w-[300px]">
            Designed, animated and crafted by Official Roger — powered by creativity and passion.
          </p>
          <p className="text-white/50 text-[12px] font-body mt-2">
            © 2026 Official Roger. All rights reserved.
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-wrap gap-4 md:gap-6 items-center">
          {["Home", "About", "Services", "Portfolio", "Pricing", "Testimonials", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/60 hover:text-white text-[13px] uppercase tracking-widest transition-colors nav-link"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: Social Links */}
        <div className="flex flex-wrap gap-4 md:gap-5 items-center">
          {["Instagram", "Threads", "TikTok", "YouTube", "LinkedIn", "Behance"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-white/60 hover:text-[#E25822] text-[13px] transition-colors"
            >
              {social}
            </a>
          ))}
        </div>
        
      </div>
    </footer>
  );
}
