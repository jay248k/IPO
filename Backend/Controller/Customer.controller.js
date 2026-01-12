import pool from "../utils/db.js";

const Register = async (req, res) => {
    const { name, pan_id, percentage } = req.body;
    if (!name || !pan_id || !percentage) {
        return res.json({ success: false, message: "Details missing" })
    }
    try {
        const Person = await pool.query("INSERT INTO person (name,pan_id,percentage) VALUES ($1,$2,$3) RETURNING *", [
            name, pan_id, percentage
        ])
        if (!Person) {
            return res.json({ success: false, message: "Can't Registed" })
        }
        res.json({ success: false, message: "Registed Successfully!" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" })
    }
}
const Update = async (req, res) => {
    const { id } = req.params;
    const { name, pan_id, percentage } = req.body;
    if (!name || !pan_id || !percentage) {
        return res.json({ success: false, message: "Details missing" })
    }
    try {
        const update = await pool.query("UPDATE person SET name=$1,pan_id=$2,percentage=$3 WHERE person_id=$4 RETURNING *", [
            name, pan_id, percentage, id
        ])
        if (!update) {
            return res.json({ success: false, message: "Can't Updated" })
        }
        res.json({ success: true, message: "Updated Successfully!" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" })
    }
}
const Delete=async(req,res)=>{
    const {id}=req.params;
    try {
        const Data=await pool.query(`DELETE FROM person WHERE person_id=${id}`);
        if(!Data){
            res.json({success:false,message:"Can't deleted"})
        }
        res.status(200).json({success:true,message:"Deleted succesfully!"})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" })
    }
}
export { Register, Update,Delete }