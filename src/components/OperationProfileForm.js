export default function OperationProfileForm(props) {
  const profile = props.profile || {}
  const onChange = props.onChange || (() => {})
  const createOnChange = (fieldName) => (event) => {
    const value = event.target.value
    const newProfile = Object.assign({}, profile, {
      [fieldName]: value
    })
    onChange(newProfile)
  }
  return (
    <form>
      <div>
      <div>
      <label htmlFor="dba_name">Doing Business As Name</label>
      </div>
      <div>
        <input onChange={createOnChange('dba_name')} value={profile.dba_name} id="dba_name" name="dba_name" type="text" placeholder="Doing Business As Name" />
      </div>
      </div>
      <div>

      <label htmlFor="description">Business Description</label>
      <input onChange={createOnChange('description')} value={profile.description} id="description" name="description" type="text" placeholder="Description" />
      </div>

      <div>

      <label htmlFor="naics">NAICS Code</label>
      <input onChange={createOnChange('naics')} value={profile.naics} id="naics" name="naics" type="text" placeholder="111000" />
      </div>
    </form>
  )
}