export interface IsAuthorInterface {
    isAuthor(offerId: string, authorId: string): Promise<boolean>;
}