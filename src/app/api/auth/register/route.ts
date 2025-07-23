import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { EmailAutomationService } from '@/lib/email-automation'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, birthDate } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Email, password, and first name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName || '',
        birthDate: birthDate ? new Date(birthDate) : undefined,
        role: 'USER',
        emailVerified: null
      }
    })

    // Add to email subscribers
    try {
      await FirestoreService.createEmailSubscriber({
        email,
        firstName,
        lastName: lastName || '',
        source: 'registration',
      })
    } catch (error) {
      // Email subscriber might already exist, that's okay
      console.log('Email subscriber already exists or failed to create:', error)
    }

    // Send welcome email with discount code
    try {
      const discountCode = EmailAutomationService.generateDiscountCode('WELCOME');
      await EmailAutomationService.sendWelcomeEmail({
        firstName,
        email,
        discountCode,
      })
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      message: 'User created successfully',
      user,
    })
  } catch (error) {
    console.error('Registration error:', error)

    // Return more specific error information in development
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        error: 'Registration failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
