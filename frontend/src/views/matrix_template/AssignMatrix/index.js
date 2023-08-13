import * as React from 'react';
import Paper from '@mui/material/Paper';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';
import { useState } from 'react';
import TreeView from '@mui/lab/TreeView';
// import TreeItem from '@mui/lab/TreeItem';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Menu_Button from 'ui-component/Menu_Button/Menu_Button';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from '@react-spring/web';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Organisations from 'views/organizations';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
};







export default function Assign_Template() {

  const { id } = useParams();

  const [assign, setAssign] = useState({
    template: [],
    assign_to: '',
    organization_id: '',
    department_id: '',
    employee_id: '',
    resposibility: '',
    stackholders: [],
    stackholders:[]
  });

  const [submitted, setSubmitted] = React.useState(0);
  // --------------------------For Snacbar Alert-----------------------------------
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [templateDetail, setTemplateDetail] = React.useState({});
  const [functions, setFunction] = React.useState([]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [template, setTemplate] = React.useState('');
  const [allTemplate, setAllTemplate] = React.useState([]);
  const [allOrganization, setAllOrganization] = React.useState([]);
  const [organization, setOrganization] = React.useState('');
  const [allDepartment, setAllDepartment] = React.useState([]);
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [expanded, setExpanded] = useState([]);
  const [selectedFunction, setSelectedFunction] = React.useState('');
  const [selectedFunctionId, setSelectedFunctionId] = React.useState('');
  const [functionTree, setFunctionTree] = React.useState([]);
  const [employee, setEmployee] = React.useState('');
  const [responsibilities, setResponsibilities] = React.useState([]);

  const handleToggle = (nodeId) => {
    if (expanded.includes(nodeId)) {
      setExpanded(expanded.filter((id) => id !== nodeId));
    } else {
      setExpanded([...expanded, nodeId]);
    }
  };
  const handleChangeTemplate = async (event) => {
    let id=event.target.value;
    console.log(id)
    setTemplate(id);
    try {
      let template =  await fetchTemplate(id);
      
      let assigndata = { ...assign };
      assigndata.template = template;
      setAssign(assigndata);
    } catch (error) {
      console.error("Error in main function:", error);
    }
  };
  const handleChangeAllOrganization = (event) => {
    // console.log(event.target.value)
     let assigndata = { ...assign };
    assigndata.organization_id = event.target.value;
    setAssign(assigndata);
    setOrganization(event.target.value);

    fetchAllDepartments(event.target.value);
    fetchResponsibilities(event.target.value)
  };

  console.log(assign)

  const handleSnackClose = () => {
    setOpenSnackBar(false);
  };
  // --------------------------End Snacbar Alert-----------------------------------

  // ===========================tree===============================================
  const transformToTree = (functionData) => {
    const functionMap = {};
    const treeData = [];

    // Create a map of functions using their IDs as keys
    functionData.forEach((singleFunction) => {
      functionMap[singleFunction._id] = { ...singleFunction, children: [] };
    });

    // Build the tree structure by assigning child functions to their parent recursively
    functionData.forEach((singleFunction) => {
      if (singleFunction.parent_function_id) {
        const parentFunction = functionMap[singleFunction.parent_function_id];
        if (parentFunction) {
          parentFunction.children.push(functionMap[singleFunction._id]);
        }
      } else {
        treeData.push(functionMap[singleFunction._id]);
      }
    });

    return treeData;
  };
  const handleIconClick = (node) => {
    // Perform your specific task here
    setSelectedFunction(node)
    setSelectedFunctionId(node._id)
  };
  const renderTreeNodes = (nodes) => {
    return nodes.map((node) => (
      <TreeItem
        key={node._id}
        nodeId={node._id.toString()}
        label={
          <Box sx={{ display: 'flex' }} onClick={(e) => {
            e.stopPropagation();
          }}>
            {Array.isArray(node.children) && node.children.length ? (
              <ChevronRightIcon onClick={() => handleToggle(node._id)} />
            ) : (
              // just align text equaly
              <ChevronRightIcon sx={{ visibility: 'hidden' }} />

            )}
            <Box component="div" sx={{ display: 'inline', marginTop: '5px' }} onClick={() => { handleIconClick(node) }}>{node.name}</Box>

          </Box>
        }
      >
        {Array.isArray(node.children) ? renderTreeNodes(node.children) : null}
      </TreeItem>
    ));
  };



  // -----------------------------Handle Changes-------------------------------------

  const handleChangeAssignTo = (e) => {
    console.log(e.target.value);
    let assigndata = { ...assign };
    assigndata.assign_to = e.target.value;
    setAssign(assigndata);
  }

  const fetchResponsibilities=(organization_id)=>{
    axios.get(process.env.REACT_APP_BACKEND_URL+'responsibility/organization_responsibilities/'+organization_id).then((response)=>{
      setResponsibilities(response.data);
    })
    }
  const handleChangeDepartment = async (e) => {
    let assigndata = { ...assign};
    assigndata.department_id = e.target.value;
    setAssign(assigndata);
    let select_name = e.target.name;
    let index = select_name.split('_')[1];

    let prev = [...allDepartment];
    prev = prev.slice(0, parseInt(index) + 1);
    setAllDepartment(prev);

    console.log('********************************');
    let dep_id = e.target.value;
    console.log(e.target.value)
    const response = await axios.get(process.env.REACT_APP_BACKEND_URL + "department/" + dep_id);
    if (response.data.sub_department.length > 0) {
      console.log(response.data.sub_department);
      let prev_departments = [...prev];
      prev_departments.push([...response.data.sub_department]);
      setAllDepartment(prev_departments);
    }
    fetchAllEmployee(dep_id);
  };

  const handleChangeEmployee = (e) => {
    let assigndata = { ...assign };
    assigndata.employee_id = e.target.value;
    setAssign(assigndata);
  }
  const handleChangeStackHolders = (e) => {
    let assigndata = { ...assign };
    assigndata.stackholders = e.target.value;
    setAssign(assigndata);
  }
  // --------------------------------------------------------------------------

  async function fetchTemplate(id) {
    let result=null;
    await axios.get(process.env.REACT_APP_BACKEND_URL + 'template/' + id).then((response) => {
      const functions_data = transformToTree(response.data.functions);
      console.log(functions_data)

      setFunctionTree(functions_data)
      setFunction(response.data.functions);
      result={template:response.data.template,function:response.data.functions}; 
    });
    return result;
  }
  function fetchAllTemplates() {
    axios.get(process.env.REACT_APP_BACKEND_URL + 'template/').then((response) => {
      setAllTemplate(response.data);
    });
  }
  function fetchAllDepartments(id) {
    axios.get(process.env.REACT_APP_BACKEND_URL + 'organization/' + id).then((response) => {
      let prev_departments = [];
      prev_departments.push([...response.data.departments])
      setAllDepartment(prev_departments);
    
    });
  }
  function fetchAllOrganization() {
    axios.get(process.env.REACT_APP_BACKEND_URL + 'organization/').then((response) => {
      setAllOrganization(response.data);
    });
  }
  function fetchAllEmployee(department_id) {
    axios.get(process.env.REACT_APP_BACKEND_URL + 'employee/department_employees/'+department_id).then((response) => {
      setAllEmployee(response.data);
    });
  }

  useEffect(() => {
    fetchAllTemplates();
    fetchAllOrganization();
    

  }, [submitted])

  return (
    <>
      <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg} />
      <MainCard title="Assign Template" sx={{ paddingBottom: '2%' }}>

        <Grid container sx={{ marginTop: '20px' }} spacing={2}>
          <Grid md={4} sm={12} item>


            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Template</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={template}
                label="Department"
                onChange={handleChangeTemplate}

              >
                {
                  allTemplate.map((item) => {
                    return (
                      <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid md={4} sm={12} item>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assign.assign_to}
                label="Assign To"
                onChange={handleChangeAssignTo}
              >

                <MenuItem value={'Organization'}>{'Organization'}</MenuItem>
                <MenuItem value={'Department'}>{'Department'}</MenuItem>
                <MenuItem value={'Employee'}>{'Employee'}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid md={4} sm={12} item>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Choose Organization</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={organization}
                label="Organization"
                onChange={handleChangeAllOrganization}
              >
                {
                  allOrganization.map((item) => {
                    return (
                      <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid md={12} sm={12} item>
                <Grid container spacing={2}>
                  <Grid
                    xs={12}
                    md={4}
                    item
                  >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Departments</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        name={`designation_${0}`}
                        // id={`designation_${0}`}
                        id='ddd'
                        required
                        label="Designations"
                        onChange={handleChangeDepartment}
                      >
                        <MenuItem>{"Select Designations"}</MenuItem>
                        {
                          
                          allDepartment.length != 0 ? allDepartment[0].map((department, index) => {
                            return (
                              <MenuItem key={department._id} value={department._id} name={0}>
                                {department.name}
                              </MenuItem>
                            );
                          }) : 'loading'
                        }
                      </Select>
                    </FormControl>
                  </Grid>


                  {
                    allDepartment.length > 1 ?

                      console.log('sub')||
                      allDepartment.slice(1).map((sub_department, index) => {
                        return (
                          <Grid
                            xs={12}
                            md={4}
                            item
                          >
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Sub Departments</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                name={`designation_${index + 1}`}
                                // value={userData.designation}
                                label="Designations"
                                onChange={handleChangeDepartment}
                              >
                                <MenuItem>{"Select Designations"}</MenuItem>
                                {
                                  sub_department.map((department) => {
                                    return (
                                      <MenuItem key={department._id} value={department._id} >
                                        {department.name}
                                      </MenuItem>
                                    );
                                  })
                                }
                              </Select>
                            </FormControl>
                          </Grid>
                        )
                      }) : ''

                  }
                </Grid>
              </Grid> 
          


          {
              assign.assign_to == 'Employee' ?
                <Grid md={4} sm={12} item>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={assign.employee_id}
                      label="Employee"
                      onChange={handleChangeEmployee}
                    >

                      <MenuItem >{'Employee'}</MenuItem>
                      {
                         allEmployee.map((employee) => {
                          return (
                            <MenuItem key={employee._id} value={employee._id} >
                              {employee.name}
                            </MenuItem>
                          );
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid> :
                assign.assign_to == 'Team' ?
                  <Grid md={4} sm={12} item>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Team</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={assign.assign_to}
                        label="Team"
                        // onChange={handleChangeAssignTo}
                      >

                        <MenuItem value={'Team A'}>{'Team A'}</MenuItem>
                        <MenuItem value={'Team B'}>{'Team B'}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> : ''
          }
        </Grid>
        
      </MainCard>

      {
        assign.assign_to=='Employee'?
        (
          <MainCard sx={{marginTop:'20px'}} title="Template Detail">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>

          {/* <Grid container>
          <Grid md={4} sm={12} item >
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={assign.employee_id}
                      label="Employee"
                      onChange={handleChangeEmployee}
                    >

                      <MenuItem >{'Employee'}</MenuItem>
                      {
                         allEmployee.map((employee) => {
                          return (
                            <MenuItem key={employee._id} value={employee._id} >
                              {employee.name}
                            </MenuItem>
                          );
                        })
                      }
                    </Select>
                  </FormControl>

                    </Grid>
          </Grid> */}

          <Grid container >
            <Grid item sm={3} md={3} lg={3}>
              {functions.length != 0 ?
                <TreeView
                  expanded={expanded}

                >
                  {renderTreeNodes(functionTree)}
                </TreeView> : ''
              }
            </Grid>
            <Grid sm={1} md={1} lg={1} sx={{ borderLeft: '1px solid #e6e6e6' }}>

            </Grid>
            <Grid item sm={8} md={8} lg={8}  >
              {
                selectedFunction != '' ?
                  <Grid container sx={{ marginTop: '20px', paddingRight: '10px' }} spacing={3}>
                    
                    <Grid md={4} sm={12} item >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Respopnsibility Matrix</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          // value={employee}
                          label="Respopnsibility"
                          // onChange={(e) => { setEmployee(e.target.value) }}
                        >
                          {
                            responsibilities.map((item) => {
                              return (
                                <MenuItem value={item._id}>{item.name}</MenuItem>
                              )
                            })
                          }


                        </Select>
                      </FormControl>

                    </Grid>
                    <Grid md={4} sm={12} item >
                        <Button variant="contained" >Assign</Button>

                    </Grid>

                  </Grid>
                  :
                  <Grid display="flex" alignItems="center" container sx={{ height: 100 }}>

                    <Typography> No Function Is Selected</Typography>
                  </Grid>
              }
            </Grid>
          </Grid>


        </Paper>
      </MainCard>
        ):
        assign.assign_to=='Organization' || assign.assign_to=='Department'?
        (
          <MainCard sx={{marginTop:'20px'}} title="Template Detail">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container >
            <Grid item sm={3} md={3} lg={3}>
              {functions.length != 0 ?
                <TreeView
                  expanded={expanded}

                >
                  {renderTreeNodes(functionTree)}
                </TreeView> : ''
              }
            </Grid>
            <Grid sm={1} md={1} lg={1} sx={{ borderLeft: '1px solid #e6e6e6' }}>

            </Grid>
            <Grid item sm={8} md={8} lg={8}  >
              {
                selectedFunction != '' ?
                  <Grid container sx={{ marginTop: '20px', paddingRight: '10px' }} spacing={3}>
                    <Grid md={5} sm={12} item >
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={assign.employee_id}
                      label="Employee"
                      onChange={handleChangeEmployee}
                    >

                      <MenuItem >{'Employee'}</MenuItem>
                      {
                         allEmployee.map((employee) => {
                          return (
                            <MenuItem key={employee._id} value={employee._id} >
                              {employee.name}
                            </MenuItem>
                          );
                        })
                      }
                    </Select>
                  </FormControl>

                    </Grid>
                    <Grid md={5} sm={12} item >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Respopnsibility Matrix</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          // value={employee}
                          label="Respopnsibility"
                          // onChange={(e) => { setEmployee(e.target.value) }}
                        >
                          {
                            responsibilities.map((item) => {
                              return (
                                <MenuItem value={item._id}>{item.name}</MenuItem>
                              )
                            })
                          }


                        </Select>
                      </FormControl>

                    </Grid>
                    <Grid md={2} sm={12} item >
                        <Button variant="contained" >Assign</Button>

                    </Grid>

                  </Grid>
                  :
                  <Grid display="flex" alignItems="center" container sx={{ height: 100 }}>

                    <Typography> No Function Is Selected</Typography>
                  </Grid>
              }
            </Grid>
          </Grid>
        </Paper>
      </MainCard>
        ):''
      }


      {/* <MainCard sx={{marginTop:'20px'}} title="Template Detail">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Grid container >
            <Grid item sm={3} md={3} lg={3}>
              {functions.length != 0 ?
                <TreeView
                  expanded={expanded}

                >
                  {renderTreeNodes(functionTree)}
                </TreeView> : ''
              }
            </Grid>
            <Grid sm={1} md={1} lg={1} sx={{ borderLeft: '1px solid #e6e6e6' }}>

            </Grid>
            <Grid item sm={8} md={8} lg={8}  >
              {
                selectedFunction != '' ?
                  <Grid container sx={{ marginTop: '20px', paddingRight: '10px' }} spacing={3}>
                    <Grid md={4} sm={12} item >
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={assign.employee_id}
                      label="Employee"
                      onChange={handleChangeEmployee}
                    >

                      <MenuItem >{'Employee'}</MenuItem>
                      {
                         allEmployee.map((employee) => {
                          return (
                            <MenuItem key={employee._id} value={employee._id} >
                              {employee.name}
                            </MenuItem>
                          );
                        })
                      }
                    </Select>
                  </FormControl>

                    </Grid>
                    <Grid md={4} sm={12} item >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Respopnsibility Matrix</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={employee}
                          label="Employee"
                          onChange={(e) => { setEmployee(e.target.value) }}
                        >
                          {
                            allEmployee.map((item) => {
                              return (
                                <MenuItem value={item._id}>{item.name}</MenuItem>
                              )
                            })
                          }


                        </Select>
                      </FormControl>

                    </Grid>
                    <Grid md={4} sm={12} item >
                        <Button variant="contained" >Assign</Button>

                    </Grid>

                  </Grid>
                  :
                  <Grid display="flex" alignItems="center" container sx={{ height: 100 }}>

                    <Typography> No Function Is Selected</Typography>
                  </Grid>
              }
            </Grid>
          </Grid>


        </Paper>
      </MainCard> */}
    </>
  );
}