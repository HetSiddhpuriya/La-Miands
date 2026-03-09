/**
 * Urban Jungle Co. - Product Data
 * All product information stored as JavaScript objects
 */

const products = [
  {
    id: 1,
    name: "Golden Glow",
    category: "Houseplants",
    price: 29.99,
    originalPrice: 39.99,
    image: "images/golden-glow.png",
    description: "The Golden Glow pothos features stunning heart-shaped leaves with golden variegation. Perfect for beginners, this trailing plant thrives in low to medium indirect light and adds a warm, luminous touch to any room. Easy to care for and incredibly resilient.",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    tags: ["trending", "popular", "bestseller"],
    care: {
      light: "Low to medium indirect light",
      water: "Water when top inch of soil is dry",
      humidity: "Average household humidity",
      temperature: "60-85°F (16-29°C)"
    }
  },
  {
    id: 2,
    name: "Desert Bloom",
    category: "Desert Plants",
    price: 24.99,
    originalPrice: 34.99,
    image: "images/desert-bloom.png",
    description: "The Desert Bloom cactus produces stunning pink flowers that contrast beautifully with its green spiny body. Native to arid regions, this low-maintenance plant requires minimal watering and thrives in bright, sunny spots. A true conversation starter.",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["trending", "popular"],
    care: {
      light: "Full direct sunlight",
      water: "Water sparingly, every 2-3 weeks",
      humidity: "Low humidity preferred",
      temperature: "65-90°F (18-32°C)"
    }
  },
  {
    id: 3,
    name: "Tropical Breeze",
    category: "Outdoor Plants",
    price: 34.99,
    originalPrice: 49.99,
    image: "images/tropical-breeze.png",
    description: "Bring the tropics home with the Tropical Breeze palm. Its lush, arching fronds create a stunning canopy of green, instantly transforming any space into a tropical paradise. Perfect for living rooms, patios, and office spaces.",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    tags: ["trending", "popular", "bestseller"],
    care: {
      light: "Bright indirect light",
      water: "Keep soil consistently moist",
      humidity: "High humidity preferred",
      temperature: "65-85°F (18-29°C)"
    }
  },
  {
    id: 4,
    name: "Peace Lily",
    category: "Houseplants",
    price: 27.99,
    originalPrice: 35.99,
    image: "images/peace-lily.png",
    description: "The elegant Peace Lily is known for its graceful white blooms and glossy dark green leaves. An excellent air purifier, it removes toxins while adding a serene, sophisticated touch to any indoor environment. Thrives in low-light conditions.",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    tags: ["popular", "bestseller"],
    care: {
      light: "Low to medium indirect light",
      water: "Keep soil moist, water weekly",
      humidity: "High humidity preferred",
      temperature: "65-80°F (18-27°C)"
    }
  },
  {
    id: 5,
    name: "Snake Plant",
    category: "Succulents",
    price: 22.99,
    originalPrice: 29.99,
    image: "images/snake-plant.png",
    description: "The Snake Plant (Sansevieria) is virtually indestructible, making it perfect for busy plant parents. Its striking upright sword-like leaves feature beautiful yellow-green variegation. Known as one of the best air-purifying plants by NASA.",
    rating: 4.9,
    reviews: 312,
    inStock: true,
    tags: ["popular", "bestseller"],
    care: {
      light: "Tolerates low to bright indirect light",
      water: "Water every 2-3 weeks",
      humidity: "Average household humidity",
      temperature: "55-85°F (13-29°C)"
    }
  },
  {
    id: 6,
    name: "Rubber Fig",
    category: "Houseplants",
    price: 32.99,
    originalPrice: 42.99,
    image: "images/rubber-fig.png",
    description: "The Rubber Fig (Ficus Elastica) boasts large, glossy, dark burgundy-green leaves that make a bold statement in any room. This robust and elegant houseplant grows into a stunning indoor tree and is known for its air-purifying qualities.",
    rating: 4.5,
    reviews: 98,
    inStock: true,
    tags: ["popular"],
    care: {
      light: "Bright indirect light",
      water: "Water when top 2 inches dry",
      humidity: "Average to high humidity",
      temperature: "60-80°F (16-27°C)"
    }
  },
  {
    id: 7,
    name: "Aloe Vera",
    category: "Succulents",
    price: 19.99,
    originalPrice: 25.99,
    image: "images/aloe-vera.png",
    description: "Aloe Vera is not just a beautiful succulent — it's a living medicine cabinet. Its thick, fleshy leaves contain a soothing gel used for burns, skin care, and wellness. Easy to grow and maintain, it's the ultimate functional houseplant.",
    rating: 4.8,
    reviews: 267,
    inStock: true,
    tags: ["popular", "bestseller"],
    care: {
      light: "Bright direct or indirect light",
      water: "Water every 2-3 weeks",
      humidity: "Low humidity preferred",
      temperature: "55-80°F (13-27°C)"
    }
  },
  {
    id: 8,
    name: "Monstera Delight",
    category: "Houseplants",
    price: 39.99,
    originalPrice: 54.99,
    image: "images/tropical-breeze.png",
    description: "The iconic Monstera Deliciosa, also known as the Swiss Cheese Plant, features dramatic split and perforated leaves. A fast grower that makes a stunning statement piece, this tropical beauty is a must-have for any plant enthusiast.",
    rating: 4.9,
    reviews: 345,
    inStock: true,
    tags: ["trending", "bestseller"],
    care: {
      light: "Bright indirect light",
      water: "Water when top inch is dry",
      humidity: "High humidity preferred",
      temperature: "65-85°F (18-29°C)"
    }
  },
  {
    id: 9,
    name: "Jade Succulent",
    category: "Succulents",
    price: 18.99,
    originalPrice: 24.99,
    image: "images/aloe-vera.png",
    description: "The Jade Plant symbolizes good luck and prosperity. Its thick, woody stems and plump, oval leaves give it a miniature tree-like appearance. This long-lived succulent can thrive for decades with minimal care.",
    rating: 4.6,
    reviews: 178,
    inStock: true,
    tags: ["popular"],
    care: {
      light: "Bright indirect to direct light",
      water: "Water every 2-3 weeks",
      humidity: "Low humidity",
      temperature: "55-75°F (13-24°C)"
    }
  },
  {
    id: 10,
    name: "Bird of Paradise",
    category: "Outdoor Plants",
    price: 44.99,
    originalPrice: 59.99,
    image: "images/golden-glow.png",
    description: "The Bird of Paradise is a showstopper with its huge, banana-like leaves that bring dramatic tropical flair to any space. Given enough light, mature plants produce extraordinary bird-shaped flowers in vivid orange and blue.",
    rating: 4.7,
    reviews: 134,
    inStock: true,
    tags: ["trending", "popular"],
    care: {
      light: "Bright direct to indirect light",
      water: "Water weekly, keep soil moist",
      humidity: "High humidity preferred",
      temperature: "65-85°F (18-29°C)"
    }
  },
  {
    id: 11,
    name: "Barrel Cactus",
    category: "Desert Plants",
    price: 21.99,
    originalPrice: 28.99,
    image: "images/desert-bloom.png",
    description: "The Barrel Cactus is a bold, sculptural addition to any plant collection. With its rounded ribbed form and golden spines, it brings desert beauty indoors. Extremely low maintenance, requiring very little water.",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    tags: ["popular"],
    care: {
      light: "Full direct sunlight",
      water: "Water monthly",
      humidity: "Low humidity",
      temperature: "65-95°F (18-35°C)"
    }
  },
  {
    id: 12,
    name: "Lavender Dream",
    category: "Outdoor Plants",
    price: 26.99,
    originalPrice: 34.99,
    image: "images/peace-lily.png",
    description: "Lavender Dream fills your garden or balcony with its incredible fragrance and beautiful purple blooms. Beyond its beauty, lavender has calming aromatherapy properties and attracts pollinators like bees and butterflies.",
    rating: 4.8,
    reviews: 189,
    inStock: true,
    tags: ["popular", "bestseller"],
    care: {
      light: "Full sun, 6+ hours daily",
      water: "Water when soil is dry",
      humidity: "Low humidity preferred",
      temperature: "60-80°F (16-27°C)"
    }
  }
];

