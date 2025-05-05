import express from 'express';
import {
    createStockOpname,
    getAllStockOpnames,
} from '../controller/StockOpnameController.js';

const router = express.Router();

router.post('/create', createStockOpname);
router.get('/', getAllStockOpnames);