import { log } from '../../../../log'

export const EnvValidator = (env: string) => {
    try {
        log({ type: 'debug', message: 'EnvValidator import.meta.env', details: [import.meta.env[env]] })
        if(!process.env[env]) return null;
        return process.env[env] || null;
    }
    catch (error) {
        log({
            type: 'error',
            message: 'Error Found in EnvValidator.tsx',
            error: error instanceof Error ? error : new Error(String(error)),
        })
        return null;
    }
}