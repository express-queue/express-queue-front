import './App.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AddCustomerForm from './components/form/AddCustomerForm';

const SERVER = process.env.REACT_APP_SERVER;

function App() {

  const [barList, setBarList] = useState([]);
  const [tableList, setTableList] = useState([]);

  async function fetchList() {
    let response = await axios.get(`${SERVER}/getlist`);
    setBarList(response.data)
  }

  async function deleteCustomer(id) {
    try {
      await axios.delete(`${SERVER}/delete/${id}`)
      fetchList();
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    console.log('ran use effect');
    fetchList();
  }, [])

  return (
    <>
      <AddCustomerForm fetchList={fetchList} />
      <section className='container'>
        <div className='sub-container'>
          {barList.map((customer, idx) => {
            return (
              <p
                key={customer.id}
                id={customer.id}
                className='draggable'
                draggable='true'>
                {customer.value.name}
                <button className='delete-btn' onClick={() => deleteCustomer(customer.id)}>X</button>
              </p>
            )
          })}
        </div>
        <div className='sub-container'>
          {tableList.map((customer, idx) => {
            return (
              <p
                key={customer.id}
                id={customer.id}
                className='draggable'
                draggable='true'>
                {customer.value.name}
                <button className='delete-btn' onClick={() => deleteCustomer(customer.id)}>X</button>
              </p>
            )
          })}
        </div>
      </section>
    </>
  );
}

export default App;
