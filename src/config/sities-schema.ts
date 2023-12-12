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
}

const generateRandomString = (): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 256; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
        default: generateRandomString()
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
});