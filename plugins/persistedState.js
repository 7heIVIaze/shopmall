import createPersistedState from "vuex-persistedstate"
import * as Cookies from "js-cookie"
import cookie from "cookie"
import { Cookie } from "express-session"

export default ( {store, req }) => {
    createPersistedState({
        path: ["example"],
        storage: {
            getItem: (key) => {
                if(process.server) {
                    console.log(req.headers.cookie)
                    const parsedCookies = cookie.parse(req.headers.cookie)
                    return parsedCookies[key]
                }
                else {
                    return Cookie.get(key)
                }
            },

            setItem: (key, value) => {
                Cookies.set(key, value, { expires: 365, secure: false })
            },

            removeItem: (key) => Cookies.remove(key)
        }
    })(store)
}