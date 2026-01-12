import pool from "../utils/db.js";
import bcrypt from 'bcrypt'
const Admin=async(req,res)=>{
    const {password}=req.body;
    if(!password){
        return res.json({success:false,message:"Password must required"})
    }
    try {
        const admin=await pool.query("SELECT * FROM admin where admin_id=4")
        const AdminPassword=admin.rows[0].password
        const verify=await bcrypt.compare(password,AdminPassword);
        
        if(!verify){
            return res.json({success:false,message:"Incorrect Password"})
        }
        res.json({success:true,message:"Login Success"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}
export {Admin}