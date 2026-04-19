//noteController.js
import Note from "../models/note.model.js"
import Category from "../models/category.model.js"
import User from "../models/user.model.js"
import CategoryType from "../models/categoryType.model.js";
import archiver from "archiver";


export const getPublicCategoryNotes = async (req, res) => {
  // Extract category ID from route parameters
  const { id: categoryId } = req.params;

  // Parse pagination parameters safely with bounds
  const currentPage = Math.max(parseInt(req.query.page) || 1, 1);
  const pageLimit = Math.min(parseInt(req.query.limit) || 10, 50);

  // Calculate skip value for pagination offset
  const documentsToSkip = (currentPage - 1) * pageLimit;

  try {
    // Define optimized query using index-friendly equality
    const queryFilter = {
      category: categoryId,
      isPrivate: false // IMPORTANT: avoids $ne, enables index usage
    };

    // Execute both data fetch and total count in parallel
    const [notes, totalDocuments] = await Promise.all([
      Note.find(queryFilter)

        // Projection: fetch only required fields to reduce payload
        .select({
          _id: 1,
          title: 1,
          createdAt: 1,
          tags: 1
        })

        // Sort aligned with compound index for efficient execution
        .sort({ title: 1 })

        // Pagination controls
        .skip(documentsToSkip)
        .limit(pageLimit)

        // Return plain objects for performance (no Mongoose overhead)
        .lean(),

      // Count total matching documents for pagination metadata
      Note.countDocuments(queryFilter)
    ]);

    // Send structured response with pagination metadata
    return res.status(200).json({
      notes,
      page: currentPage,
      limit: pageLimit,
      total: totalDocuments,

      // Indicates if more pages are available
      hasMore: documentsToSkip + notes.length < totalDocuments
    });

  } catch (error) {
    // Log error internally for debugging
    //console.error("Error in getPublicCategoryNotes:", error);

    // Return generic error response to client
    return res.status(500).json({
      error: "Failed to fetch public notes"
    });
  }
};

export const getNotesById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Access control: if private, only owner can see it
    if (note.isPrivate) {
      const viewerId = req.user?._id?.toString();
      const ownerId = note.user?.toString();

      if (viewerId !== ownerId) {
        return res.status(403).json({
          error: "This note is private and cannot be viewed by others."
        });
      }
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

export const getCategoryNotes = async (req, res) => {
  const { id } = req.params;

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  try {
    const [notes, total] = await Promise.all([
      Note.find({ category: id, user: req.user._id })
        .select("_id title updatedAt tags")
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Note.countDocuments({ category: id, user: req.user._id }),
    ]);

    res.json({
      notes,
      page,
      limit,
      total,
      hasMore: skip + notes.length < total,
    });
  } catch (err) {
    //console.error("Error in getCategoryNotes:", err);
    res.status(500).json({
      error: "Failed to fetch category notes",
    });
  }
};

export const getMyNotesPaginated = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 15, 50);
    const search = req.query.search?.trim();

    const query = { user: userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v")
      .lean();

    res.status(200).json({
      notes,
      page,
      limit,
      hasMore: notes.length === limit,
    });
  } catch (err) {
    //console.error("getMyNotesPaginated error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const pinNote = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findByIdAndUpdate(id, { isPinned: true }, { new: true })
  res.json(note)
}

export const getUserNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    const query = { user: userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const [notes, total] = await Promise.all([
      Note.find(query)
        .select("_id title updatedAt category isPinned isPrivate")
        .populate({
          path: "category",
          select: "name categoryType",
          populate: { path: "categoryType", select: "name" },
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Note.countDocuments(query),
    ]);

    res.json({
      notes,
      page,
      limit,
      total,
      hasMore: skip + notes.length < total,
    });
  } catch (err) {
    //console.error("Error in getUserNotes:", err);
    res.status(500).json({
      error: "Failed to fetch user notes",
    });
  }
};


export const getPublicNotesbyUser = async (req, res) => {
  const userId = req.params.userId;
  const notes = await Note.find({ user: userId, isPrivate: false }).populate({
    path: "category",
    populate: { path: "categoryType", select: "name" },
  });
  res.json(notes)
}

export const getAllPublicNotes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const query = { isPrivate: false };
    if (search && typeof search === 'string') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const notes = await Note.find(query)
      .select('title content user category createdAt')
      .populate({
        path: "category",
        select: "name categoryType",
        populate: { path: "categoryType", select: "name" },
      })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit)
      .lean();
    res.json(notes)
  } catch (error) {
    //console.error('Error fetching public notes:', error);
    res.status(500).json({ error: 'Failed to fetch public notes' });
  }
}

