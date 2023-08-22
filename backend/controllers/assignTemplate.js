import assignTemplate from '../models/assignedTemplate.js'
import Employee from '../models/employee.js'
import Template from '../models/template.js'

// export const AssignTemplate=async(req,res)=>{
//     const TemplateToAssign=req.body;
//     try{
//         console.log(TemplateToAssign)
//         const template_id=TemplateToAssign.template.template._id;
//         // console.log(template_id)

//         // const addAssignTemplate=new assignTemplate(TemplateToAssign);
//         // await assignTemplate.save();

//         TemplateToAssign.template.functions.map(async (func)=>{
//             // console.log(func.assignTo)
//             var emp_id=func.assignTo;
//             var employee= await Employee.findOne({_id:emp_id});
            
//             var emp_existing_templates=employee.templates;
            
//         })

        

//         res.send({error:false,data:req.body})
//     }catch(err){
//         res.status(404).json({
//             error:true,
//             msg:err.message
//         })
//     }


// }

export const AssignTemplate = async (req, res) => {
    const TemplateToAssign = req.body;
    
    try {
      const templateId = TemplateToAssign.template.template._id;
      const functions = TemplateToAssign.template.functions;
      
      // Find the template based on the templateId
      const template = await Template.findOne({ _id: templateId });
      if (!template) {
        return res.status(404).json({
          error: true,
          msg: "Template not found",
        });
      }
      const addAssignTemplate=new assignTemplate(TemplateToAssign);
      await addAssignTemplate.save();
  
      // Loop through the functions and assign them to employees
      for (const func of functions) {
        const empId = func.assignTo;
        
        // Find the employee based on empId
        const employee = await Employee.findOne({ _id: empId });
  
        if (employee) {
          // Check if the template is already assigned to the employee
          const templateExists = employee.templates.find(
            (temp) => temp.template._id.toString() === templateId.toString()
          );
          
          if (!templateExists) {
            // If not assigned, add the function to the employee's templates
            employee.templates.push({
              template: template,
              functions: [func],
            });
          } else {
            // If assigned, add the function to the existing template
            const existingTemplate = employee.templates.find(
              (temp) => temp.template._id.toString() === templateId.toString()
            );
            existingTemplate.functions.push(func);
            employee.markModified('templates');
            // console.log(existingTemplate)
            
          }
          
          // Save the employee's updated templates
          const g=await employee.save();
          console.log(g)

        }
      }

  
      res.send({ error: false, data: req.body });
    } catch (err) {
      res.status(500).json({
        error: true,
        msg: err.message,
      });
    }
  };

