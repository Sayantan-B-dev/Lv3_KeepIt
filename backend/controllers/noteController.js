import Note from "../models/note.js"

export const getUserNotes=async(req,res)=>{
    const notes=await Note.find({user:req.user._id}).populate('category')
    res.json(notes)
}

export const getPublicNotesbyUser=async(req,res)=>{
    const userId=req.params.userId;
    const notes= await Note.find({user:userId,isPrivate:false}).populate('category')
    res.json(notes)
}

export const createNote=async(req,res)=>{
    const note=new Note({
        title:req.body.title,
        content:req.body.content,
        isPrivate:req.body.isPrivate||false,
        category:req.body.category,
        user:req.body._id
    })
    await note.save(),
    res.status(201).json(note)
}
export const updateNote=async(req,res)=>{
    const {id}=req.params
    const note=await Note.findOneAndUpdate(
        {_id:id,user:req.user._id},
        req.body,
        {new:true}
    )
    res.json(note);
}
export const deleteNote=async(req,res)=>{
    const {id}=req.params
    const note=await Note.findOneAndDelete({_id:id,user:req.user._id})
    res.json({message:'Note Deleted'})
}
