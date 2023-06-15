import dbConnect from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import VerificationSession from '@/app/lib/models/VerificationSession'
import { pick } from 'lodash';

const port = process.env.PORT || 3000
const base = process.env.NODE_ENV === 'development' ? ('http://localhost:' + port) : 'https://chaseid.fly.dev'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  // let appId = ""
  // if (authHeader && authHeader) {
  // }

  await dbConnect()

  try {
    const json = await request.json();
    const parsed = pick(json, ['custom_data', 'flow_redirect_url', 'profiles'])
    const verifSession = await VerificationSession.create(parsed)
    const verificationSessionUrl = base + '/verify/' + verifSession._id

    // const custom_data = json.custom_data
    console.log({ json });

    const response = Object.assign({}, {
      verification_session_url: verificationSessionUrl,
    }, verifSession.toObject());

    return NextResponse.json(response)
  } catch (e) {
    console.error('Failed to create verification session', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
