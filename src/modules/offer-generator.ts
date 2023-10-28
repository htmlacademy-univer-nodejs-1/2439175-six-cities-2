import { OfferGeneratorInterface } from "./offer-generator.interface";
import { MockData } from "../types/mock-data.type";
import {generateRandomInt, getRandomItem, getRandomItems} from "../../helpers/random_data.js";

export class OfferGenerator implements OfferGeneratorInterface {
    constructor(private readonly mockData: MockData) {}

    generate(): string {
        const header = getRandomItem(this.mockData.header);
        const description = getRandomItem(this.mockData.description);
        const publication_date = getRandomItem(this.mockData.publication_date);
        const preview = getRandomItem(this.mockData.preview); 
        const photoes = getRandomItem(this.mockData.photoes).join(',');
        const is_premium = generateRandomInt(0, 10) % 2;
        const is_favourite = generateRandomInt(0, 10) % 2;
        const type = getRandomItem(this.mockData.type);
        const extras = getRandomItems(this.mockData.extras).join(',');
        const rooms_amount = generateRandomInt(1, 8);
        const guests_amount = generateRandomInt(1, 10);
        const cost = generateRandomInt(100, 100000);
        const author = getRandomItem(this.mockData.author);
        const city = getRandomItem(this.mockData.city);
        return [header, description, publication_date, 
                preview, photoes, is_premium, is_favourite, type, 
                rooms_amount, guests_amount, cost,extras, author, city].join('\t')
    }
}