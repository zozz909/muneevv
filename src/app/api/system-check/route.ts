import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        host: process.env.DB_HOST ? '✅ Configured' : '❌ Missing',
        user: process.env.DB_USER ? '✅ Configured' : '❌ Missing',
        name: process.env.DB_NAME ? '✅ Configured' : '❌ Missing',
      },
      blob_storage: {
        token: process.env.BLOB_READ_WRITE_TOKEN ? '✅ Configured' : '❌ Missing',
        package: checkPackage('@vercel/blob'),
      },
      auth: {
        jwt_secret: process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing',
        admin_username: process.env.ADMIN_USERNAME ? '✅ Configured' : '❌ Missing',
        admin_password: process.env.ADMIN_PASSWORD ? '✅ Configured' : '❌ Missing',
      },
      upload: {
        max_size: process.env.UPLOAD_MAX_SIZE || '10485760',
        allowed_types: process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
      },
      apis: {
        upload_local: '✅ Available',
        upload_vercel: process.env.BLOB_READ_WRITE_TOKEN ? '✅ Available' : '⚠️ Token missing',
        upload_base64: '✅ Available',
      }
    };

    // تحديد حالة النظام العامة
    const isProduction = process.env.NODE_ENV === 'production';
    const hasDatabase = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;
    const hasAuth = process.env.JWT_SECRET && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD;
    const hasBlob = process.env.BLOB_READ_WRITE_TOKEN;

    let systemStatus = '✅ Healthy';
    let recommendations = [];

    if (!hasDatabase) {
      systemStatus = '❌ Critical Issues';
      recommendations.push('Configure database environment variables');
    }

    if (!hasAuth) {
      systemStatus = '❌ Critical Issues';
      recommendations.push('Configure authentication environment variables');
    }

    if (isProduction && !hasBlob) {
      systemStatus = '⚠️ Warnings';
      recommendations.push('Configure BLOB_READ_WRITE_TOKEN for image uploads in production');
    }

    return NextResponse.json({
      status: systemStatus,
      environment: process.env.NODE_ENV || 'development',
      checks,
      recommendations,
      deployment_info: {
        platform: isProduction ? 'Vercel Production' : 'Local Development',
        upload_method: isProduction ? (hasBlob ? 'Vercel Blob' : 'Base64 Fallback') : 'Local Folders',
        database_connection: hasDatabase ? 'Configured' : 'Missing Configuration',
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: '❌ Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

function checkPackage(packageName: string): string {
  try {
    require.resolve(packageName);
    return '✅ Installed';
  } catch {
    return '❌ Not installed';
  }
}
