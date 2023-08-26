import { ENV_VARS } from "../Config"
export const env_vars = Object.keys(process.env).filter(key=>ENV_VARS.includes(key)).reduce(key=>{
    key:process.env[key]
})