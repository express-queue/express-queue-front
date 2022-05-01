import { useState } from "react";
import axios from "axios";

const SERVER = process.env.REACT_APP_SERVER;

export default function AddCustomerForm({ fetchList }) {

  const [name, setName] = useState('');
  const [area, setArea] = useState('table')
  const [queue, setQueue] = useState('back');

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleAreaChange(e) {
    setArea(e.target.value);
  }

  function handleQueueChange(e) {
    setQueue(e.target.value);
  }


  async function handleSumbit(e) {
    console.log('trying to submit')
    e.preventDefault();
    let endpoint = queue === 'back' ? 'add' : 'prepend';
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
      <div className="container-radios">
        <p className="radio-grp-title">Dining Area</p>
        <div className="radio-buttons">
          <label>
            <input type="radio" name="area" value="bar" onChange={handleAreaChange} />
            Bar
          </label>
          <label>
            <input type="radio" name="area" value="table" defaultChecked onChange={handleAreaChange} />
            Table
          </label>
        </div>
        <p className="radio-grp-title">Queue placement</p>
        <div className="radio-buttons">
          <label>
            <input type="radio" name="queue" value="top" onChange={handleQueueChange} />
            Front
          </label>
          <label>
            <input type="radio" name="queue" value="back" defaultChecked onChange={handleQueueChange} />
            Back
          </label>
        </div>
      </div>
      <input type="submit" />
    </form>
  )
}