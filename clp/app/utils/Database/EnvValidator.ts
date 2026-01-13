export const EnvValidator = (env: string) => {
    try {
        if(!process.env[env] && !import.meta.env[env]) return null;
        return process.env[env] || import.meta.env[env] || null;
    }
    catch (error) {
        console.log(`Error Found in EnvValidator: --- `, error)
        return null;
    }
}
