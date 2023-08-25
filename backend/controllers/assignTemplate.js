import assignTemplate from '../models/assignedTemplate.js'
import Employee from '../models/employee.js'
import Template from '../models/template.js'


export const GetAssignedTemplates=async (req,res)=>{
   
  try{
    const assignedTemplates=await assignTemplate.find({}).populate(['employee_id','organization_id','department_id']).sort({ _id: -1 });
    res.status(200).json({error:false,data:assignedTemplates});
  }catch(err){
    res.status(500).json({
      error:true,
      msg:err.message
    });
  }
   
};
export const AssignTemplate = async (req, res) => {
  const TemplateToAssign = req.body;
  

};


