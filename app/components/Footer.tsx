export default function Footer() {
  return (
    <footer className="bg-base-300 border-t border-base-300 text-base-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-2">Swoo</h4>
            <p className="text-base-content/70 text-sm">
              Beautiful business card design for everyone.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-base mb-4">Product</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Features</a></li>
              <li><a href="/templates" className="text-base-content/70 hover:text-base-content transition-colors">Templates</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-base mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">About</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Blog</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-base mb-4">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Privacy</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Terms</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-base-content transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-base-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base-content/70 text-sm">
            © {new Date().getFullYear()} Swoo. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-base-content/70 hover:text-base-content transition-colors text-sm">Twitter</a>
            <a href="#" className="text-base-content/70 hover:text-base-content transition-colors text-sm">GitHub</a>
            <a href="#" className="text-base-content/70 hover:text-base-content transition-colors text-sm">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
