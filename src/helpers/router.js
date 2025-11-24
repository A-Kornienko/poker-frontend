const getDomain = () => {
    return 'http://poker.test'
}

const getPrefixApi = () => {
    return '/api/'
}

export const getApiRoute = (route) => {
    return getDomain() + getPrefixApi() + route
}