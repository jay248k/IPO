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
        const numericPrice = Number(price);
        const numericGmp = Number(gmp);

        const profit_calc = (numericPrice * numericGmp) / 100;
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
        const details = await pool.query(
            "SELECT * FROM ipo WHERE ipo_id = $1",
            [ipo]
        );

        const IPO_Details = details.rows[0];
        if (!IPO_Details) {
            return res.json({ success: false, message: "IPO not found" });
        }
        const amount = Number(IPO_Details.price);

        const transaction = await History(customer, amount, "Debit");
        if (!transaction) {
            return res.json({ success: false, message: "Transaction Failed" });
        }

        await pool.query(
            "UPDATE pd SET invested = invested + $1 WHERE id = 1",
            [amount]
        );

        await pool.query(
            `INSERT INTO ipo_fillup 
       (ipo_id, person_id, status, sending_money, active)
       VALUES ($1,$2,$3,$4,$5)`,
            [ipo, customer, "AWAIT", amount, true]
        );

        res.json({ success: true, message: "Filled success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const AllotmatStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Application id is required"
        });
    }
    if (!status) {
        return res.json({ success: false, message: "status must required" })
    }
    try {
        if (status === "ALLOTTED") {
            const profit = await pool.query(`SELECT p.profit,i.person_id from ipo_fillup i inner join ipo p on i.ipo_id=p.ipo_id where id=${id}`)
            await History(profit.rows[0].person_id, profit.rows[0].profit, "Debit")
            const ProfitCalc = (profit.rows[0].profit) * 30 / 100;
            const update_profit = await pool.query(`UPDATE pd SET profit=profit+${ProfitCalc},invested=invested+${profit.rows[0].profit} WHERE id=1`)
            const update = await pool.query(`UPDATE ipo_fillup SET status='ALLOTTED' WHERE id=${id} RETURNING *`);

        }
        if (status === "NOT ALLOTTED") {
            const update = await pool.query(`UPDATE ipo_fillup SET status='NOT ALLOTTED' WHERE id=${id} RETURNING *`);

        }
        res.json({ success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
const AllIPOs = async (req, res) => {
    try {
        const IPO = await pool.query("SELECT * FROM ipo ORDER BY ipo_id DESC");
        res.status(200).json({ success: true, message: IPO.rows })
    } catch (error) {
        console.log(error); 
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
const IPOfilled = async (req, res) => {
    const { id } = req.params;

    try {
        const Data = await pool.query(`SELECT i.id as application_id,i.status,i.active,p.name,p.pan_id FROM ipo_fillup i inner join person p on i.person_id=p.person_id where ipo_id=${id}`)
        res.status(200).json({ success: true, message: Data.rows })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
const DeActive = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT i.person_id,i.status,n.price,n.profit FROM ipo_fillup i inner join ipo n on i.ipo_id=n.ipo_id WHERE id=${id}`);
        const Data = result.rows[0];
        if (Data.status === "ALLOTTED") {
            const Total = Number(Data.price) + Number(Data.profit)
            await pool.query(`UPDATE pd SET geted=geted+${Total} WHERE id=1`)
            await History(Data.person_id, Total, "Credit");
        }
        if (Data.status === "NOT ALLOTTED") {
            await History(Data.person_id, Number(Data.price), "Credit");
            const Total = Number(Data.price)
            await pool.query(`UPDATE pd SET geted=geted+${Total} WHERE id=1`)
        }
        const DeActive = await pool.query(`UPDATE ipo_fillup SET active=false where id=${id}`);
        if (!DeActive) {
            return res.json({ success: false, message: "Can't DeActive" })
        }
        res.json({ success: true, message: "Successfull!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }

}
export { Register, UpdateIPO, IPOfillup, AllotmatStatus, AllIPOs, IPOfilled, DeActive }