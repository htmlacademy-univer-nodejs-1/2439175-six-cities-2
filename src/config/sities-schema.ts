import convict from "convict";
import { ipaddress } from "convict-format-with-validator";

convict.addFormat(ipaddress);

export type SitiesSchema = {
    PORT: number;
    DB_HOST: string;
    SALT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_PORT: string;
    DB_NAME: string;
    UPLOAD_DIRECTORY: string;
    JWT_SECRET: string;
    HOST: string;
    STATIC_DIRECTORY_PATH: string;
}


export const configSitiesSchema = convict<SitiesSchema>({
    PORT: {
        doc: 'Port for incoming connection',
        format: 'port',
        env: 'PORT',
        default: null,
    },
    SALT: {
        doc: 'Salt for incoming connection',
        format: String,
        default: 'SALT'
    },
    DB_HOST: {
        doc: 'IP-address for incoming connection',
        format: 'ipaddress',
        env: 'DB_HOST',
        default: null,
    },
    DB_USER: {
        doc: 'User for database MongoDB',
        format: String,
        env: 'DB_USER',
        default: null,
    },
    DB_PASSWORD: {
        doc: 'Database pssword for DB_USER',
        format: String,
        env: 'DB_PASSWORD',
        default: null,
    },
    DB_PORT: {
        doc: 'Port for databse connection',
        format: String,
        env: 'DB_PORT',
        default: null,
    },
    DB_NAME: {
        doc: 'MongoDB database name',
        format: String,
        env: 'DB_NAME',
        default: null,
    },
    UPLOAD_DIRECTORY: {
      doc: 'Directory for upload files',
      format: String,
      env: 'UPLOAD_DIRECTORY',
      default: null
    },
    JWT_SECRET: {
        doc: 'Secret for sign JWT',
        format: String,
        env: 'JWT_SECRET',
        default: null
    },
    HOST: {
        doc: 'Host where started service',
        format: String,
        env: 'HOST',
        default: 'localhost'
    },
    STATIC_DIRECTORY_PATH: {
      doc: 'Path to directory with static resources',
      format: String,
      env: 'STATIC_DIRECTORY_PATH',
      default: 'static'
    },
});