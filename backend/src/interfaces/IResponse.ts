import { Response } from 'express';

export interface IResponse extends Response 
{
    payload?: any;
    obj_usuario?: any;
}