import { redirect } from "react-router"

export const handleRedirect = (endpoint: string, request?: Request) => {
    let search_params = null
    if(request) {
        search_params = request.url.split('?')[1]
    }
    return redirect(`${search_params ? `${endpoint}?${search_params}` : `${endpoint}`}`, 302)
}

export const getRedirectUrl = (endpoint: string, request?: Request) => {
    let search_params = null
    if(request) {
        search_params = request.url.split('?')[1]
    }
    return `${search_params ? `${endpoint}?${search_params}` : `${endpoint}`}`
}