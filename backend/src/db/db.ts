import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {type : String , require: true , unique : true},
    username: {type : String , require: true , unique : true},
    password: {type : String, require: true}
})


const TagsSchema= new mongoose.Schema({
    title : {type : String , require : true  , unique : true}
})

const contentType= [ "image" , 'video' , "article " , "tweet" , "link"]

const ContentSchema = new mongoose.Schema({
    link : {type : String, require: true},
    title: {type : String, require: true},
    type:{type : String , enum: contentType, require : true},
    description:{type : String  , require : true},
    tags : [{type : mongoose.Types.ObjectId , ref: 'tags'}],
    date: Date,
    userId : {type : mongoose.Types.ObjectId , ref: 'users' , require:true},
    embeddings:{type:[Number] , default:[]}

})

const LinkSchema= new mongoose.Schema({
    hash :{type : String, require:true},
    userId: {type : mongoose.Types.ObjectId , require: true , ref : 'users'}
})

export const UserModel= model("users", UserSchema)
export const TagsModel= model("tags" , TagsSchema)
export const ContentModel= model("contents" , ContentSchema)
export const LinkModel= model("links", LinkSchema)