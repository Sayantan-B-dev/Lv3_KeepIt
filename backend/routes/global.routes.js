
import express from "express"
import {
    getAllCategories,
    getAllNotes
} from "../controllers/global.controller.js"





const router=express.Router()

router.route('/all-categories').get(getAllCategories)
router.route('/all-notes').get(getAllNotes)

//router.route('/my-profile').get(myProfile)


export default router