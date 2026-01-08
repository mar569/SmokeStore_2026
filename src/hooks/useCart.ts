// hooks/useCart.ts (обновленный с toast уведомлениями)
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // Предполагаем, что используете sonner для toast

interface CartItem {
  id: string;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const addToCart = (productId: string, quantity: number) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      updatedCart.push({ id: productId, quantity });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Товар добавлен в корзину!'); // Уведомление
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.info('Товар удален из корзины.'); // Уведомление
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    toast.info('Корзина очищена.'); // Уведомление
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
