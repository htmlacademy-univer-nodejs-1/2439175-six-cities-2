import { Request } from "express";
import {ParamsDictionary} from "express-serve-static-core";
import { LoginUserDTO } from "../modules/user/dto/login-user.dto";

export type ParamsOfferDetails = {
    offerId: string;
} | ParamsDictionary

export type ParamsCountForOFfer = {
    count: string;
}| ParamsDictionary

export type UnknownRecord = Record<string, any>;

export type RequestParams = Record<string, unknown>;

export type RequestBody = Record<string, unknown>;

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDTO>;