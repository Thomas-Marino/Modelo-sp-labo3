import { Request } from 'express';

export interface IRequest extends Request 
{
    payload?: any;
    obj_usuario?: any;
}