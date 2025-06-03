import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import { Star, ExternalLink, ArrowRight, Package, ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, X, Eye } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Banner data with offers
  const banners = [
    {
      id: 1,
      title: "Great Indian Festival",
      subtitle: "Up to 80% off on Electronics",
      bgColor: "from-orange-600 to-red-600",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Fashion Sale",
      subtitle: "Minimum 50% off on Clothing & Accessories",
      bgColor: "from-purple-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Home & Kitchen",
      subtitle: "Extra 40% off on Home Appliances",
      bgColor: "from-blue-600 to-teal-600",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop"
    }
  ];

  // Auto-rotate banners every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        organizeByCategoryForHome(data);
      } else {
        setProducts({});
        setCategorizedProducts({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Organize products by category and get latest 5 for home page
  const organizeByCategoryForHome = (productsData) => {
    const organized = {};
    
    Object.entries(productsData).forEach(([productId, product]) => {
      const category = product.category || 'Uncategorized';
      
      if (!organized[category]) {
        organized[category] = [];
      }
      
      organized[category].push({ id: productId, ...product });
    });

    // Sort each category by creation date (newest first) and take only 5
    Object.keys(organized).forEach(category => {
      organized[category] = organized[category]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
    });

    setCategorizedProducts(organized);
  };

  // Open product details modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close product details modal
  const closeProductModal = () => {
    setSelectedProduct(null);
    setShowProductModal(false);
    document.body.style.overflow = 'unset';
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
          }}
        />
        {product.topBrand && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            Choice
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-blue-600 font-medium">({product.rating})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          {product.freeDelivery && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
              FREE Delivery
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.details}
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={() => openProductModal(product)}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open(product.referralLink, '_blank')}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            title="Buy Now"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Product Detail Modal
  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
                  }}
                />
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-100 p-2 rounded text-center">
                    <Share2 className="w-4 h-4 mx-auto" />
                    <span className="text-xs block mt-1">Share</span>
                  </button>
                  <button className="flex-1 bg-gray-100 p-2 rounded text-center">
                    <Heart className="w-4 h-4 mx-auto" />
                    <span className="text-xs block mt-1">Wishlist</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.topBrand && (
                    <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                      Amazon's Choice
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-blue-600 font-medium">({product.rating})</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-blue-600 hover:text-orange-600 cursor-pointer">1,234 ratings</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-red-600">₹{product.price}</span>
                    <span className="text-lg text-gray-500 line-through">₹{Math.round(product.price * 1.2)}</span>
                    <span className="text-green-700 font-medium">Save ₹{Math.round(product.price * 0.2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">FREE Delivery</span>
                    <span className="text-gray-600">by Tomorrow</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">7 Days Replacement</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-700 font-medium">1 Year Warranty</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">About this item</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.details}
                  </p>
                </div>
                
                <div className="space-y-3 pt-4">
                
                  <button
                    onClick={() => window.open(product.referralLink, '_blank')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentBanner ? 'translate-x-0' : 
              index < currentBanner ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className={`h-full bg-gradient-to-r ${banner.bgColor} relative`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="max-w-4xl px-4">
                  <h1 className="text-3xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="text-lg md:text-2xl mb-8 drop-shadow-md">
                    {banner.subtitle}
                  </p>
                  <Link
                    to="/products"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2 shadow-lg"
                  >
                    Shop Deals
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Banner Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(categorizedProducts).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Products Available</h2>
            <p className="text-gray-600">Check back later for amazing deals!</p>
          </div>
        ) : (
          Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-12">
              {/* Category Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {category}
                  </h2>
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="text-blue-600 hover:text-orange-600 font-medium flex items-center gap-1 text-sm md:text-base transition-colors"
                  >
                    See all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Detail Modal */}
      {showProductModal && (
        <ProductModal product={selectedProduct} onClose={closeProductModal} />
      )}

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 mx-4 rounded-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover millions of products
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Shop from a wide selection of quality products at great prices
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2 shadow-lg"
          >
            Start Shopping
            <Package className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;