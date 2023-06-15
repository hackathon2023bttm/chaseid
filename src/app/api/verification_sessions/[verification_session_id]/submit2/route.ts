import dbConnect from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import VerificationSession from '@/app/lib/models/VerificationSession'
// import { pick } from 'lodash';

// const port = process.env.PORT || 3000
// const base = process.env.NODE_ENV === 'development' ? ('http://localhost:' + port) : 'https://chaseid.fly.dev'

export async function POST(request: NextRequest, { params }: { params: { verification_session_id: string } }) {

  await dbConnect()

  try {
    const verificationSession = await VerificationSession.findById(params.verification_session_id);
    if (!verificationSession) {
      return NextResponse.json({ error: 'session_not_found'}, {status: 404})
    }

    const json = await request.json();
    if (json['credit_profile']) {
      console.log('credit profile', json['credit_profile'])
    }

    return NextResponse.json({ status: 'success' })
  } catch (e) {
    console.error('Failed to create verification session', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
