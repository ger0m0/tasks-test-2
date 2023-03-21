export interface Task {
    id: number
    name: string
    email: string
    status: number
    editor: number
    text: string
}
export interface User {
    id: number
    access: number
}
export interface Error {
    code: number
    message: string
}
export interface ErrorCodes {
    [code: string]: Error
}
