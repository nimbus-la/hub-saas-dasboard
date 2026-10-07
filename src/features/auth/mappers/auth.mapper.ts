import { AuthSession } from "@/interfaces";
import { LoginContentResponse } from "../interfaces";


export const toSession = ({ user, accessExpiresAt, refreshExpiresAt}: LoginContentResponse): AuthSession => ({
    user,
    accessExpiresAt,
    refreshExpiresAt
})