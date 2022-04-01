import React, { useState, useEffect } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Grid, Button } from '@material-ui/core'
import FormDialog from './components/dialog';
import ReactPlayer from 'react-player/youtube';


const initialValue = { name: "", email: "", phone: "", dob: "" }
function App() {

  const actionButton = (params) => {
    setOpen(true)
    // <ReactPlayer url='https://www.youtube.com/watch?v=uMQnn8xU7qs' />
    
  }

  const [gridApi, setGridApi] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState(initialValue)
  

  const handleClose = () => {
    setOpen(false);
    setFormData(initialValue)
  };
  const url = `http://localhost:4000/users`
  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name", },
    { headerName: "Email", field: "email", },
    { headerName: "phone", field: "phone" },
    { headerName: "Date of Birth", field: "dob" },
    {
      headerName: "Actions", field: "dob", cellRendererFramework: (params) => <div>
      <Button variant="contained" size="lg" color="primary" onClick={() => actionButton(params)}>Play</Button>

       
        {/* <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.value)}>Delete</Button> */}
      </div>
    }
  ]
  // calling getUsers function for first time 
  useEffect(() => {
    getUsers()
  }, [])

  //fetching user data from server
  const getUsers = () => {
    fetch(url).then(resp => resp.json()).then(resp => setTableData(resp))
  }
  const onChange = (e) => {
    const { value, id } = e.target
    // console.log(value,id)
    setFormData({ ...formData, [id]: value })
  }
  const onGridReady = (params) => {
    setGridApi(params)
  }

  // setting update row data to form data and opening pop up window
  const handleUpdate = (oldData) => {
    setFormData(oldData)
    console.log(handleUpdate)
    
  }
 
  const handleFormSubmit = () => {
    if (formData.id) {
      //updating a user 
      const confirm = window.confirm("Are you sure, you want to update this row ?")
      confirm && fetch(url + `/${formData.id}`, {
        method: "PUT", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          handleClose()
          getUsers()

        })
    } else {
      // adding new user
      fetch(url, {
        method: "POST", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          handleClose()
          getUsers()
        })
    }
  }

  const defaultColDef = {
    sortable: true,
    flex: 1, filter: true,
    floatingFilter: true
  }
  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <h3>CRUD Operation with Json-server in ag-Grid</h3>
      
      <div className="ag-theme-alpine" style={{ height: '400px' }}>
        <AgGridReact
          rowData={tableData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
      <FormDialog open={open} handleClose={handleClose}
        data={formData} onChange={onChange} handleFormSubmit={handleFormSubmit} />
    </div>
  );
}

export default App;