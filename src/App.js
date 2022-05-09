import './App.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AddCustomerForm from './components/form/AddCustomerForm';

const SERVER = process.env.REACT_APP_SERVER;
const initialState = [{ value: { name: 'Ayrat' }, id: '12345' }, { value: { name: 'max' }, id: '54321' }, { value: { name: 'chris' }, id: '66667' }]

function App() {

  const [barList, setBarList] = useState([]);
  const [tableList, setTableList] = useState(initialState);

  async function fetchList(area = 'all') {
    if (area === 'bar' || area === 'all') {
      let response = await axios.get(`${SERVER}/getlist`, { params: { area: 'bar' } });
      setBarList(response.data);
    }
    if (area === 'table' || area === 'all') {
      let response = await axios.get(`${SERVER}/getlist`, { params: { area: 'table' } });
      setTableList(response.data);
    }
  }

  async function deleteCustomer(area, id) {
    try {
      await axios.delete(`${SERVER}/delete/${id}/${area}`)
      fetchList(area);
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    console.log('ran use effect');
    // fetchList();
  }, [])

  function handleDragStart(e) {
    e.dataTransfer.setData(e.target.id, e.target.id);
    setTimeout(() => {
      e.target.style.backgroundColor = 'black';
    }, 0)
  }

  function handleDragEnd(e) {

  }

  function handleDragEnter(e) {
    console.log('drag entered');

  }


  function handleDragOver() {
    console.log('dragged over');

  }

  return (
    <>
      <AddCustomerForm fetchList={fetchList} />
      <section className='container'>
        <div className='sub-container'
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
        >
          {barList.map((customer, idx) => {
            return (
              <p
                key={customer.id}
                id={customer.id}
                className='draggable'
                draggable='true'
              >
                {customer.value.name}
                <button className='delete-btn' onClick={() => deleteCustomer('bar', customer.id)}>X</button>
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
                draggable='true'
                onDragStart={(e) => { handleDragStart(e) }}
                onDragEnd={handleDragEnd}
                onDragEnter={(e) => {
                  console.log(e.dataTransfer.types)
                  if (e.dataTransfer.types[0] !== customer.id) {
                    e.target.classList.add('blue');
                    setTableList((oldList) => {

                      let res = JSON.parse(JSON.stringify(oldList));
                      console.log(e.dataTransfer.types[0]);
                      let removed = res.splice(Number(e.dataTransfer.types[0]), 1);
                      console.log('removed:', removed)
                      res.splice(idx, 0, removed[0])
                      // console.log('resultee', res)
                      return res
                    })
                  }
                }}
                onDragLeave={(e) => {
                  console.log('exited drop zone')
                  e.target.classList.remove('blue')
                }}
              >
                {customer.value.name}
                <button className='delete-btn' onClick={() => deleteCustomer('table', customer.id)}>X</button>
              </p>
            )
          })}
        </div>
      </section>
    </>
  );
}

export default App;
