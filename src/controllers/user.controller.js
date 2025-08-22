const bcryptjs= require('bcryptjs');
const db = require('../util/db');
const jwt = require('jsonwebtoken');

exports.createUser = async (req,res)=>{
    try{
        const data=req.body;
        console.log('Received data:', data);
        db.query('select * from users where email = ?',[data.email], async (err, result)=>{
            if(err){
                console.log('Error checking user:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.length>0){
                return res.status(409).send('User already exits');
            }
            const hash_password= await bcryptjs.hash(data.password_hash,10);
            const status= data.status=='Active'?true:false;
            const userData = {
                username: data.username,
                email: data.email,
                password_hash: hash_password,
                role: data.role,
                status: status,
                base_id: data.base_id
            };
            db.query('insert into users set ?',userData,(err,result)=>{
                if(err){
                    console.log('Error found:',err);
                    return res.status(500).send('Internal Server Error: '+err);
                }
                if(result.affectedRows>0){
                    return res.status(200).send('User created successfully');
                }
                res.status(400).send('User not created');
            })
        })

    }
    catch(err){
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.login= async (req,res)=>{
    const jwt_secret = "67799r567cbcccvgcfgbvv";
    const jwt_exp_in='24h'
    try{
        console.log(req.body);
        const {email,password}=req.body;
        db.query('select * from users where email = ?',[email], async (err,result)=>{
            if(err){
                console.log('Error during login:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.length==0){
                return res.status(400).send('User not found');
            }
            const user = result[0];
            // if(user.password_hash===)
            const isMatch = await bcryptjs.compare(password,user.password_hash);
            // const isMatch= user.password_hash==password?true:false;
            if(!isMatch){
                return res.status(400);
            }
            else{
                 const payload = {
                  userId: user.user_id,
                  email: user.email,
                  };
                  const token = jwt.sign(payload, jwt_secret, { 
                     expiresIn: jwt_exp_in 
                    });
                return res.status(200).json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    username:user.username,
                    role:user.role,
                    base_id:user.base_id,
                    status:user.status,
                    base_name:user.base_name,
                    base_code:user.base_code,
                    location:user.location
                }
            });
            }
        })
    }
    catch(err){
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.createBase= async (req,res)=>{
    try{
        const data=req.body;
        db.query('insert into bases set ?',data,(err,result)=>{
            if(err){
                if (err.code === "ER_DUP_ENTRY") {
                     console.log("Duplicate entry error:", err);
                     return res.status(409).send("Base already exists"); // 409 Conflict
                }
                console.log('Error creating base:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.affectedRows>0){
                return res.status(200).send('Base created successfully');
            }
            res.status(400).send('Base not created');
        })

    }
    catch(err){
        console.error('Error creating base:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getBases = async (req,res)=>{
    try{
        db.query('select * from bases', (err, result)=>{
            if(err){
                console.log('Error fetching bases:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.length>0){
                return res.status(200).json(result);
            }
            res.status(404).send('No bases found');
        })
    }
    catch(err){
        console.error('Error fetching bases:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getUsers = async (req, res) => {
    try {
        db.query('SELECT * FROM users as u left join bases as b on u.base_id=b.base_id  ', (err, result) => {
            if (err) {
                console.log('Error fetching users:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.length > 0) {
                return res.status(200).json(result);
            }
            res.status(404).send('No users found');
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.updateBase = async (req,res) =>{
     try{
            const data = req.body;
            console.log('Received data for update:', data);
            db.query('update bases set ? where base_id = ?', [data, data.base_id], (err, result) => {
                if (err) {
                    console.log('Error updating base:', err);
                    return res.status(500).send('Internal Server Error');
                }
                if (result.affectedRows > 0) {
                    return res.status(200).send('Base updated successfully');
                }
                res.status(400).send('Base not updated');
            }); 
     }catch(err){
         console.error('Error updating base:', err);
         res.status(500).send('Internal Server Error');
     }
}

exports.deleteBase = async (req, res) =>{
    try{
         const {base_id} = req.body;
         console.log(base_id);
         db.query('delete from bases where base_id = ?', [base_id], (err, result) => {
             if (err) {
                 console.log('Error deleting base:', err);
                 return res.status(500).send('Internal Server Error');
             }
             if (result.affectedRows > 0) {
                 return res.status(200).send('Base deleted successfully');
             }
             res.status(404).send('Base not found');
         });
    }
    catch(err){
        console.error('Error deleting base:', err);
        res.status(500).send('Internal Server Error');
    }   
}

exports.updateUser = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data for user update:', data);
        data.status = data.status === 'Active' ? true : false; 
        db.query('UPDATE users SET ? WHERE user_id = ?', [data, data.user_id], (err, result) => {
            if (err) {
                console.log('Error updating user:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows > 0) {
                return res.status(200).send('User updated successfully');
            }
            res.status(400).send('User not updated');
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.body;
        console.log('Received user_id for deletion:', user_id);
        db.query('DELETE FROM users WHERE user_id = ?', [user_id], (err, result) => {
            if (err) {
                console.log('Error deleting user:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows > 0) {
                return res.status(200).send('User deleted successfully');
            }
            res.status(404).send('User not found');
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
}