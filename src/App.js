import './App.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AddCustomerForm from './components/form/AddCustomerForm';

const SERVER = process.env.REACT_APP_SERVER;
// const initialState = [{ value: { name: 'Ayrat' }, id: '12345' }, { value: { name: 'max' }, id: '54321' }, { value: { name: 'chris' }, id: '66667' }]

function App() {

  const [barList, setBarList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [draggedParent, setDraggedParent] = useState('');

  useEffect(() => {
    console.log('ran use effect');
    fetchList();
  }, [])

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


  function handleDragStart(e) {
    e.dataTransfer.setData(e.target.id, e.target.id);
    setDraggedParent(e.target.parentNode.id);
    setTimeout(() => {
      e.target.style.backgroundColor = 'black';
    }, 0)
  }

  function handleDragEnd(e) {
    e.target.style.backgroundColor = 'white';
  }

  function handleDragEnter(e, customer, idx, callback) {
    console.log('calling handleDragEnter')
    let draggedID = e.dataTransfer.types[0];
    if (draggedID !== customer.id) {
      callback((oldList) => {
        let res = JSON.parse(JSON.stringify(oldList))
        let sourceIndex = res.findIndex(el => el.id === draggedID);
        let removed = res.splice(sourceIndex, 1);
        res.splice(idx, 0, removed[0])
        return res
      })
    }
  }

  function handleDragLeave(e) {
    console.log('exited drop zone')
    e.target.classList.remove('blue')
  }

  function handleBucketEnter(e) {
    console.log('calling handleBucketEnter')
    if(draggedParent !== e.target.id){
    }
  }

  return (
    <>
      <AddCustomerForm fetchList={fetchList} />
      <section className='container'>
        <div className='sub-container'
          id='bucket1'
          onDragOver={handleBucketEnter}>
          {barList.map((customer, idx) => {
            return (
              <p
                key={customer.id}
                id={customer.id}
                className='draggable'
                draggable='true'
                onDragStart={(e) => { handleDragStart(e) }}
                onDragEnd={handleDragEnd}
                onDragEnter={(e) => { handleDragEnter(e, customer, idx, setBarList) }}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => { e.preventDefault() }}
              >
                {customer.value.name}
                <button className='delete-btn' onClick={() => deleteCustomer('bar', customer.id)}>X</button>
              </p>
            )
          })}
        </div>
        <div className='sub-container'
          id='bucket2'
          onDragOver={handleBucketEnter}
        >
          {tableList.map((customer, idx) => {
            return (
              <p
                key={customer.id}
                id={customer.id}
                className='draggable'
                draggable='true'
                onDragStart={(e) => { handleDragStart(e) }}
                onDragEnd={handleDragEnd}
                onDragEnter={(e) => { handleDragEnter(e, customer, idx, setTableList) }}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => { e.preventDefault() }}
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
