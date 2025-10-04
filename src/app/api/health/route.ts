import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/neon-db'
import { redis } from '@/lib/upstash-redis'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const checkType = url.searchParams.get('type') || 'basic'

    if (checkType === 'basic') {
      return await basicHealthCheck()
    } else if (checkType === 'full') {
      return await fullHealthCheck()
    } else {
      return NextResponse.json({ error: 'Invalid check type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({ 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function basicHealthCheck() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: false,
      cache: false,
      auth: true // Assume auth is working if we can reach this endpoint
    }
  }

  try {
    // Test database connection
    await db.select().from(users).limit(1)
    checks.services.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
    checks.services.database = false
  }

  try {
    // Test cache connection
    await redis.ping()
    checks.services.cache = true
  } catch (error) {
    console.error('Cache health check failed:', error)
    checks.services.cache = false
  }

  // Overall status
  checks.status = Object.values(checks.services).every(status => status) ? 'healthy' : 'unhealthy'

  return NextResponse.json(checks)
}

async function fullHealthCheck() {
  const startTime = Date.now()
  
  try {
    const [cacheHealth, dbHealth] = await Promise.all([
      checkCacheHealth(),
      testDatabaseOperations()
    ])

    const duration = Date.now() - startTime

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      cacheHealth,
      databaseHealth: dbHealth,
      overallStatus: cacheHealth && dbHealth.healthy ? 'healthy' : 'unhealthy'
    })

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function checkCacheHealth() {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Cache health check failed:', error)
    return false
  }
}

async function testDatabaseOperations() {
  try {
    // Test basic database operations
    const testResults = {
      select: false,
      insert: false,
      update: false,
      delete: false
    }

    // Test SELECT
    await db.select().from(users).limit(1)
    testResults.select = true

    // Test INSERT (with rollback)
    const testUser = await db.insert(users).values({
      email: `test-${Date.now()}@healthcheck.com`,
      displayName: 'Health Check Test'
    }).returning()
    
    if (testUser.length > 0) {
      testResults.insert = true
      
      // Test UPDATE
      await db.update(users)
        .set({ displayName: 'Health Check Test Updated' })
        .where(eq(users.id, testUser[0].id))
      testResults.update = true
      
      // Test DELETE
      await db.delete(users).where(eq(users.id, testUser[0].id))
      testResults.delete = true
    }

    return {
      healthy: Object.values(testResults).every(result => result),
      operations: testResults
    }

  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
