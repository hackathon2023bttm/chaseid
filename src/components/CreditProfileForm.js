import TextInput from "./TextInput"

export default function CreditProfileForm(props) {
  const profile = props.creditProfile || {}

  return (
    <form>
      <div>
        <label htmlFor="employer">Employer</label>
      </div>
      <div>
        <TextInput
        value={profile.employer || ''}
        onChange={e => {
          const newProfile = Object.assign({}, profile, {
            employer: e.target.value
          })
          props.onChange && props.onChange(newProfile)
        }}
         type="text" id="employer" placeholder="Employer" name="employer" />
      </div>
      <div>
        <label htmlFor="annual_income_amount">Annual Income</label>
      </div>
      <div>
      <TextInput 
        value={profile.annual_income_amount || ''}
        onChange={e => {
        const newProfile = Object.assign({}, profile, {
          annual_income_amount: e.target.value
        })
        props.onChange && props.onChange(newProfile)
      }}
      name="annual_income_amount" id="annual_income_amount" placeholder="Annual Income" />
      </div>
    </form>
  )
}
