import './App.scss';
import axios from 'axios';
import { useState, useRef } from 'react';
import AddCustomerForm from './components/form/AddCustomerForm';

const SERVER = process.env.REACT_APP_SERVER;
const initialState = [
  {
    title: 'patio',
    customers:
      [
        // { value: { name: 'Ayrat' }, id: '12345' },
        // { value: { name: 'max' }, id: '54321' },
        // { value: { name: 'chris' }, id: '66667' }
      ]
  },
  {
    title: 'bar',
    customers:
      [
        // { value: { name: 'Ayrat' }, id: '12345' },
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
  const [currentDragIdx, setCurrDragIdx] = useState('');
  const [sourceAreaIdx, setSourceAreaIdx] = useState('');


  const draggedElement = useRef();

  // useEffect(() => {
  //   console.log('ran use effect');
  //   fetchList();
  // }, [])

/*   async function fetchAll() {
    let response = await axios.get(`${SERVER}/getAll`);
    let queue = response.data;
    setQueue(queue);
  } */

  async function fetchList(area) {
    let response = await axios.get(`${SERVER}/getlist`, { params: { area } })
    let resQueue = response.data;
    setQueue(oldQueue => {
      let copyQ = JSON.parse(JSON.stringify(oldQueue));
      copyQ.forEach(sittingArea => {
        if (sittingArea.title === area) {
          sittingArea.customers = resQueue;
        };
      })
      return copyQ
    });

/*     if (area === 'bar' || area === 'all') {
      let response = await axios.get(`${SERVER}/getlist`, { params: { area: 'bar' } });
      // setBarList(response.data);
    }
    if (area === 'table' || area === 'all') {
      let response = await axios.get(`${SERVER}/getlist`, { params: { area: 'table' } });
      // setTableList(response.data);
    } */
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
    setDraggedItem(draggedItem);
    setSourceAreaIdx(areaIdx);
    setCurrDragIdx(custIdx);
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
      let removed = copyQueue[sourceAreaIdx].customers.splice(currentDragIdx, 1)[0];
      if (!afterId) {
        copyQueue[areaIdx].customers.push(removed);
        setCurrDragIdx(copyQueue[areaIdx].customers.length - 1)
      } else {
        let targetCustIdx = copyQueue[areaIdx].customers.findIndex((person) => afterId === person.id);
        copyQueue[areaIdx].customers.splice(targetCustIdx, 0, removed);
        setCurrDragIdx(targetCustIdx);
      }
      return copyQueue;
    });
    setSourceAreaIdx(areaIdx);
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
                >
                  {customer.value.name}
                  <button className='delete-btn' onClick={() => deleteCustomer(area.title, customer.id)}>X</button>
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
