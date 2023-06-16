import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import OperationProfileForm from '../../../components/OperationProfileForm';
import CreditProfileForm from '../../../components/CreditProfileForm';
import { redirect } from 'next/navigation'
import { RedirectType } from 'next/dist/client/components/redirect';

function EmailLogin(props) {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false);
  const [user, setUser] = useState(null)
  const [code, setCode] = useState('');
  const [codeConfirmed, setCodeConfirmed] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch("/api/auth/login/send_code", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { 'content-type': 'application/json' }
    })
    const user = await resp.json()
    setUser(user);
    setCodeSent(true);
    console.log(user);
  }

  const onConfirmCode = async (code) => {
    const resp = await fetch("/api/auth/login/confirm_code", {
      method: "POST",
      body: JSON.stringify({ user_id: user['_id'], code: code }),
      headers: { 'content-type': 'application/json' }
    })
    if (resp.status <= 300) {
      setCodeConfirmed(true);
      props.onConfirmUser && props.onConfirmUser(user);
    } else {
      console.log('confirm error', resp.status, resp.body);
    }
  }

  const codeForm = () => (
    <div className="fixed bg-white border p-4 rounded">
          <div>
          <label htmlFor="code">Confirm it's you</label>
          </div>

          <input type="text" 
          value={code}
          onChange={e => {
            e.preventDefault()
            const newCode = e.target.value
            console.log('code changed', newCode)
            if (newCode.length > 6) {
              return;
            }

            setCode(newCode)
            if (newCode.length === 6) {
              onConfirmCode(newCode)
            }
          }}
          name="code"
          placeholder='000000'
          className="text-3xl w-36 text-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
  )

  return (
    <>
      <div className="m-2">
        { codeSent && !codeConfirmed && codeForm() }
      <form onSubmit={onSubmit}>
        <div>
        <label htmlFor="email">Email</label>
        </div>
        <div>

        <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         name="email" type="email" placeholder="Email" 
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        <div className="mt-2">
        <input type="submit" disabled={!!codeConfirmed} className={(codeConfirmed ? 'opacity-30 ' : '') + "  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} value="Log In with Chase ID" />
        </div>
      </form>
      </div>
    </>
  )
}

export default function Session() {
  const [ loading, setLoading ] = useState(true);
  const [ verificationSession, setVerificationSession ] = useState(null);
  const [ user, setUser] = useState(null);
  const [creditProfile, setCreditProfile] = useState({
    annual_income_currency: 'USD',
    annual_income_amount: 0,
    employer: '',
  })
  const [operationProfile, setOperationProfile] = useState({
    dba_name: '',
    description: '',
    naics: '',
  })

  const router = useRouter()

  useEffect(() => {
    console.log('useeffect', router.query.session_id)
    if (!router.query.session_id) {
      return
    }
    fetch("/api/verification_sessions/" + router.query.session_id)
      .then((resp) => resp.json())
      .then((vs) => {
        console.log('gotvs', vs)
        setVerificationSession(vs)
        setLoading(false);
      })
      .catch(console.error)
  }, [router])

  const onSubmitForm = async (event) => {
    event.preventDefault()
    console.log('submitted')
    const submitData = {
      user_id: user && user._id,
      profiles: verificationSession.profiles,
    }
    if (verificationSession.profiles.includes('credit_profile')) {
      submitData['credit_profile'] = creditProfile
    }
    if (verificationSession.profiles.includes('operation_profile')) {
      submitData['operation_profile'] = operationProfile
    }
    const resp = await fetch("/api/verification_sessions/" + verificationSession._id + "/submit2", {
      method: "POST",
      body: JSON.stringify(submitData),
    })
    console.log('verified', await resp.json())
    const redirectUrl = verificationSession.flow_redirect_url + "?verification_session_id=" + verificationSession._id
    // redirect(redirectUrl, RedirectType.push)
    console.log('redirecting', redirectUrl)
    document.location = redirectUrl
  }

  return (
    <div>
      <script src="https://cdn.tailwindcss.com"></script>
      <h1>{ router.query.session_id }</h1>

      <EmailLogin onConfirmUser={(user) => {
        console.log('confirmed user', user)
        setUser(user);

        if (user.primaryCreditProfile) {
          fetch("/api/credit_profiles/" + user.primaryCreditProfile)
          .then(r => r.json())
          .then(cp => {
            console.log('got credit profile', cp)
            setCreditProfile(cp)
          })
          .catch(err => console.error(err))
        }

        if (user.primaryOperationProfile) {
          fetch("/api/operation_profiles/" + user.primaryOperationProfile)
          .then(r => r.json())
          .then(prof => {
            console.log('got operation profile', prof)
            setOperationProfile(prof)
          })
          .catch(err => console.error(err))
        }
      }}/>

      {
        !loading && verificationSession.profiles && verificationSession.profiles.some(p => p.type === 'operation_profile') && (
          <OperationProfileForm profile={operationProfile} onChange={(p) => {
            setOperationProfile(p);
            console.log('change profile', p)
          }} />
        )
      }
      {
        !loading && verificationSession.profiles && verificationSession.profiles.some(p => p.type === 'credit_profile') && (
          <CreditProfileForm creditProfile={creditProfile}
          onChange={p => {
            setCreditProfile(p)
            console.log(p)
          }}
           />
        )
      }
      <button onClick={onSubmitForm}>Submit</button>
    </div>
  )
}
