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
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
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
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      }
    })

    // Add to email subscribers
    try {
      await prisma.emailSubscriber.create({
        data: {
          email,
          firstName,
          lastName,
          source: 'registration',
        }
      })
    } catch (error) {
      // Email subscriber might already exist, that's okay
      console.log('Email subscriber already exists or failed to create:', error)
    }

    // Send welcome email
    try {
      await EmailAutomationService.sendWelcomeEmail({
        firstName,
        email,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
