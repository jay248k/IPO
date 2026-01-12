import express from 'express';
import { Delete, Register, Update } from '../Controller/customer.controller.js';

export const CustomerRouter=express.Router();

CustomerRouter.post('/register',Register);
CustomerRouter.put('/:id/update',Update);
CustomerRouter.delete('/:id/delete',Delete);