export const getRandomPublicNotes = async (req, res) => {
  try {
    const notes = await Note.aggregate([
      { $match: { isPrivate: false } },
      { $group: { 
          _id: "$category", 
          note: { $first: "$$ROOT" } 
      } },
      { $sample: { size: 10 } },
      { $replaceRoot: { newRoot: "$note" } }
    ]);

    const populatedNotes = await Note.populate(notes, [
      { path: 'user', select: 'username' },
      { 
        path: 'category', 
        select: 'name categoryType',
        populate: { path: 'categoryType', select: 'name' }
      }
    ]);

    res.json(populatedNotes);
  } catch (error) {
    //console.error('Error fetching random public notes:', error);
    res.status(500).json({ error: 'Failed to fetch random public notes' });
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
        .select('title user category createdAt tags')
        .populate({
          path: "category",
          select: "name categoryType",
          populate: { path: "categoryType", select: "name" },
        })
        .populate('user', 'username profileImage email')
        .sort({ createdAt: -1 });
      return res.json(notes);
    } catch (error) {
      //console.error('Error fetching notes by tag:', error);
      return res.status(500).json({ error: 'Failed to fetch notes by tag' });
    }
  } else {
    // fallback: return all public notes (for search page)
    try {
      const notes = await Note.find({ isPrivate: false })
        .select('title user category createdAt tags')
        .populate('category', 'name')
        .populate('user', 'username profileImage email')
        .sort({ createdAt: -1 });
      return res.json(notes);
    } catch (error) {
      //console.error('Error fetching public notes:', error);
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
    //console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const getMyTags = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = "" } = req.query;

    const notes = await Note.find(
      { user: req.user._id },
      "tags"
    ).lean();

    const tagCounts = {};

    notes.forEach(n => {
      (n.tags || []).forEach(tag => {
        const key = tag.toLowerCase();
        tagCounts[key] = (tagCounts[key] || 0) + 1;
      });
    });

    let tags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .filter(t =>
        search
          ? t.tag.includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

    const start = (page - 1) * limit;
    const paginated = tags.slice(start, start + limit);

    res.json({
      tags: paginated,
      hasMore: start + limit < tags.length,
    });
  } catch (err) {
    //console.error("getMyTags error:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

/**
 * Unified note creation handler for both normal and .md file uploads.
 * If req.body.category looks like an ObjectId, treat as category ID (for .md upload).
 * Otherwise, treat as category name (for normal note creation).
 */
export const createNote = async (req, res) => {
  try {
    // ===== tiered rate limiting (optimized for bulk uploads) =====
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const notesLastHour = await Note.countDocuments({
      user: req.user._id,
      createdAt: { $gte: oneHourAgo },
    });

    const isPro = req.user.isPro || req.user.isPremium; // Handle both for now
    const limit = isPro ? 2000 : 50;
    const noteTextlimit = isPro ? 200000 : 30000;


    if (notesLastHour >= limit) {
      return res.status(429).json({ 
        error: `Hourly upload limit reached (max ${limit} notes/hour for ${isPro ? "Pro" : "Normal"} users).` 
      });
    }

    // ===== input =====
    const { title, content, category, tags, type, isPrivate } = req.body;

    // ===== TEXT LIMIT CHECK =====
    if (content && content.length > noteTextlimit) {
      return res.status(400).json({
        error: `Content too long (max ${noteTextlimit} characters for ${isPro ? "Pro" : "Normal"} users).`
      });
    }

    let categoryDoc = null;

    // ===== resolve category =====
    if (typeof category === "string" && category.match(/^[0-9a-fA-F]{24}$/)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({
        name: category,
        user: req.user._id,
      });
    }

    // ===== resolve / create category type =====
    let categoryTypeDoc = null;

    if (type && typeof type === "string") {
      categoryTypeDoc = await CategoryType.findOneAndUpdate(
        { name: type, user: req.user._id },
        { name: type, user: req.user._id },
        { upsert: true, new: true }
      );
    }

    // ===== create category if needed =====
    if (!categoryDoc) {
      categoryDoc = new Category({
        name: category,
        user: req.user._id,
        type: type || undefined,                 // legacy
        categoryType: categoryTypeDoc?._id,      // normalized
      });

      await categoryDoc.save();

      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { categories: categoryDoc._id },
      });
    }

    // ===== create note =====
    const note = new Note({
      title,
      content,
      category: categoryDoc._id,
      user: req.user._id,
      isPrivate: !!isPrivate,
      tags: Array.isArray(tags)
        ? tags.map(t => t.trim()).filter(Boolean)
        : [],
    });

    await note.save();

    await Category.findByIdAndUpdate(categoryDoc._id, {
      $addToSet: { notes: note._id },
    });

    res.status(201).json(note);
  } catch (error) {
    //console.error("Error creating note:", error);
    res.status(500).json({
      error: "Failed to create note",
      details: error.message,
    });
  }
};

// For backward compatibility, alias createNoteFromMD to createNote
export const createNoteFromMD = createNote;

export const bulkAddTags = async (req, res) => {
  try {
    const { noteIds, tags } = req.body;
    
    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ error: "No notes provided for tagging" });
    }
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "No tags provided" });
    }

    const cleanTags = tags.map(tag => typeof tag === "string" ? tag.trim().toLowerCase() : "").filter(Boolean);

    if (cleanTags.length === 0) {
      return res.status(400).json({ error: "Invalid tags provided" });
    }

    const updateResult = await Note.updateMany(
      { _id: { $in: noteIds }, user: req.user._id },
      { $addToSet: { tags: { $each: cleanTags } } }
    );

    res.json({
      message: "Tags added successfully",
      modifiedCount: updateResult.modifiedCount
    });

  } catch (error) {
    //console.error("Error bulk adding tags:", error);
    res.status(500).json({
      error: "Failed to bulk add tags",
      details: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params
  try {
    // Only allow updating tags if provided
    const updateData = { ...req.body };
    if (updateData.tags) {
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags.map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    }
    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    )
    if (!note) {
      return res.status(404).json({ error: "Note not found or authorized" });
    }
    res.json(note);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.title && error.keyPattern.user) {
      return res.status(400).json({ error: 'You already have a note with this title. Note titles must be unique.' });
    }
    //console.error('Error updating note:', error);
    res.status(500).json({
      error: 'Failed to update note',
      details: error.message
    });
  }
}

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Category.updateOne(
      { _id: note.category },
      { $pull: { notes: note._id } }
    );

    res.json({ message: "Note deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};

export const bulkDeleteNotes = async (req, res) => {
  try {
    const { noteIds } = req.body;
    const userId = req.user._id;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ error: "No notes provided for deletion" });
    }

    // 1. Delete the notes
    const deleteResult = await Note.deleteMany({
      _id: { $in: noteIds },
      user: userId
    });

    // 2. Remove from categories
    await Category.updateMany(
      { notes: { $in: noteIds } },
      { $pull: { notes: { $in: noteIds } } }
    );

    res.json({
      message: `${deleteResult.deletedCount} notes deleted successfully`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    //console.error("Error bulk deleting notes:", error);
    res.status(500).json({
      error: "Failed to bulk delete notes",
      details: error.message,
    });
  }
};

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

export const downloadCategoryZip = async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const userId = req.user._id;
    const isPro = req.user.isPro || req.user.isPremium;

    if (!isPro) {
      return res.status(403).json({ error: "ZIP download is a Pro feature. Please upgrade to Pro." });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId }).populate("name");
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const notes = await Note.find({ category: categoryId, user: userId });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${category.name.replace(/\s+/g, "_")}_notes.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      //console.error("Archive error:", err);
      res.status(500).send({ error: "Failed to generate ZIP" });
    });

    archive.pipe(res);

    notes.forEach((note) => {
      const fileName = `${note.title.replace(/[<>:"/\\|?*]/g, "_")}.md`;
      const content = `---\ntitle: ${note.title}\ntags: ${note.tags.join(", ")}\n---\n\n${note.content}`;
      archive.append(content, { name: fileName });
    });

    await archive.finalize();

  } catch (error) {
    //console.error("Error in downloadCategoryZip:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to download ZIP" });
    }
  }
};

