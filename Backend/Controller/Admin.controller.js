import pool from "../utils/db.js";
import bcrypt from 'bcrypt'
const Admin=async(req,res)=>{
    const {password}=req.body;
    if(!password){
        return res.json({success:false,message:"Password must required"})
    }
    try {
        const admin=await pool.query("SELECT password FROM admin WHERE admin_id = 4")
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
const GetProfile=async(req,res)=>{
    try {
        const Data=await pool.query("SELECT * FROM pd")
        const TransactionData=await pool.query("SELECT m.*, p.name FROM money_history m INNER JOIN person p ON m.person_id = p.person_id ORDER BY m.created_at DESC;")
        res.status(200).json({success:true,message:Data.rows,transaction:TransactionData.rows})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"})
    }
}
const ResetProfile=async(req,res)=>{
    try {
        const Reset=await pool.query("UPDATE pd SET invested=0,geted=0,profit=0 WHERE id=1")
        res.status(200).json({success:true,message:"Reseted"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"})
    }
}
export {Admin,GetProfile,ResetProfile}