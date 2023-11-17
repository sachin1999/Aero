//importing 
const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();
const User = require("./models/UserModel");
const bcrypt = require("bcryptjs")
const fs = require('fs');
const dbConnect = require("./config/database");
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const Place = require('./models/PlaceModel');
const Booking = require("./models/BookingModel");
const multer = require("multer");
const mime = require('mime-types');
require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "gjhgcvbvbcbcvvhjvhjvhjvh";
const bucket = 'aero-booking';

const port = process.env.PORT || 5000 ;

app.use('/uploads', express.static(path.join(__dirname +'/uploads')));
app.use(express.json());
app.use(cookieParser());
async function uploadToS3(path, originalFilename, mimetype){
    const client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    const data = await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }))
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}
// get data from cookies
function getUserDataFromToken(req) {
    return new Promise((resolve,reject)=> {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
        resolve(userData);
        });
    })
}
//for interacting with UI on different port 
app.use(cors(
    {
    credentials: true,
    origin : 'http://localhost:5173',
    method : ['GET', 'POST', 'PUT']
    }
));

//connection establish


//get request
app.get('/test' ,(req,res) => {
    dbConnect();
    res.json("test ok")
})
//post request for registration
app.post('/register', async (req,res) => {
    dbConnect();
    const {name,email,password} = req.body;
   try {
    const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(user);
   }
   catch(error) {
        res.status(422).json(error);
   }
});
//post requset for login
app.post('/login', async (req,res) => {
    dbConnect();
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
        if(userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
                 if(passOk){
                        jwt.sign({
                            email:userDoc.email, 
                            id:userDoc._id, 
                            name:userDoc.name
                        }, jwtSecret, {}, (err,token) => {
                            if(err) throw err;
                            res.cookie('token', token).json(userDoc);
                        })
                    }
                    else {
                        res.status(422).json('pass not ok');
                    }
            }
        else{
                res.json('Not Found'); 
        }

});
 
//get request after login
app.get('/profile', (req,res) => {
    dbConnect();
        // res.json(req.cookies)
        const {token} = req.cookies;
        if (token) {
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name,email,_id} = await User.findById(userData.id);
            res.json({name,email,_id});
            });
        } 
        else {
            res.json(null);
        }
})

app.post('/logout', (req,res) => {
    res.cookie('token', '', { expires: new Date(0) }).json({ message: 'Logout successful' });
    res.end();
})

app.post('/upload-by-link', async (req,res)=> {
    dbConnect();
    const {link} = req.body;
    if(!link){
        return res.status(400).json({error: 'Image url is not defined'}) 
    }
    const newName =  'photo' + Date.now() + '.jpg';
    await imageDownloader.image({

            url: link,
            dest: '/tmp/' +newName, //`${__dirname}/uploads/${newName}`,

    })
    const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName))
    res.json(url);    
}) 
const photosMiddleware = multer({dest:'/tmp'})
app.post('/uploads',photosMiddleware.array('photos', 100), async (req,res)=> {
    const uploadedFiles = [];
    for(let i =0 ;i<req.files.length;i++){
        const {path,originalname,mimetype} = req.files[i];
        const url = await uploadToS3(path,originalname, mimetype);
        console.log({url});
        uploadedFiles.push(url);
        console.log(uploadedFiles);
    }
    res.json(uploadedFiles); 
    console.log({res})
})
app.post('/places', async (req,res)=> {
    dbConnect();
    const {token} = req.cookies;
    const {title,address,addedPhotos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title,address,addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests,price
        });
        res.json(placeDoc);  
 })
})
app.get('/user-places', (req,res) => {
    dbConnect();
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
            const {id} = userData;
            res.json(await Place.find({owner:id}))
        });
    } 
    else {
        res.json(null);
    }

})
app.get('/places/:id', async (req,res)=>{
    dbConnect();
    const {id} = req.params;
    res.json(await Place.findById(id));
});
app.put('/places', async (req,res)=> {
    dbConnect();
    const {token} = req.cookies;
    const {
        id,title,address,addedPhotos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title,address,addedPhotos,description,
                perks,extraInfo,checkIn,checkOut,maxGuests,price
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
})
app.get('/places', async (req,res)=>{
    dbConnect();
    res.json( await Place.find() );
})
app.post('/bookings', async (req,res) =>{
    dbConnect();
    // const {token} = req.cookies;
    const userData = await getUserDataFromToken(req);
    const {place,checkIn,checkOut ,
    numberOfGuests,name,mobile,price} = req.body;
      await Booking.create({
            place,checkIn,checkOut ,
            numberOfGuests,name,mobile,price,
            user:userData.id,
        }).then((doc)=>{
            res.json(doc);
        }).catch((err) => {
             throw err;
        }) 
});

app.get('/bookings', async (req,res) => {
    dbConnect();
    const userData = await getUserDataFromToken(req);
    res.json(await  Booking.find({user:userData.id}).populate('place'))

})
    


app.listen(port,() =>{
    console.log(`Successfully started server ${port}`)
});