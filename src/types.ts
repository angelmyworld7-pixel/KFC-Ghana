export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in GH₵ (Ghanaian Cedis)
  category: 'chicken' | 'burgers' | 'buckets' | 'wraps' | 'jollof' | 'sides' | 'drinks' | 'desserts';
  image: string;
  rating: number;
  ordersCount: number;
  popular: boolean;
  limitedTime: boolean;
  calories: number;
  ingredients: string[];
  nutritionalInfo: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  deliveryAvailable: boolean;
  latitude: number;
  longitude: number;
  distance?: number; // Calculated dynamically if location is available
}

export interface CartItem {
  id: string; // unique cart item id (e.g. menuitem-id + special-modifiers)
  product: MenuItem;
  quantity: number;
  size: 'regular' | 'medium' | 'large';
  addonItems: { id: string; name: string; price: number }[];
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  itemOrdered: string;
  verified: boolean;
}
