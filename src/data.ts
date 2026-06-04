import { MenuItem, Store, LoyaltyReward, Review } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Jollof & Local Specialties
  {
    id: 'jollof-streetwise-1',
    name: 'Streetwise 1 with Jollof',
    description: 'Perfectly seasoned traditional Ghanaian Jollof rice served with 1 piece of hot, juicy signature KFC fried chicken and our premium local shito chili dip.',
    price: 45.00,
    category: 'jollof',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    ordersCount: 1542,
    popular: true,
    limitedTime: false,
    calories: 680,
    ingredients: ['KFC Chicken', 'Ghanaian Jollof Rice', 'Shito sauce', 'Spices'],
    nutritionalInfo: { protein: '32g', carbs: '78g', fat: '24g' }
  },
  {
    id: 'jollof-giant',
    name: 'Streetwise Jollof Giant Feaster',
    description: 'A massive double-serving of spicy local Jollof rice, served with 2 pieces of crispy golden chicken, creamy coleslaw, and a refreshing chilled drink.',
    price: 85.00,
    category: 'jollof',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ordersCount: 2311,
    popular: true,
    limitedTime: false,
    calories: 1120,
    ingredients: ['2x KFC Chicken pieces', 'Double Jollof Rice', 'Coleslaw', 'Soda drink'],
    nutritionalInfo: { protein: '54g', carbs: '110g', fat: '42g' }
  },
  {
    id: 'jollof-bucket-feast',
    name: 'KFC Ghana Jollof Bucket Feast',
    description: 'The ultimate family shares! 6 pieces of our legendary fried chicken, 3 generous bowls of seasoned Jollof rice, a gold basket of fries, and a large bottle of dynamic cola.',
    price: 210.00,
    category: 'buckets',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    rating: 5.0,
    ordersCount: 928,
    popular: true,
    limitedTime: true,
    calories: 2450,
    ingredients: ['6x KFC Original or Crispy Chicken', '3x Jollof Rice bowls', 'Family Crispy Fries', '1.5L Soda'],
    nutritionalInfo: { protein: '142g', carbs: '290g', fat: '115g' }
  },

  // Chicken
  {
    id: 'chicken-streetwise-2',
    name: 'Streetwise 2 Classic',
    description: 'Our top-seller globally and locally. 2 golden, perfectly seasoned fried chicken pieces served with a side of crispy golden fries and shito condiment.',
    price: 60.00,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    ordersCount: 4520,
    popular: true,
    limitedTime: false,
    calories: 790,
    ingredients: ['2x Chicken pieces', 'Regular fries', 'Shito dip'],
    nutritionalInfo: { protein: '44g', carbs: '52g', fat: '35g' }
  },
  {
    id: 'chicken-wings-6',
    name: '6 Hot Spicy Wings Combo',
    description: '6 fiery visual zesty hot wings tossed in premium spices, served with a regular portion of golden fries and choice of garlic dip or local chili sauce.',
    price: 75.00,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    ordersCount: 3120,
    popular: true,
    limitedTime: false,
    calories: 630,
    ingredients: ['6x Zesty chicken wings', 'Fries', 'Chili garlic sauce'],
    nutritionalInfo: { protein: '38g', carbs: '45g', fat: '28g' }
  },
  {
    id: 'chicken-golden-10',
    name: 'The 10-Piece Golden Wonder Bucket',
    description: 'Share the crunch! 10 succulent pieces of hot & crispy or legendary original recipe chicken prepared fresh in-store. Ideal for parties and family get-togethers.',
    price: 180.00,
    category: 'buckets',
    image: 'https://images.unsplash.com/photo-1627662236973-4f8259fa2441?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ordersCount: 1845,
    popular: false,
    limitedTime: false,
    calories: 2150,
    ingredients: ['10x assorted KFC Fried Chicken pieces'],
    nutritionalInfo: { protein: '175g', carbs: '8g', fat: '140g' }
  },

  // Burgers
  {
    id: 'burger-zinger',
    name: 'Zinger Burger Classic',
    description: 'Our signature fiery zinger chicken breast nested in a warm toasted sesame seed bun, stacked high with fresh crisp lettuce and spicy black pepper mayo.',
    price: 68.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ordersCount: 4120,
    popular: true,
    limitedTime: false,
    calories: 520,
    ingredients: ['Spicy Zinger Chicken patty', 'Toasted Sesame Bun', 'Crispy lettuce', 'Zinger Mayo Sauce'],
    nutritionalInfo: { protein: '29g', carbs: '42g', fat: '21g' }
  },
  {
    id: 'burger-tower-combo',
    name: 'Zinger Tower Mighty Combo',
    description: 'The ultimate power burger. Zinger spicy fillet stacked with a crispy hashbrown, golden cheese slice, tangy tomato ketchup, and spicy mayo. Complete with fries & soda.',
    price: 98.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    ordersCount: 1150,
    popular: false,
    limitedTime: true,
    calories: 1210,
    ingredients: ['Zinger chicken fillet', 'Hashbrown', 'Cheddar cheese slice', 'Sesame Bun', 'Big fries', 'Large drink'],
    nutritionalInfo: { protein: '42g', carbs: '115g', fat: '49g' }
  },

  // Wraps
  {
    id: 'wrap-twister',
    name: 'Crispy Twister Wrap',
    description: 'Crisp chicken tenders, diced ripe tomatoes, shredded garden lettuce, and sweet pepper mayo, beautifully wrapped in a toasted flour tortilla.',
    price: 55.00,
    category: 'wraps',
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    ordersCount: 1980,
    popular: false,
    limitedTime: false,
    calories: 460,
    ingredients: ['2x Crispy chicken tenders', 'Tender flour tortilla', 'Fresh tomatoes & lettuce', 'Pepper mayo'],
    nutritionalInfo: { protein: '21g', carbs: '38g', fat: '18g' }
  },

  // Sides
  {
    id: 'side-yam-fries',
    name: 'Ghanaian Golden Yam Fries',
    description: 'Thick hand-cut premium local sweet yams fried to absolute crispy perfection and seasoned with a light touch of local bird-eye chili salt.',
    price: 28.00,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ordersCount: 2980,
    popular: true,
    limitedTime: false,
    calories: 320,
    ingredients: ['Local sweet Ghanaian Yam', 'Chili salt', 'Vegetable fry oil'],
    nutritionalInfo: { protein: '4g', carbs: '65g', fat: '8g' }
  },
  {
    id: 'side-fries-classic',
    name: 'Signature Crispy Fries',
    description: 'Crispy on the outside, soft and fluffy on the inside. Our classic golden potato fries cooked to perfection. Best paired with local shito or ketchup.',
    price: 22.00,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    ordersCount: 4500,
    popular: false,
    limitedTime: false,
    calories: 310,
    ingredients: ['Selected premium potatoes', 'Sea Salt'],
    nutritionalInfo: { protein: '3g', carbs: '41g', fat: '11g' }
  },
  {
    id: 'side-coleslaw',
    name: 'Creamy Colonel Coleslaw',
    description: 'Fresh, crunchily shredded green cabbage, sweet julienned carrots, tossed in the Colonel’s signature secret sweet buttermilk sauce.',
    price: 18.00,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    ordersCount: 2210,
    popular: false,
    limitedTime: false,
    calories: 140,
    ingredients: ['White cabbage', 'Fresh carrots', 'KFC recipe dressing cream'],
    nutritionalInfo: { protein: '1g', carbs: '12g', fat: '9g' }
  },

  // Drinks & desserts
  {
    id: 'drink-krushers-strawberry',
    name: 'Strawberry Shortcake Krusher',
    description: 'Our luxurious ice-blended, super creamy strawberry milkshake layered with golden biscuit crumbs and rich strawberry visual coulis.',
    price: 36.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ordersCount: 1670,
    popular: true,
    limitedTime: false,
    calories: 410,
    ingredients: ['Buttermilk ice cream bases', 'Premium strawberry syrup', 'Biscuit crumbs'],
    nutritionalInfo: { protein: '6g', carbs: '68g', fat: '14g' }
  },
  {
    id: 'drink-soda-large',
    name: 'Chilled Coke with Ice',
    description: 'Ice-cold carbonated Coca Cola classic to perfectly cut through the mouthwatering rich oils of our fried chicken.',
    price: 15.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    rating: 4.5,
    ordersCount: 6510,
    popular: false,
    limitedTime: false,
    calories: 180,
    ingredients: ['Carbonated cola base', 'Filtered Ice'],
    nutritionalInfo: { protein: '0g', carbs: '45g', fat: '0g' }
  }
];

