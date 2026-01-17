import { log } from '../log'

export const EnvValidator = (env: string) => {
    try {
        if(!process.env[env] && !import.meta.env[env]) return null;
        return process.env[env] || import.meta.env[env] || null;
    }
    catch (error) {
        log({
            type: 'error',
            message: 'Error Found in EnvValidator',
            error: error instanceof Error ? error : new Error(String(error)),
        })
        return null;
    }
}
