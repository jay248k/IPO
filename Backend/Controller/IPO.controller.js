import pool from "../utils/db.js";

const History = async (person_id, money, transaction_status) => {
    if (!person_id || !money || !transaction_status) {
        return { success: false, message: "Transaction Details Missing" }
    }
    const Transaction = await pool.query("INSERT INTO money_history (person_id,money,transaction_status) VALUES ($1,$2,$3)", [
        person_id, money, transaction_status
    ])
    if (!Transaction) {
        return { success: false, message: "Transaction Failed" }
    }
    return { success: true, message: "Transaction Successfully" }
}

const Register = async (req, res) => {
    const { name, price, starting_date, ending_date, listing, gmp } = req.body;
    if (!name || !price || !starting_date || !ending_date || !listing || !gmp) {
        return res.json({ success: false, message: "Details missing!" })
    }
    try {
        const profit_calc = price * gmp / 100;
        const Data = await pool.query('INSERT INTO ipo (name,price,starting_date,ending_date,listing,gmp,profit) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [
            name, price, starting_date, ending_date, listing, gmp, profit_calc
        ])
        if (!Data) {
            res.json({ success: false, message: "IPO can't registed" })
        }
        res.status(200).json({ success: true, message: "IPO registed successfuly" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
const UpdateIPO = async (req, res) => {
    const { id } = req.params;
    const { name, price, starting_date, ending_date, listing, gmp } = req.body;
    if (!name || !price || !starting_date || !ending_date || !listing || !gmp) {
        return res.json({ success: false, message: "Details missing!" })
    }
    try {
        const profit_calc = price * gmp / 100;
        const Data = await pool.query("UPDATE ipo SET name=$1,price=$2,starting_date=$3,ending_date=$4,listing=$5,gmp=$6,profit=$7 WHERE ipo_id=$8", [
            name, price, starting_date, ending_date, listing, gmp, profit_calc, id
        ])
        if (!Data) {
            res.json({ success: false, message: "IPO can't registed" })
        }
        res.status(200).json({ success: true, message: "IPO updated successfuly" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
const IPOfillup = async (req, res) => {
    const { ipo, customer } = req.params;

    try {
        const Details = await pool.query(`SELECT * FROM ipo WHERE ipo_id=${ipo}`);
        const IPO_Details = Details.rows[0];
        const Transaction = await History(customer, IPO_Details.price, "Credit")
        if (!Transaction) {
            return res.json({ success: false, message: "Transaction Failed" })
        }
        const Account = await pool.query(`UPDATE pd SET invested=invested+${IPO_Details.price} WHERE id=1`)
        const MainData = await pool.query("INSERT INTO ipo_fillup (ipo_id,person_id,status,sending_money,active) VALUES ($1,$2,$3,$4,$5) RETURNING *", [
            ipo, customer, "AWAIT", IPO_Details.price, true
        ])
        if (!MainData) {
            return res.json({ success: false, message: "Can't Filled" })
        }
        res.json({ success: true, message: "Filled success" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
const AllotmatStatus=async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body;
    if(!status){
        return res.json({success:false,message:"status must required"})
    }
    try {
        if(status==="ALLOTTED"){
            const update=await pool.query(`UPDATE ipo_fillup SET status='ALLOTTED' WHERE id=${id}`);
            
        }
        if()
        

    } catch (error) {
        
    }
}
export { Register, UpdateIPO, IPOfillup }