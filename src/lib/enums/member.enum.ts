export enum MemberType {
    USER = "USER",
    /**
     * The backend emits "SELLER" (libs/enums/member.enum.ts); the previous
     * "RESTAURANT" value was never returned by any endpoint, so every
     * comparison against it was permanently false. memberType is
     * response-only — no request body or FormData carries it — so this
     * changes nothing that is sent to the server.
     */
    SELLER = "SELLER",
}

export enum MemberStatus {
    ACTIVE = "ACTIVE",
    BLOCK = "BLOCK",
    DELETE = "DELETE",

}