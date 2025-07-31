import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { EmailAutomationService } from './email-automation'

export const authOptions: NextAuthOptions = {
  // Remove adapter to use JWT strategy instead of database sessions
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user is new (first time signing in)
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          // If new user, send welcome email
          if (!existingUser) {
            const firstName = user.name?.split(' ')[0] || 'Crystal Enthusiast';
            const discountCode = EmailAutomationService.generateDiscountCode('WELCOME');

            await EmailAutomationService.sendWelcomeEmail({
              firstName,
              email: user.email,
              discountCode,
            });

            console.log('✅ Welcome email sent to new Google user:', user.email);
          }
        } catch (error) {
          console.error('❌ Failed to send welcome email for Google user:', error);
          // Don't block sign in if email fails
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}

declare module 'next-auth' {
  interface User {
    firstName?: string | null
    lastName?: string | null
    role?: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      firstName?: string | null
      lastName?: string | null
      image?: string | null
      role?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    firstName?: string | null
    lastName?: string | null
    role?: string | null
  }
}

// Admin authorization functions
export const ADMIN_EMAILS = [
  'dhruvaparik@gmail.com',
  'kryptomerch.io@gmail.com'
];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true }
    });

    return user ? (user.role === 'ADMIN' || isAdminEmail(user.email)) : false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function requireAdmin(userId?: string): Promise<boolean> {
  if (!userId) return false;
  return await isUserAdmin(userId);
}
