import { NextRequest, NextResponse } from 'next/server';
import { testFirebaseConnection, isFirebaseConfigured } from '@/lib/firebase-config';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase connection...');
    
    // Check configuration first
    const configCheck = isFirebaseConfigured();
    
    if (!configCheck.isConfigured) {
      return NextResponse.json({
        success: false,
        error: 'Firebase not configured',
        details: {
          message: 'Missing required Firebase environment variables',
          missingKeys: configCheck.missingKeys,
          configuredKeys: configCheck.configuredKeys,
          requiredKeys: [
            'NEXT_PUBLIC_FIREBASE_API_KEY',
            'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
            'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
            'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
            'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
            'NEXT_PUBLIC_FIREBASE_APP_ID'
          ]
        }
      }, { status: 500 });
    }

    // Test the connection
    const connectionTest = await testFirebaseConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Firebase connection test failed',
        details: connectionTest.details || connectionTest.error,
        configuration: {
          isConfigured: true,
          missingKeys: [],
          configuredKeys: configCheck.configuredKeys
        }
      }, { status: 500 });
    }

    // If we get here, Firebase is working
    return NextResponse.json({
      success: true,
      message: 'Firebase is working correctly!',
      services: connectionTest.services,
      projectId: connectionTest.projectId,
      configuration: {
        isConfigured: true,
        allKeysPresent: true,
        configuredKeys: configCheck.configuredKeys
      },
      currentStatus: {
        usingMockService: false,
        realFirebaseConnected: true
      }
    });

  } catch (error) {
    console.error('Firebase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Firebase test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      configuration: isFirebaseConfigured(),
      currentStatus: {
        usingMockService: true,
        realFirebaseConnected: false
      }
    }, { status: 500 });
  }
}
