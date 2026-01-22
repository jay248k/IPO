import express from 'express';
import { Delete, GetPerson, Register, UnfiledList, Update } from '../Controller/Customer.controller.js';

export const CustomerRouter=express.Router();

CustomerRouter.post('/register',Register);
CustomerRouter.put('/:id/update',Update);
CustomerRouter.delete('/:id/delete',Delete);
CustomerRouter.get('/get-persons',GetPerson);
CustomerRouter.get('/:id/person',UnfiledList);