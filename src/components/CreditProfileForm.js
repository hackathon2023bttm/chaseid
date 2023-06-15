export default function CreditProfileForm(props) {
  const profile = props.creditProfile
  return (
    <form>
      <div><label htmlFor="employer">Employer</label></div>
      <div><input type="text" placeholder="Employer" name="employer" /></div>
    </form>
  )
}
