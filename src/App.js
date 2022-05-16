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
        // { value: { name: 'max' }, id: '54321' },
        // { value: { name: 'chris' }, id: '66667' }
      ]
  },
  {
    title: 'table',
    customers:
      [
        { value: { name: 'Sam' }, id: '123' },
        { value: { name: 'Ed' }, id: '543' },
        { value: { name: 'Jen' }, id: '666' },
        { value: { name: 'chris' }, id: '66667' }]
  }
]

function App() {
  const [queue, setQueue] = useState(initialState);
  const [draggedItem, setDraggedItem] = useState('');
  const [dragging, setDragging] = useState(false);

  const draggedElement = useRef();
  const draggedIdx = useRef();
  const sourceAreaIdx = useRef();
  const currentDragIdx = useRef();
  const targetAreaIdx = useRef();

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
    let draggedItem = queue[areaIdx].customers[custIdx];
    draggedElement.current = e.target;
    draggedIdx.current = { areaIdx, custIdx };
    setDraggedItem(draggedItem);
    sourceAreaIdx.current = areaIdx;
    currentDragIdx.current = custIdx;
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

  function handleDragOver(e, areaIdx) {
    e.preventDefault();
    targetAreaIdx.current = (areaIdx);
    const draggableElements = [...document.querySelector(`.${queue[areaIdx].title}-elements`).querySelectorAll('.draggable:not(.blackened)')]
    const newAfterDragElement = draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
    const afterId = newAfterDragElement && newAfterDragElement.id;

    setQueue(queue => {
      console.log('ran setQueue')
      let copyQueue = JSON.parse(JSON.stringify(queue));
      let removed = copyQueue[sourceAreaIdx.current].customers.splice(currentDragIdx.current, 1)[0];
      if (!afterId) {
        copyQueue[targetAreaIdx.current].customers.push(removed);
        setTimeout(() => {
          currentDragIdx.current = copyQueue[targetAreaIdx.current].customers.length - 1;
        }, 0)
      } else {
        let targetCustIdx = copyQueue[targetAreaIdx.current].customers.findIndex((person) => afterId === person.id);
        copyQueue[targetAreaIdx.current].customers.splice(targetCustIdx, 0, removed);
        setTimeout(() => {
          currentDragIdx.current = targetCustIdx;
        }, 0);
      }
      return copyQueue;
    })
    setTimeout(() => {
      sourceAreaIdx.current = areaIdx;
    }, 0);

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
            // onDragEnter={area.customers.length ? undefined : () => { handleDragEnter(areaIdx, 0) }}
            onDragOver={e => { handleDragOver(e, areaIdx) }}
            onDragEnter={(e) => { e.preventDefault() }}
          >
            <div className='title'>
              {area.title}
            </div>
            <div className={`${area.title}-elements`}>
              {area.customers.map((customer, custIdx) =>
                <p
                  key={customer.id}
                  id={customer.id}
                  className={dragging ? getStyle(customer.id) : 'draggable'}
                  draggable='true'
                  onDragStart={(e) => { handleDragStart(e, areaIdx, custIdx) }}
                // onDragEnter={(e) => {
                //   if (customer.id !== draggedItem.id) handleDragEnter(areaIdx, custIdx)
                // }}
                // onDragLeave={handleDragLeave}
                // onDragOver={(e) => { e.preventDefault() }}
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
