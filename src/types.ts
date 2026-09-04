export interface IngredientItem {
  id: string;
  name: string;
  image: string;
  className?: string;
  initialPos: { x: number; y: number; rotate: number; scale?: number };
  idleOffset: { y: number; rotate: number; duration: number };
}

export interface FlavorSlide {
  id: number;
  slug: string;
  bigWord: string;
  title: string;
  subtitle: string;
  description: string;
  bowlImage: string;
  gradient: [string, string]; // [inner, outer]
  ingredients: IngredientItem[];
  price: number;
  calories: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  tasteProfile: {
    sweetness: number;
    tartness: number;
    creaminess: number;
    freshness: number;
  };
}

export interface CartItem {
  id: string;
  flavorId: number;
  title: string;
  bowlImage: string;
  size: 'single' | 'double' | 'pint' | 'tub';
  price: number;
  quantity: number;
  toppings: string[];
}
