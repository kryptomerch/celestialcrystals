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
    type?: string;
    freeShipping?: boolean;
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
    shippingRate: any;
    setShippingRate: (rate: any) => void;
    getShippingCost: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
    const [shippingRate, setShippingRate] = useState<any>(null);

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
            // Use the API to validate discount codes
            const response = await fetch('/api/discount-codes/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code.trim().toUpperCase() }),
            });

            if (response.ok) {
                const discount = await response.json();
                setDiscountCode(discount);
                return discount.isValid;
            } else {
                // Fallback to local validation if API fails
                console.warn('API validation failed, using fallback');
                const discount = { code, percentage: 0, isValid: false, message: 'Unable to validate discount code' };
                setDiscountCode(discount);
                return false;
            }
        } catch (error) {
            console.error('Error applying discount code:', error);
            // Fallback validation for common codes
            const fallbackCodes = [
                { code: 'WELCOME15', percentage: 15, freeShipping: false },
                { code: 'WELCOME10', percentage: 10, freeShipping: false },
                { code: 'BDAY20', percentage: 20, freeShipping: false },
                { code: 'SAVE25', percentage: 25, freeShipping: false },
                { code: 'WEEKLY10', percentage: 10, freeShipping: false },
                { code: 'SEASON15', percentage: 15, freeShipping: false },
                { code: 'FREEDELIVERY', percentage: 0, freeShipping: true },
            ];

            const normalizedCode = code.trim().toUpperCase();
            const fallbackCode = fallbackCodes.find(c => c.code === normalizedCode);

            if (fallbackCode) {
                const discount = {
                    code: fallbackCode.code,
                    percentage: fallbackCode.percentage,
                    isValid: true,
                    message: fallbackCode.freeShipping ? 'Free delivery applied!' : `${fallbackCode.percentage}% discount applied!`,
                    freeShipping: fallbackCode.freeShipping,
                    type: fallbackCode.freeShipping ? 'FREE_SHIPPING' : 'PERCENTAGE'
                };
                setDiscountCode(discount);
                return true;
            } else {
                const discount = { code, percentage: 0, isValid: false, message: 'Invalid discount code' };
                setDiscountCode(discount);
                return false;
            }
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

    const getShippingCost = () => {
        // Check if discount code provides free shipping
        if (discountCode && discountCode.isValid && discountCode.freeShipping) {
            return 0;
        }

        if (!shippingRate) {
            // Free shipping over $75, otherwise fallback rate
            const subtotal = getTotalPrice();
            return subtotal >= 75 ? 0 : 12.99;
        }
        return shippingRate.price;
    };

    const getFinalTotal = () => {
        const subtotal = getTotalPrice();
        const discount = getDiscountAmount();
        const shipping = getShippingCost();
        const tax = (subtotal - discount + shipping) * 0.13; // 13% HST in Ontario
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
        shippingRate,
        setShippingRate,
        getShippingCost,
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
