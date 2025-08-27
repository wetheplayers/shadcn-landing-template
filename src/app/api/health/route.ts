import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring and Docker health checks
 */
export function GET(): NextResponse {
  try {
    // You can add additional health checks here
    // For example: database connectivity, external service availability, etc.
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env['NEXT_PUBLIC_APP_VERSION'] || '0.1.0',
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
