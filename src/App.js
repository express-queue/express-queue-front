import './App.scss';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import AddCustomerForm from './components/form/AddCustomerForm';

const SERVER = process.env.REACT_APP_SERVER;
const initialState = [
  {
    title: 'bar',
    customers:
      [
        { value: { name: 'Ayrat' }, id: '12345' },
        { value: { name: 'max' }, id: '54321' },
        { value: { name: 'chris' }, id: '66667' }
      ]
  },
  {
    title: 'table',
    customers:
      [
        { value: { name: 'Sam' }, id: '123' },
        { value: { name: 'Ed' }, id: '543' },
        { value: { name: 'Jen' }, id: '666' }]
  }
]

function App() {
  const [queue, setQueue] = useState(initialState);
  const [draggedItem, setDraggedItem] = useState('');
  const [sourceAreaIdx, setSourceAreaIdx] = useState('');
  const [dragging, setDragging] = useState(false);

  const draggedElement = useRef();

  // useEffect(() => {
  //   console.log('ran use effect');
  //   fetchList();
  // }, [])

  async function fetchList(area = 'all') {
    if (area === 'bar' || area === 'all') {
      let response = await axios.get(`${SERVER}/getlist`, { params: { area: 'bar' } });
      // setBarList(response.data);
    }
    if (area === 'table' || area === 'all') {
      let response = await axios.get(`${SERVER}/getlist`, { params: { area: 'table' } });
      // setTableList(response.data);
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


  function handleDragStart(e, areaIdx, custIdx) {
    // e.dataTransfer.setData(e.target.id, e.target.id);
    let draggedItem = queue[areaIdx].customers[custIdx];
    draggedElement.current = e.target;
    setDraggedItem(draggedItem);
    setSourceAreaIdx(areaIdx);
    setTimeout(() => {
      setDragging(true)
    }, 0)
    draggedElement.current.addEventListener('dragend', handleDragEnd)
  }

  function handleDragEnd(e) {
    setDragging(false);
    draggedElement.current.removeEventListener('dragend', handleDragEnd)
    draggedElement.current = null;
  }

  function handleDragEnter(areaIdx, custIdx) {
    setQueue((oldList) => {
      let list = JSON.parse(JSON.stringify(oldList));
      if (!list[areaIdx].customers.length || draggedItem.id !== list[areaIdx].customers[custIdx].id) {
        let sourceIdx = list[sourceAreaIdx].customers.findIndex((person) => draggedItem.id === person.id)
        let removed = list[sourceAreaIdx].customers.splice(sourceIdx, 1);
        list[areaIdx].customers.splice(custIdx, 0, removed[0]);
        setSourceAreaIdx(areaIdx);
      }
      return list
    })
  }

  function handleDragLeave(e) {
    e.target.classList.remove('blue')
  }

  function getStyle(customerId) {
    if (draggedItem.id === customerId) {
      return 'blackened draggable'
    }
    return 'draggable'
  }

  return (
    <>
      <AddCustomerForm fetchList={fetchList} />
      <section className='container'>
        {queue.map((area, areaIdx) =>
          <div className='sub-container'
            key={areaIdx}
            onDragEnter={area.customers.length ? undefined : () => { handleDragEnter(areaIdx, 0) }}>
            <div className='title'>
              {area.title}
            </div>
            <div className='elements'>
              {area.customers.map((customer, custIdx) =>
                <p
                  key={customer.id}
                  id={customer.id}
                  className={dragging ? getStyle(customer.id) : 'draggable'}
                  draggable='true'
                  onDragStart={(e) => { handleDragStart(e, areaIdx, custIdx) }}
                  onDragEnter={(e) => {
                    if (customer.id !== draggedItem.id) handleDragEnter(areaIdx, custIdx)
                  }}
                  onDragLeave={handleDragLeave}
                  onDragOver={(e) => { e.preventDefault() }}
                >
                  {customer.value.name}
                  <button className='delete-btn' onClick={() => deleteCustomer('bar', customer.id)}>X</button>
                </p>
              )}
            </div>
          </div>
        )}
        {/*  <div className='sub-container'
          id='bar'>
          {barList.map((customer, idx) => {
            return (
              <p
                key={customer.id}
                id={customer.id}
                className='draggable'
                draggable='true'
                onDragStart={(e) => { handleDragStart(e) }}
                onDragEnd={handleDragEnd}
                onDragEnter={(e) => {
                  if (customer.id !== draggedItem.id) handleDragEnter(e, customer, idx, setBarList)
                }}
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
          id='table'>
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
                  if (customer.id !== draggedItem.id) handleDragEnter(e, customer, idx, setTableList)
                }}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => { e.preventDefault() }}
              >
                {customer.value.name}
                <button className='delete-btn' onClick={() => deleteCustomer('table', customer.id)}>X</button>
              </p>
            )
          })}
        </div> */}
      </section>
    </>
  );
}

export default App;
