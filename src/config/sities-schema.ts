import convict from "convict";
import { ipaddress } from "convict-format-with-validator";

convict.addFormat(ipaddress);

export type SitiesSchema = {
    PORT: number;
    IP: string;
    SALT: string;
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
    IP: {
        doc: 'IP-address for incoming connection',
        format: 'ipaddress',
        env: 'IP',
        default: null,
    },
})