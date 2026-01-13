import express from 'express';
import { AllIPOs, AllotmatStatus, DeActive, IPOfilled, IPOfillup, Register, UpdateIPO } from '../Controller/IPO.controller.js';

export const IPORouter=express.Router();

IPORouter.post('/register',Register)
IPORouter.put('/:id/update',UpdateIPO)
IPORouter.post('/:ipo/:customer/fillup',IPOfillup)
IPORouter.put('/:id/update/status',AllotmatStatus)
IPORouter.get('/all-ipos',AllIPOs)
IPORouter.get('/:id/get-all/filed',IPOfilled)
IPORouter.post('/:id/de-active',DeActive)