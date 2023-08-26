import { ENV_VARS } from "../Constants/global.constants.ts"
export const env_vars = ENV_VARS.reduce((result, key) => {
    if (process.env[key]) {
        result[key] = process.env[key];
    }
    return result;
}, {});


