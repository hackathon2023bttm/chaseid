import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import CreditProfile from '../../../lib/models/CreditProfile'

export async function GET(request: NextRequest,
  { params } : { params: { creditProfileId : string }}) {

  await dbConnect()

  try {
    const profile = await CreditProfile.findById(params.creditProfileId)
    if (!profile) {
      return NextResponse.json({ error: 'not_found' }, { status: 404})
    }
    return NextResponse.json(profile)
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
