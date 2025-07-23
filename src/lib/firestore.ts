// Real Firestore Service with Firebase Integration
import { db } from './firebase-config';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

// Collections
const COLLECTIONS = {
  users: 'users',
  emailSubscribers: 'emailSubscribers',
  discountCodes: 'discountCodes',
  emailLogs: 'emailLogs',
  analytics: 'analytics',
  crystals: 'crystals',
  orders: 'orders',
  inventory: 'inventory'
};

// Real Firestore Service
export class FirestoreService {
  // Users
  static async createUser(userData: {
    email: string
    firstName: string
    lastName?: string
    password: string
    birthDate?: Date
  }) {
    try {
      const userDoc = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        role: 'USER'
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.users), userDoc);
      console.log('✅ Firebase: User created successfully:', { id: docRef.id, email: userData.email });

      return { id: docRef.id, ...userDoc };
    } catch (error) {
      console.error('❌ Firebase: Error creating user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const q = query(collection(db, COLLECTIONS.users), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('ℹ️ Firebase: No user found with email:', email);
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      console.log('✅ Firebase: User found by email:', email);
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('❌ Firebase: Error getting user by email:', error);
      return null;
    }
  }

  static async getUserById(id: string) {
    const user = mockDatabase.users.get(id)
    if (!user) {
      console.log('ℹ️ Mock: No user found with ID:', id)
      return null
    }
    console.log('✅ Mock: User found by ID:', id)
    return { id, ...user }
  }

  // Email Subscribers
  static async createEmailSubscriber(data: {
    email: string
    firstName: string
    lastName?: string
    source: string
  }) {
    const id = generateId()
    const subscriber = {
      id,
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDatabase.emailSubscribers.set(id, subscriber)
    console.log('✅ Mock: Email subscriber created:', data.email)
    return subscriber
  }

  // Discount Codes
  static async createDiscountCode(data: {
    code: string
    email: string
    percentage: number
    expiryDate: Date
    reason: string
  }) {
    const id = generateId()
    const discountCode = {
      id,
      ...data,
      isValid: true,
      createdAt: new Date(),
    }
    mockDatabase.discountCodes.set(id, discountCode)
    console.log('✅ Mock: Discount code created:', data.code)
    return discountCode
  }

  // Email Logs
  static async createEmailLog(data: {
    email: string
    subject: string
    template: string
    status: string
    provider: string
    providerId?: string
    errorMessage?: string
  }) {
    const id = generateId()
    const emailLog = {
      id,
      ...data,
      sentAt: new Date(),
    }
    mockDatabase.emailLogs.set(id, emailLog)
    console.log('✅ Mock: Email log created:', data.template)
    return emailLog
  }

  // Analytics
  static async createAnalyticsEvent(data: {
    event: string
    userId?: string
    sessionId?: string
    page?: string
    userAgent?: string
    ip?: string
    data?: any
  }) {
    const id = generateId()
    const analyticsEvent = {
      id,
      ...data,
      timestamp: new Date(),
    }
    mockDatabase.analytics.set(id, analyticsEvent)
    console.log('✅ Mock: Analytics event tracked:', data.event)
    return analyticsEvent
  }

  // Crystals (for testing)
  static async getCrystals() {
    const crystals = Array.from(mockDatabase.crystals.values())
    console.log('✅ Mock: Retrieved crystals:', crystals.length)
    return crystals
  }

  static async getCrystalById(id: string) {
    const crystal = mockDatabase.crystals.get(id)
    if (!crystal) {
      console.log('ℹ️ Mock: No crystal found with ID:', id)
      return null
    }
    console.log('✅ Mock: Crystal found by ID:', id)
    return { id, ...crystal }
  }

  // Database stats for testing
  static getStats() {
    return {
      users: mockDatabase.users.size,
      emailSubscribers: mockDatabase.emailSubscribers.size,
      discountCodes: mockDatabase.discountCodes.size,
      emailLogs: mockDatabase.emailLogs.size,
      analytics: mockDatabase.analytics.size,
      crystals: mockDatabase.crystals.size,
    }
  }
}

// Export FirestoreService
export default FirestoreService
