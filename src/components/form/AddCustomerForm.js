import { useState } from "react";
import axios from "axios";

const SERVER = process.env.REACT_APP_SERVER;

export default function AddCustomerForm({ fetchList }) {

  const [name, setName] = useState('');
  const [side, setSide] = useState('bottom');

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleRadioChange(e) {
    setSide(e.target.value);
  }

  async function handleSumbit(e) {
    console.log('trying to submit')
    e.preventDefault();
    let endpoint = side === 'bottom' ? 'add' : 'prepend'
    let data = { value: { name } }

    try {
      console.log('keep trying')
      let response = await axios.post(`${SERVER}/${endpoint}`, data);
      console.log('response', response.data)
      setName('')
      console.log('keep trying 3')
      fetchList();
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <form onSubmit={handleSumbit}>
      <label >First Name</label>
      <input type="text" onChange={handleChange} value={name} />
      <div className="radio-buttons">
        <label>
          <input type="radio" name="side" value="top" onChange={handleRadioChange} />
          Top
        </label>
        <label>
          <input type="radio" name="side" value="bottom" defaultChecked onChange={handleRadioChange} />
          Bottom
        </label>
      </div>
      <input type="submit" />
    </form>
  )
}