// Category data for category section
const categories = [
  {
    name: "Houseplants",
    image: "images/golden-glow.png",
    count: products.filter(p => p.category === "Houseplants").length
  },
  {
    name: "Outdoor Plants",
    image: "images/tropical-breeze.png",
    count: products.filter(p => p.category === "Outdoor Plants").length
  },
  {
    name: "Succulents",
    image: "images/snake-plant.png",
    count: products.filter(p => p.category === "Succulents").length
  },
  {
    name: "Desert Plants",
    image: "images/desert-bloom.png",
    count: products.filter(p => p.category === "Desert Plants").length
  }
];

// Testimonial data
const testimonials = [
  {
    name: "Sarah Mitchell",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=2d6a4f&color=fff&size=80",
    text: "Absolutely love my Golden Glow! It arrived perfectly packaged and has been thriving in my apartment. The quality is outstanding and the customer service team was incredibly helpful.",
    rating: 5
  },
  {
    name: "James Rodriguez",
    avatar: "https://ui-avatars.com/api/?name=James+Rodriguez&background=40916c&color=fff&size=80",
    text: "Urban Jungle Co. has transformed my home office into a green paradise. The plants are healthy, vibrant, and the delivery was faster than expected. Highly recommend!",
    rating: 5
  },
  {
    name: "Emily Chen",
    avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=52b788&color=fff&size=80",
    text: "I've ordered from many online plant shops, but Urban Jungle Co. stands out. Every plant I've received has been in pristine condition. Their care guides are super helpful too!",
    rating: 5
  }
];
