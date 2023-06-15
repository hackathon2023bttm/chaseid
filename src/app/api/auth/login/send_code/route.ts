import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../lib/models/User'
import twilio from 'twilio'

const accountSid = "AC7f76f6cad0f0ef0ca56e85b34df34135";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAd576de9b1fc25512bdb0b184b4014557";
const client = twilio(accountSid, authToken);

// POST /api/auth/login/send_code
// { "email": <> }
export async function POST(request: NextRequest) {

  try {
    await dbConnect()
    const json = await request.json()
    const email = json.email
    console.log('looking up user', email)
    const user = await User.findOne({ primaryEmail: email })
    if (!user) {
      return NextResponse.json({ error: 'not_found' }, { status: 404})
    }

  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: "+" + user.primaryPhone, channel: "sms" })

    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
