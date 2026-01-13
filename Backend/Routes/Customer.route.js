import express from 'express';
import { Delete, GetPerson, Register, Update } from '../Controller/customer.controller.js';

export const CustomerRouter=express.Router();

CustomerRouter.post('/register',Register);
CustomerRouter.put('/:id/update',Update);
CustomerRouter.delete('/:id/delete',Delete);
CustomerRouter.get('/get-persons',GetPerson);