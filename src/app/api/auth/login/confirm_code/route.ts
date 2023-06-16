import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../lib/models/User'
import twilio from 'twilio'

const accountSid = "AC7f76f6cad0f0ef0ca56e85b34df34135";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAd576de9b1fc25512bdb0b184b4014557";

// POST /api/auth/login/confirm_code
// { "user_id": <>, "code": <> }
export async function POST(request: NextRequest) {
  const client = twilio(accountSid, authToken);

  try {
    await dbConnect()
    const json = await request.json()
    const code = json.code;
    const userId = json.user_id;

    console.log('confirming', code, userId)

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'not_found' }, { status: 404})
    }

    /*
    {
      sid: 'VE5940f02c4e86b68c8a7d0b745e712208',
      serviceSid: 'VAd576de9b1fc25512bdb0b184b4014557',
      accountSid: 'AC7f76f6cad0f0ef0ca56e85b34df34135',
      to: '+16502691935',
      channel: 'sms',
      status: 'approved',
      valid: true,
      amount: null,
      payee: null,
      dateCreated: 2023-06-15T23:02:36.000Z,
      dateUpdated: 2023-06-15T23:02:46.000Z,
      snaAttemptsErrorCodes: undefined
    }
    */

    const verification_check = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+" + user.primaryPhone, code: code })
        // .then((verification_check) => console.log(verification_check))
    console.log('user', userId, 'verification_check', verification_check)
    if (!verification_check.valid) {
      return NextResponse.json({ error: 'failed_verification' }, { status: 400 })
    }

    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
