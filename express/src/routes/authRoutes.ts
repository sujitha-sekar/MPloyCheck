import { Router } from 'express';
import { login, getUserDetails, getRecords, getAllUsers, addUser, updateUser, deleteUser } from '../controllers/authController';

const router = Router();

router.post('/auth/login', login);
router.get('/user-details', getUserDetails);
router.get('/records', getRecords);
router.get('/users', getAllUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export { router };