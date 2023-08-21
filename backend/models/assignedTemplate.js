//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const AssignedTemplateSchema = mongoose.Schema({
  assignTo: { type: String , required:true },
  organizationId: { type: String,required:true },
  departmentId: { type: String , default:null},
  employeeId: { type: String,required:true },
  deleteStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
});
//pass AssignedTemplateSchema into mongoose.model(modelName, schema)
export default mongoose.model("AssignedTemplate", AssignedTemplateSchema);





