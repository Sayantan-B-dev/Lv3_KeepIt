import Note from "../models/note.js"
import Category from "../models/category.js"
import User from "../models/user.js"

export const getNotesById=async(req,res)=>{
    const {id}=req.params;
    const note=await Note.findById(id)
    res.json(note)
}

export const pinNote=async(req,res)=>{
    const {id}=req.params;
    const note=await Note.findByIdAndUpdate(id,{isPinned:true},{new:true})
    res.json(note)
}

export const getUserNotes=async(req,res)=>{
    const notes=await Note.find({user:req.user._id}).populate('category')
    res.json(notes)
}

export const getPublicNotesbyUser=async(req,res)=>{
    const userId=req.params.userId;
    const notes= await Note.find({user:userId,isPrivate:false}).populate('category')
    res.json(notes)
}

export const getAllPublicNotes=async(req,res)=>{
    try {
        const notes= await Note.find({isPrivate:false})
            .populate('category')
            .populate('user', 'username')
            .sort({createdAt: -1})
        res.json(notes)
    } catch (error) {
        console.error('Error fetching public notes:', error);
        res.status(500).json({ error: 'Failed to fetch public notes' });
    }
}

export const createNote=async(req,res)=>{
    try {
        // Limit: Max 5 notes per hour per account
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const notesLastHour = await Note.countDocuments({
            user: req.user._id,
            createdAt: { $gte: oneHourAgo }
        });
        if (notesLastHour >= 10) {
            return res.status(429).json({ error: "Note creation limit reached: Only 5 notes per hour allowed." });
        }
        const { title, content, category } = req.body;
        //console.log('Creating note with:', { title, content, category });
        //console.log('User ID:', req.user._id);
        
        // Find or create the category
        let categoryDoc = await Category.findOne({ 
            name: category, 
            user: req.user._id 
        });
        //console.log('Found category:', categoryDoc);
        
        if (!categoryDoc) {
            // Create new category if it doesn't exist
            categoryDoc = new Category({
                name: category,
                user: req.user._id
            });
            await categoryDoc.save();
            //console.log('Created new category:', categoryDoc);
            
            // Add category to user's categories array
            await User.findByIdAndUpdate(
                req.user._id,
                { $addToSet: { categories: categoryDoc._id } }
            );
            //console.log('Added category to user profile');
        }
        
        // Create the note
        const note = new Note({
            title,
            content,
            category: categoryDoc._id,
            user: req.user._id,
            isPrivate: false
        });
        
        //console.log('Saving note:', note);
        await note.save();
        //console.log('Note saved successfully:', note._id);
        
        // Add note to category's notes array
        await Category.findByIdAndUpdate(
            categoryDoc._id,
            { $addToSet: { notes: note._id } }
        );
        //console.log('Added note to category');
        
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ 
            error: 'Failed to create note',
            details: error.message 
        });
    }
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

// This middleware will sanitize req.body fields using regex
export const sanitizeNoteInput = (req, res, next) => {
  const sanitize = (str) =>
    typeof str === "string"
      ? str.replace(/[$.<>]/g, "") // Remove MongoDB operators and angle brackets
      : str;

  if (req.body.title) req.body.title = sanitize(req.body.title);
  if (req.body.content) req.body.content = sanitize(req.body.content);
  if (req.body.category) req.body.category = sanitize(req.body.category);

  next();
};

