const getDomain = (): string => {
    return 'http://poker.test'
}

const getPrefixApi = (): string => {
    return '/api/'
}

export const getApiRoute = (route: string): string => {
    return getDomain() + getPrefixApi() + route
}