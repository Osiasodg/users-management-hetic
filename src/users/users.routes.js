import { Router } from 'express';
import { handleCreateUser, handleListUsers, handleGetUserById, handleDeleteUser,handleUpdateUser,handleSearchUserByEmail,handleCountUsers,handleUpdatePassword,handleBulkCreateUsers} from './users.controlers.js';

const router = Router();

//users
router.post("/bulk", handleBulkCreateUsers);
router.post('/', handleCreateUser);

//get
router.get("/count", handleCountUsers); 
router.get('/', handleListUsers);
router.get("/search", handleSearchUserByEmail); 
router.get('/:id', handleGetUserById);

//Delete
router.delete('/:id', handleDeleteUser);

//Patch
router.patch("/:id/password", handleUpdatePassword);
router.patch('/:id', handleUpdateUser);


export default router;