export const MongoDBURI = (
    username: string,
    password: string,
    host: string,
    port: string,
    db_name: string
) => `mongodb://${username}:${password}@${host}:${port}/${db_name}?authSource=admin`;