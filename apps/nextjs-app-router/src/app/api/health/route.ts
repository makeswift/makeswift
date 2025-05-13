import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Next.js App Router
 * Used by test infrastructure to verify server readiness
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      framework: 'nextjs',
      timestamp: new Date().toISOString() 
    },
    { status: 200 }
  )
}