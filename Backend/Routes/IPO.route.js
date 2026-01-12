import express from 'express';
import { IPOfillup, Register, UpdateIPO } from '../Controller/IPO.controller.js';

export const IPORouter=express.Router();

IPORouter.post('/register',Register)
IPORouter.put('/:id/update',UpdateIPO)
IPORouter.post('/:ipo/:customer/fillup',IPOfillup)