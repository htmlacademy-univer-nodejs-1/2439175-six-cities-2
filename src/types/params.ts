import {ParamsDictionary} from "express-serve-static-core";

export type ParamsOfferDetails = {
    offerId: string;
} | ParamsDictionary

export type UnknownRecord = Record<string, any>;