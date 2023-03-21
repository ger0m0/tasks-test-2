import { createContext } from 'react';
import { ErrorCodes, User } from '../..';

export const AppContext = createContext<{
    // login: (data: { id: string }) => boolean
    url: string
    login: (user: User) => Promise<any>
    logout: () => Promise<any>
    errorCodes: ErrorCodes
    user?: User
}>({
    url: '',
    login: async () => false,
    logout: async () => false,
    errorCodes: {}
});


