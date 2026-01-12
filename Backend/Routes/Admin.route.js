import express from 'express';
import { Admin } from '../Controller/Admin.controller.js';

export const AdminRouter=express.Router();

AdminRouter.post('/register',Admin)