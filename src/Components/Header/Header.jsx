import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Home, Package, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
  to="/"
  className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:scale-105"
  onClick={() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }}
>
  {/* Logo Container */}
  <div className="flex-shrink-0 p-1.5 sm:p-2 bg-gradient-to-r from-gray-500 to-black-500 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
    <img 
      src="https://www.emergeconstruction.in/logo.png" 
      alt="Emerge Home Logo" 
      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
    />
  </div>
  
  {/* Brand Text */}
  <span className="text-white text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
    Emerge Home
  </span>
</Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 pr-12 text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-full focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 placeholder-gray-500 shadow-lg hover:shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-300 group-hover:scale-110"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="text-white hover:text-orange-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/products"
              className="text-white hover:text-orange-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
            >
              <Package className="w-4 h-4" />
              Products
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className={`p-2 rounded-full transition-all duration-300 ${
                isSearchOpen 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-white hover:text-orange-400 hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-full transition-all duration-300 ${
                isMenuOpen 
                  ? 'text-orange-400 bg-orange-500/20' 
                  : 'text-white hover:text-orange-400 hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'max-h-20 pb-4' : 'max-h-0'
        }`}>
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 pr-12 text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-full focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 placeholder-gray-500 shadow-lg"
                autoFocus={isSearchOpen}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-40 pb-4' : 'max-h-0'
        }`}>
          <div className="space-y-2 pt-2">
            <Link
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(false);
              }}
              className="text-white hover:text-orange-400 block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm group"
            >
              <div className="p-1 rounded-lg bg-white/10 group-hover:bg-orange-500/20 transition-all duration-300">
                <Home className="w-4 h-4" />
              </div>
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(false);
              }}
              className="text-white hover:text-orange-400 block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm group"
            >
              <div className="p-1 rounded-lg bg-white/10 group-hover:bg-orange-500/20 transition-all duration-300">
                <Package className="w-4 h-4" />
              </div>
              Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;