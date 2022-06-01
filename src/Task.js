function Task({area, dragging, getStyle, handleDragStart, deleteCustomer, areaIdx }) {
  
  return (
    <>
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
    </>
  )
}

export default Task;