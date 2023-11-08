import { OfferGeneratorInterface } from "./offer-generator.interface";
import { MockData } from "../types/mock-data.type";
import { generateRandomInt, getRandomItem, getRandomFloat } from "../../helpers/random_data.js";

export class OfferGenerator implements OfferGeneratorInterface {
    constructor(private readonly mockData: MockData | Record<string, any>) { }

    generate(): string {
        const room_amount_rand = generateRandomInt(1, 4);
        const guest_rand = generateRandomInt(1,6);
        const header = getRandomItem(this.mockData.header);
        const description = getRandomItem(this.mockData.description);
        const publication_date = getRandomItem(this.mockData.publication_date);
        const preview = getRandomItem(this.mockData.preview);
        const photoes = this.mockData.photoes.join(';');
        const is_premium = getRandomItem(["true", "false"]);
        const is_favourite = getRandomItem(["true", "false"]);
        const rating = getRandomFloat(1, 5, 1);
        const type = getRandomItem(this.mockData.type);
        const extras = this.mockData.extras.join(';');
        const rooms_amount = room_amount_rand > 0 ? room_amount_rand : 1;
        const guests_amount = guest_rand > 0 ? guest_rand : 1;
        const cost = generateRandomInt(100, 100000);
        const city = getRandomItem(this.mockData.city);
        const firstname = getRandomItem(this.mockData.firstname)
        const user_type = getRandomItem(this.mockData.user_type);
        const email = getRandomItem(this.mockData.email);
        const avatar = getRandomItem(this.mockData.avatar);
        return [header, description, publication_date, city,
            preview, photoes, is_premium, is_favourite, rating, type,
            rooms_amount, guests_amount, cost, extras, firstname, email, avatar, user_type].join('\t')
    }
}