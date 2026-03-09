/**
 * ShopVerse - Product API Service
 * Fetches products from DummyJSON API
 */

const API_BASE = 'https://dummyjson.com';

const ProductAPI = {
  /**
   * Fetch products with pagination & optional filters
   */
  async getProducts({ limit = 12, skip = 0, category = '', search = '', sortBy = '', order = '' } = {}) {
    let url;

    if (search) {
      url = `${API_BASE}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category) {
      url = `${API_BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
    } else {
      url = `${API_BASE}/products?limit=${limit}&skip=${skip}`;
    }

    if (sortBy) {
      url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  /**
   * Fetch a single product by ID
   */
  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  /**
   * Fetch all categories
   */
  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  /**
   * Search products
   */
  async searchProducts(query, limit = 8) {
    const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  }
};

// Testimonial data (static)
const testimonials = [
  {
    name: "Sarah Mitchell",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=6366f1&color=fff&size=80&bold=true",
    text: "Amazing quality products! The delivery was super fast and everything was exactly as described. Will definitely order again.",
    rating: 5
  },
  {
    name: "James Rodriguez",
    avatar: "https://ui-avatars.com/api/?name=James+Rodriguez&background=7c3aed&color=fff&size=80&bold=true",
    text: "ShopVerse has become my go-to online store. The prices are competitive and the product range is impressive. Highly recommend!",
    rating: 5
  },
  {
    name: "Emily Chen",
    avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=4f46e5&color=fff&size=80&bold=true",
    text: "I've ordered from many online shops, but ShopVerse stands out. Every product has been in pristine condition. Their customer support is top-notch!",
    rating: 5
  }
];
