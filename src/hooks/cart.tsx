import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const data = await AsyncStorage.getItem('@GoMarketplace:product');

      if (data) {
        setProducts(JSON.parse(data));
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function setAsyncStorage(): Promise<void> {
      await AsyncStorage.setItem(
        '@GoMarketplace:product',
        JSON.stringify(products),
      );
    }
    if (products) {
      setAsyncStorage();
    }
  }, [products]);

  const addToCart = useCallback(
    async (product) => {
      const findProduct = products.find(
        (oldProduct) => oldProduct.id === product.id,
      );

      if (findProduct) {
        setProducts(
          products.map((p) => {
            if (p.id === product.id) {
              return { ...findProduct, quantity: findProduct.quantity + 1 };
            }
            return p;
          }),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }
    },
    [products],
  );

  const increment = useCallback(
    async (id) => {
      setProducts(
        products.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        ),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async (id) => {
      setProducts(
        products
          .map((product) =>
            product.id === id
              ? { ...product, quantity: product.quantity - 1 }
              : product,
          )
          .filter((product) => product.quantity > 0),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

export { CartProvider, useCart };
