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

export const getNotesByTag = async (req, res) => {
    const { tag } = req.query;
    if (tag) {
        try {
            // Case-insensitive, exact match
            const notes = await Note.find({
                isPrivate: false,
                tags: { $elemMatch: { $regex: `^${tag}$`, $options: 'i' } }
            })
            .populate('category')
            .populate('user', 'username profileImage email')
            .sort({ createdAt: -1 });
            return res.json(notes);
        } catch (error) {
            console.error('Error fetching notes by tag:', error);
            return res.status(500).json({ error: 'Failed to fetch notes by tag' });
        }
    } else {
        // fallback: return all public notes (for search page)
        try {
            const notes = await Note.find({ isPrivate: false })
                .populate('category')
                .populate('user', 'username profileImage email')
                .sort({ createdAt: -1 });
            return res.json(notes);
        } catch (error) {
            console.error('Error fetching public notes:', error);
            return res.status(500).json({ error: 'Failed to fetch public notes' });
        }
    }
};

export const getAllTags = async (req, res) => {
    try {
        // Find all public notes
        const notes = await Note.find({ isPrivate: false }, 'tags');
        // Flatten all tags into a single array
        const allTags = notes.flatMap(note => Array.isArray(note.tags) ? note.tags : []);
        // Count occurrences
        const tagCounts = {};
        allTags.forEach(tag => {
            const lower = tag.toLowerCase();
            tagCounts[lower] = (tagCounts[lower] || 0) + 1;
        });
        // Convert to array and sort by count desc, then alphabetically
        const tagsArr = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
        res.json(tagsArr);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
};

export const createNote = async (req, res) => {
    try {
        const lastNote = await Note.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        if (lastNote) {
            const now = Date.now();
            const lastCreated = new Date(lastNote.createdAt).getTime();
            if (now - lastCreated < 10 * 1000) {
                const wait = Math.ceil((10 * 1000 - (now - lastCreated)) / 1000);
                return res.status(429).json({ error: `Please wait ${wait} more second(s) before creating another note.` });
            }
        }

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const notesLastHour = await Note.countDocuments({
            user: req.user._id,
            createdAt: { $gte: oneHourAgo }
        });
        if (notesLastHour >= 100) {
            return res.status(429).json({ error: "Note creation limit reached: Only 5 notes per hour allowed." });
        }

        const { title, content, category, tags } = req.body;

        let categoryDoc = await Category.findOne({
            name: category,
            user: req.user._id
        });

        if (!categoryDoc) {
            categoryDoc = new Category({
                name: category,
                user: req.user._id
            });
            await categoryDoc.save();

            await User.findByIdAndUpdate(
                req.user._id,
                { $addToSet: { categories: categoryDoc._id } }
            );
        }

        const note = new Note({
            title,
            content,
            category: categoryDoc._id,
            user: req.user._id,
            isPrivate: false,
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(tag => tag.length > 0) : []
        });

        await note.save();

        await Category.findByIdAndUpdate(
            categoryDoc._id,
            { $addToSet: { notes: note._id } }
        );

        res.status(201).json(note);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.title && error.keyPattern.user) {
            return res.status(400).json({ error: 'You already have a note with this title. Note titles must be unique.' });
        }
        console.error('Error creating note:', error);
        res.status(500).json({
            error: 'Failed to create note',
            details: error.message
        });
    }
}

export const updateNote=async(req,res)=>{
    const {id}=req.params
    try {
        // Only allow updating tags if provided
        const updateData = { ...req.body };
        if (updateData.tags) {
            updateData.tags = Array.isArray(updateData.tags) ? updateData.tags.map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        }
        const note=await Note.findOneAndUpdate(
            {_id:id,user:req.user._id},
            updateData,
            {new:true, runValidators: true}
        )
        res.json(note);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.title && error.keyPattern.user) {
            return res.status(400).json({ error: 'You already have a note with this title. Note titles must be unique.' });
        }
        console.error('Error updating note:', error);
        res.status(500).json({
            error: 'Failed to update note',
            details: error.message
        });
    }
}

export const deleteNote=async(req,res)=>{
    const {id}=req.params
    const note=await Note.findOneAndDelete({_id:id,user:req.user._id})
    res.json({message:'Note Deleted'})
}

export const sanitizeNoteInput = (req, res, next) => {
  const sanitize = (str) =>
    typeof str === "string"
      ? str.replace(/[$.<>]/g, "") 
      : str;

  if (req.body.title) req.body.title = sanitize(req.body.title);
  if (req.body.content) req.body.content = sanitize(req.body.content);
  if (req.body.category) req.body.category = sanitize(req.body.category);
  if (req.body.tags && Array.isArray(req.body.tags)) req.body.tags = req.body.tags.map(tag => sanitize(tag));

  next();
};

