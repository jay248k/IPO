import express from 'express';
import { Admin, GetProfile, ResetProfile } from '../Controller/Admin.controller.js';

export const AdminRouter=express.Router();

AdminRouter.post('/register',Admin)
AdminRouter.get('/profile',GetProfile)
AdminRouter.get('/profile/reset',ResetProfile)