export const GHANA_STORES: Store[] = [
  {
    id: 'store-accra-mall',
    name: 'KFC Accra Mall',
    address: 'Accra Mall, Tetteh Quarshie Interchange, East Legon, Accra',
    phone: '+233 30 282 4155',
    hours: '08:00 AM - 11:30 PM',
    deliveryAvailable: true,
    latitude: 5.6179,
    longitude: -0.1681
  },
  {
    id: 'store-osu-oxford',
    name: 'KFC Osu Oxford Street',
    address: 'Oxford Street (opposite Cantonments Rd junction), Osu, Accra',
    phone: '+233 30 279 8122',
    hours: '08:00 AM - 02:00 AM (Late Night)',
    deliveryAvailable: true,
    latitude: 5.5601,
    longitude: -0.1812
  },
  {
    id: 'store-kumasi-mall',
    name: 'KFC Kumasi City Mall',
    address: 'Kumasi City Mall, Lake Road, Kumasi',
    phone: '+233 32 208 9110',
    hours: '09:00 AM - 10:30 PM',
    deliveryAvailable: true,
    latitude: 6.6715,
    longitude: -1.6110
  },
  {
    id: 'store-tema-comm1',
    name: 'KFC Tema Community 1',
    address: 'General Service Area, Community 1 (Next to Zenith Bank), Tema',
    phone: '+233 30 321 0422',
    hours: '08:00 AM - 11:00 PM',
    deliveryAvailable: true,
    latitude: 5.6421,
    longitude: 0.0015
  },
  {
    id: 'store-dansoman',
    name: 'KFC Dansoman',
    address: 'Dansoman High St, opposite Mount Olivet Methodist Church, Accra',
    phone: '+233 30 231 9283',
    hours: '08:00 AM - 11:00 PM',
    deliveryAvailable: true,
    latitude: 5.5492,
    longitude: -0.2642
  },
  {
    id: 'store-east-legon',
    name: 'KFC East Legon',
    address: 'Lagos Avenue, adjacent to Shell Service Station, East Legon, Accra',
    phone: '+233 30 254 9118',
    hours: '08:00 AM - 12:00 AM',
    deliveryAvailable: true,
    latitude: 5.6321,
    longitude: -0.1542
  }
];

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'reward-krushers',
    title: 'Free Creamy Krusher Shake',
    pointsCost: 40,
    description: 'Cool down with your choice of any Strawberry, Oreo, or Vanilla Krusher shake.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'reward-hot-wings',
    title: 'Free 4-Piece Hot Spicy Wings',
    pointsCost: 75,
    description: 'Add extra fire to your day. Get 4 pieces of crispy, spicy chicken hot wings.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'reward-streetwise-2',
    title: 'Free Streetwise 2 Meal',
    pointsCost: 120,
    description: 'The standard of taste. 2 juicy pieces of chicken, golden fries, and Shito condiment.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'reward-bucket-feast',
    title: 'Free 8-Piece Fried Chicken Bucket',
    pointsCost: 200,
    description: 'The golden crown of sharing. A colossal bucket containing 8 original or crispy pieces.',
    image: 'https://images.unsplash.com/photo-1627662236973-4f8259fa2441?w=300&auto=format&fit=crop&q=80'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'review-1',
    name: 'Kwame Osei',
    rating: 5,
    date: 'June 01, 2026',
    comment: 'The Jollof Streetwise is the best localized fast-food combo ever created in Ghana! Highly recommend ordering via mobile web. MoMo payment took literally 5 seconds.',
    itemOrdered: 'Streetwise 1 with Jollof',
    verified: true
  },
  {
    id: 'review-2',
    name: 'Afi Mensah',
    rating: 5,
    date: 'May 28, 2026',
    comment: 'Fast delivery from KFC East Legon site! The zinger chicken was blazing hot and super juicy. Appreciated the dynamic delivery tracking.',
    itemOrdered: 'Zinger Burger Classic',
    verified: true
  },
  {
    id: 'review-3',
    name: 'Ebenezer Lartey',
    rating: 4,
    date: 'May 15, 2026',
    comment: 'Yam fries are crispy, thick, and non-greasy. Love the local shito option. Super easy to buy with MTN MoMo. Points added to my rewards balance immediately context!',
    itemOrdered: 'Ghanaian Golden Yam Fries',
    verified: true
  }
];

export const UPSELL_ITEMS = [
  { id: 'upsell-yam', name: 'Add Yam Fries', price: 28.00, desc: 'Thick-cut sweet local yams', icon: '🍟' },
  { id: 'upsell-krush', name: 'Upgrade to Oreo Krusher', price: 35.00, desc: 'Decadent blended cookies & cream', icon: '🥤' },
  { id: 'upsell-wings', name: 'Add 3 Hot Wings', price: 40.00, desc: 'Zesty wings with chili kick', icon: '🍗' },
  { id: 'upsell-coleslaw', name: 'Add Cup of Coleslaw', price: 18.00, desc: 'Fresh crunchy buttermilk salad', icon: '🥗' }
];
