import { useState, useEffect } from 'react';
import { database } from '../../Firebase/Firebase';
import { ref, push, set, remove, onValue, update } from 'firebase/database';
import { Plus, Search, Edit, Trash2, Package, Star, Check, X, ExternalLink } from 'lucide-react';

const AdminPanel = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    specifications: '',
    aboutItem: '',
    price: '',
    rating: '',
    category: '',
    imageUrl: '',
    referralLink: '',
    returnAvailable: false,
    freeDelivery: false,
    topBrand: false
  });
  const [loading, setLoading] = useState(false);

  // Categories for dropdown
  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports & Outdoors',
    'Books', 'Toys & Games', 'Health & Beauty', 'Automotive',
    'Jewelry', 'Food & Beverages', 'Office Supplies', 'Pet Supplies'
  ];

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts({});
        setFilteredProducts({});
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = Object.keys(products).reduce((acc, key) => {
        const product = products[key];
        if (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.details.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          acc[key] = product;
        }
        return acc;
      }, {});
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const resetForm = () => {
    setFormData({
      name: '',
      details: '',
      specifications: '',
      aboutItem: '',
      price: '',
      rating: '',
      category: '',
      imageUrl: '',
      referralLink: '',
      returnAvailable: false,
      freeDelivery: false,
      topBrand: false
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        // Update existing product
        const productRef = ref(database, `products/${editingProduct}`);
        await update(productRef, { ...productData, createdAt: products[editingProduct].createdAt });
        alert('Product updated successfully!');
      } else {
        // Add new product
        const productsRef = ref(database, 'products');
        await push(productsRef, productData);
        alert('Product added successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    const product = products[productId];
    setFormData({
      name: product.name || '',
      details: product.details || '',
      specifications: product.specifications || '',
      aboutItem: product.aboutItem || '',
      price: product.price?.toString() || '',
      rating: product.rating?.toString() || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      referralLink: product.referralLink || '',
      returnAvailable: product.returnAvailable || false,
      freeDelivery: product.freeDelivery || false,
      topBrand: product.topBrand || false
    });
    setEditingProduct(productId);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = ref(database, `products/${productId}`);
        await remove(productRef);
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-8 h-8 text-blue-900" />
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-1">Manage your affiliate products</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
                    <input
                      type="url"
                      name="referralLink"
                      value={formData.referralLink}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Details</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About This Item</label>
                    <textarea
                      name="aboutItem"
                      value={formData.aboutItem}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="returnAvailable"
                        checked={formData.returnAvailable}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Return Available</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="freeDelivery"
                        checked={formData.freeDelivery}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Free Delivery</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="topBrand"
                        checked={formData.topBrand}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Top Brand</span>
                    </label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                    </button>
                    <button
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Products ({Object.keys(filteredProducts).length})
            </h2>
          </div>

          <div className="p-6">
            {Object.keys(filteredProducts).length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400">Add your first product to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(filteredProducts).map(([productId, product], index) => (
                  <div key={productId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 rounded text-sm font-medium">
                        #{index + 1}
                      </div>
                      {product.topBrand && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                          Top Brand
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                      </div>

                      <p className="text-2xl font-bold text-blue-900 mb-2">${product.price}</p>

                      <div className="text-sm text-gray-600 mb-3">
                        <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2">{product.category}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.freeDelivery && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free Delivery</span>
                        )}
                        {product.returnAvailable && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Returns</span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">{product.details}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(productId)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(productId)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                        <a
                          href={product.referralLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;