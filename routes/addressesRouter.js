import express from 'express';
import { updateLearner } from '../controllers/users/learnersController.js';
import { createAddress, deleteAddress, getAddress, getAllAddresses, updateAddress } from '../controllers/addressesController.js';
const router = express.Router();

router.route('/').get(getAllAddresses).post(createAddress);
router.route('/:id').get(getAddress).patch(updateAddress).delete(deleteAddress);
export default router;