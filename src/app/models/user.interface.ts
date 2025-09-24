export interface Usuario {
    token: string,
    user: {
        uid: string
        name: string,
        email: string,
    }
}