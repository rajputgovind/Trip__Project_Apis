import express from 'express'
import { createPrice, deletePrice, getAllPrices } from '../controllers/priceController.js'
import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'

const PriceRouter = express.Router()


PriceRouter.post("/create-price",auth,checkAdmin,createPrice)
PriceRouter.get("/get-all-prices",getAllPrices)
PriceRouter.delete("/delete-price/:id",auth,checkAdmin,deletePrice)


export default PriceRouter