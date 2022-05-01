import './App.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AddCustomerForm from './components/form/AddCustomerForm';

const SERVER = process.env.REACT_APP_SERVER;

function App() {

  const [list, setList] = useState([]);

  async function fetchList() {
    let response = await axios.get(`${SERVER}/getlist`);
    setList(response.data)
  }

  async function deleteCustomer(id){
    try{
      await axios.delete(`${SERVER}/delete/${id}`)
      fetchList();
    } catch(e){
      console.log(e.message)
    }    
  }

  useEffect(() => {
    console.log('ran use effect');
    fetchList();
  }, [])

  return (
    <>
      <div className='container'>
        {list.map((customer, idx) => {
          return (
              <p key={customer.id} id={customer.id} className='draggable' draggable='true'>{customer.value.name}<button className='delete-btn' onClick={()=> deleteCustomer(customer.id)}>X</button></p>
          )
        })}
      </div>
      <AddCustomerForm fetchList={fetchList} />
    </>
  );
}

export default App;
