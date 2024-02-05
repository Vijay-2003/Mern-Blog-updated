import { getDataUri } from "../middleware/dataUri.js";
import Post from "../models/post.js";
import cloudinary from 'cloudinary'
import jwt from 'jsonwebtoken'
const NewPost = async(req,res) =>{
    try{
    const token = req.headers.authorization;
    let userInfo=null;
    jwt.verify(token,process.env.SECRET,(err,info)=>{
        if(err) console.log(err);
        userInfo=info;
    })
    const fileUri = getDataUri(req.file)
    const cloudUri = await cloudinary.v2.uploader.upload(fileUri.content);
    const {Title , Summary , Content} = req.body;
    const Cover = cloudUri.secure_url;
    const {id} = userInfo;
    const newPost = new Post({
        Title,
        Summary,
        Cover,
        Content,
        Author:id
    })
    const response = await newPost.save();
    if(response) res.status(200).json('ok');
    else res.json('error!')
    }
    catch(err){
        res.json('error')
    }
}

export default NewPost