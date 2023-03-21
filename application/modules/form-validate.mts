export const emailValidate = (email: string) => {
    return (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]+?$/)) ? true : false
}
export const escaping = (text: string) => {
    return text.replace(/[\\$'"]/g, "\\$&")
}