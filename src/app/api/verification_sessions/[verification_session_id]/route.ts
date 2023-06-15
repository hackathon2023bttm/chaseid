import dbConnect from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import VerificationSession from '@/app/lib/models/VerificationSession'

const port = process.env.PORT || 3000
const base = process.env.NODE_ENV === 'development' ? ('http://localhost:' + port) : 'https://chaseid.fly.dev'

export async function GET(request: NextRequest, {params}: {params: { verification_session_id: string }}) {

  await dbConnect()

  try {
    const vs = await VerificationSession.findById(params.verification_session_id)
    const verificationSessionUrl = base + '/verify/' + vs._id

    const response = Object.assign({}, {
      verification_session_url: verificationSessionUrl,
    }, vs.toObject());

    return NextResponse.json(response)
  } catch (e) {
    console.error('Failed to create verification session', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
