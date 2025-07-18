'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Crystal {
    id: string;
    name: string;
    description: string;
    price: number;
    properties: string[];
    colors: string[];
    category: string;
    chakra: string;
    zodiacSigns: string[];
    birthMonths: number[];
    element: string;
    hardness: string;
    origin: string;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
    image?: string;
}

export interface CartItem extends Crystal {
    quantity: number;
}

interface DiscountCode {
    code: string;
    percentage: number;
    isValid: boolean;
    message?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (crystal: Crystal) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    discountCode: DiscountCode | null;
    applyDiscountCode: (code: string) => Promise<boolean>;
    removeDiscountCode: () => void;
    getDiscountAmount: () => number;
    getFinalTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('celestial-cart');
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('celestial-cart', JSON.stringify(items));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }
    }, [items, isLoaded]);

    const addToCart = (crystal: Crystal) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === crystal.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === crystal.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...crystal, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    // Discount code functions
    const applyDiscountCode = async (code: string): Promise<boolean> => {
        try {
            // In a real app, validate against database
            // For now, we'll validate against common patterns
            const validCodes = [
                { code: 'WELCOME15', percentage: 15 },
                { code: 'WELCOME10', percentage: 10 },
                { code: 'BDAY20', percentage: 20 },
                { code: 'SAVE25', percentage: 25 },
                { code: 'WEEKLY10', percentage: 10 },
                { code: 'SEASON15', percentage: 15 },
            ];

            // Check if code matches pattern (for generated codes)
            const welcomeMatch = code.match(/^WELCOME\w{4,6}$/);
            const bdayMatch = code.match(/^BDAY\w{3,9}$/);
            const saveMatch = code.match(/^SAVE\w{3,9}$/);
            const weeklyMatch = code.match(/^WEEKLY\w{3,9}$/);
            const seasonMatch = code.match(/^SEASON\w{3,9}$/);
            const backMatch = code.match(/^BACK\w{3,9}$/);

            let discount: DiscountCode | null = null;

            // Check static codes first
            const staticCode = validCodes.find(c => c.code.toLowerCase() === code.toLowerCase());
            if (staticCode) {
                discount = {
                    code: staticCode.code,
                    percentage: staticCode.percentage,
                    isValid: true,
                    message: `${staticCode.percentage}% discount applied!`
                };
            }
            // Check pattern-based codes
            else if (welcomeMatch) {
                discount = { code, percentage: 15, isValid: true, message: '15% welcome discount applied!' };
            } else if (bdayMatch) {
                discount = { code, percentage: 20, isValid: true, message: '20% birthday discount applied!' };
            } else if (saveMatch) {
                discount = { code, percentage: 15, isValid: true, message: '15% discount applied!' };
            } else if (weeklyMatch) {
                discount = { code, percentage: 10, isValid: true, message: '10% weekly discount applied!' };
            } else if (seasonMatch) {
                discount = { code, percentage: 15, isValid: true, message: '15% seasonal discount applied!' };
            } else if (backMatch) {
                discount = { code, percentage: 25, isValid: true, message: '25% welcome back discount applied!' };
            } else {
                discount = { code, percentage: 0, isValid: false, message: 'Invalid discount code' };
            }

            setDiscountCode(discount);
            return discount.isValid;
        } catch (error) {
            console.error('Error applying discount code:', error);
            setDiscountCode({ code, percentage: 0, isValid: false, message: 'Error applying discount code' });
            return false;
        }
    };

    const removeDiscountCode = () => {
        setDiscountCode(null);
    };

    const getDiscountAmount = () => {
        if (!discountCode || !discountCode.isValid) return 0;
        const subtotal = getTotalPrice();
        return (subtotal * discountCode.percentage) / 100;
    };

    const getFinalTotal = () => {
        const subtotal = getTotalPrice();
        const discount = getDiscountAmount();
        const shipping = subtotal >= 50 ? 0 : 5.99;
        const tax = (subtotal - discount) * 0.08; // 8% tax on discounted amount
        return subtotal - discount + shipping + tax;
    };

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isOpen,
        setIsOpen,
        discountCode,
        applyDiscountCode,
        removeDiscountCode,
        getDiscountAmount,
        getFinalTotal,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
