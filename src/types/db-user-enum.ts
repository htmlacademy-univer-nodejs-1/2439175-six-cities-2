export enum UserType {
    Pro = 'Pro',
    Base = 'Base',
    Default = 'Default',
}

export function getUserTypeEnum(type: string): UserType {
    if (Object.values(UserType).includes(type as UserType)) {
        return UserType[type as keyof typeof UserType];
    } else {
        return UserType.Default;
    }
}