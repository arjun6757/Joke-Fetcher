import express from "express"
import { handler } from "../controllers/api.controller.js"

const router = express.Router()

router.get('/joke/:category', handler)

export default router