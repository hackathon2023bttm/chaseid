import TextInput from "./TextInput"

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
    <form className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-2">
      <div>
      <div className="block text-sm font-medium leading-6 text-gray-900">
      <label htmlFor="dba_name">Doing Business As Name</label>
      </div>
      <div >
        <TextInput onChange={createOnChange('dba_name')} value={profile.dba_name} id="dba_name" name="dba_name" type="text" placeholder="Doing Business As Name" />
      </div>
      </div>
      <div className="block text-sm font-medium leading-6 text-gray-900">

      <label htmlFor="description">Business Description</label>
      <TextInput onChange={createOnChange('description')} value={profile.description} id="description" name="description" type="text" placeholder="Description" />
      </div>

      <div className="block text-sm font-medium leading-6 text-gray-900">

      <label htmlFor="naics">NAICS Code</label>
      <TextInput onChange={createOnChange('naics')} value={profile.naics} id="naics" name="naics" type="text" placeholder="111000" />
      </div>
    </form>
  )
}