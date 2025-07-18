import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get user's addresses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Addresses fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !address1 || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Required fields: firstName, lastName, address1, city, state, zipCode' },
        { status: 400 }
      )
    }

    // If setting as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          isDefault: true 
        },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        zipCode,
        country: country || 'US',
        phone,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({
      message: 'Address created successfully',
      address
    })
  } catch (error) {
    console.error('Address creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update address
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      id,
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // If setting as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault
      }
    })

    return NextResponse.json({
      message: 'Address updated successfully',
      address: updatedAddress
    })
  } catch (error) {
    console.error('Address update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete address
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Check if address is used in any orders
    const ordersWithAddress = await prisma.order.count({
      where: { shippingAddressId: addressId }
    })

    if (ordersWithAddress > 0) {
      return NextResponse.json(
        { error: 'Cannot delete address that has been used in orders' },
        { status: 400 }
      )
    }

    await prisma.address.delete({
      where: { id: addressId }
    })

    return NextResponse.json({
      message: 'Address deleted successfully'
    })
  } catch (error) {
    console.error('Address deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
