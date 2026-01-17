type ValidatorName =
    | "password"
    | "deviceId"
    | "username"
    | "name"
    | "account_name"
    | "date_of_birth"
    | "optional_name"

export type SingleValidatorConfig = {
    value: unknown
    type?: ValidatorName | ValidatorName[]
    required?: boolean
    custom?:
        | ((value: unknown) => boolean | string)
        | Array<(value: unknown) => boolean | string>
    override?:
        | ((value: unknown) => boolean | string)
        | Array<(value: unknown) => boolean | string>
}

export type ValidatorResult = {
    valid: boolean
    errors: string[]
}

type InternalValidator = (value: unknown) => string | null

const builtInValidators: Record<ValidatorName, InternalValidator> = {
    password: (value) => {
        if (typeof value !== "string") return "Invalid password"
        const v = value.trim()
        if (v.length < 8) return "Password too short"
        if (v.length > 128) return "Password too long"
        if (!/[a-z]/.test(v)) return "Password must contain a lowercase letter"
        if (!/[A-Z]/.test(v)) return "Password must contain an uppercase letter"
        if (!/[0-9]/.test(v)) return "Password must contain a number"
        if (!/[^A-Za-z0-9]/.test(v)) return "Password must contain a symbol"
        return null
    },
    deviceId: (value) => {
        if (typeof value !== "string") return "Invalid device id"
        const v = value.trim()
        if (v.length !== 64) return "Invalid device id length"
        if (!/^[0-9a-fA-F]{64}$/.test(v)) return "Invalid device id format"
        return null
    },
    username: (value) => {
        if (typeof value !== "string") return "Invalid username"
        const v = value.trim()
        if (v.length < 3) return "Username too short"
        if (v.length > 30) return "Username too long"
        if (!/^[A-Za-z0-9._-]+$/.test(v)) return "Invalid username format"
        return null
    },
    name: (value) => {
        if (typeof value !== "string") return "Invalid name"
        const v = value.trim()
        if (v.length < 1) return "Name too short"
        if (v.length > 50) return "Name too long"
        if (!/^[A-Za-z\s'-]+$/.test(v)) return "Invalid name format"
        return null
    },
    optional_name: (value) => {
        if (value === null || value === undefined || value === "") return null
        if (typeof value !== "string") return "Invalid name"
        const v = value.trim()
        if (v.length < 1) return "Name too short"
        if (v.length > 50) return "Name too long"
        if (!/^[A-Za-z\s'-]+$/.test(v)) return "Invalid name format"
        return null
    },
    account_name: (value) => {
        if (value === null || value === undefined || value === "") return null
        if (typeof value !== "string") return "Invalid account name"
        const v = value.trim()
        if (v.length < 3) return "Account name too short"
        if (v.length > 50) return "Account name too long"
        if (!/^[A-Za-z0-9\s_-]+$/.test(v)) return "Invalid account name format"
        return null
    },
    date_of_birth: (value) => {
        if (typeof value !== "string") return "Invalid date of birth"
        const v = value.trim()
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Invalid date of birth format"
        const date = new Date(`${v}T00:00:00.000Z`)
        if (Number.isNaN(date.getTime())) return "Invalid date of birth"
        const today = new Date()
        const min = new Date()
        min.setUTCFullYear(today.getUTCFullYear() - 120)
        const max = new Date()
        max.setUTCFullYear(today.getUTCFullYear() - 13)
        if (date < min || date > max) return "Invalid date of birth range"
        return null
    },
}

function normalizeFns(
    fn?:
        | ((value: unknown) => boolean | string)
        | Array<(value: unknown) => boolean | string>
): Array<(value: unknown) => string | null> {
    if (!fn) return []
    const fns = Array.isArray(fn) ? fn : [fn]
    return fns.map((f) => {
        return (value: unknown) => {
            const result = f(value)
            if (typeof result === "string") return result || null
            return result ? null : "Validation failed"
        }
    })
}

function runSingle(config: SingleValidatorConfig): ValidatorResult {
    const errors: string[] = []
    const { value, required, type, custom, override } = config

    if (required) {
        if (
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "")
        ) {
            return { valid: false, errors: ["Value is required"] }
        }
    }

    const validators: Array<(value: unknown) => string | null> = []

    if (override) {
        validators.push(...normalizeFns(override))
    } else {
        if (type) {
            const types = Array.isArray(type) ? type : [type]
            types.forEach((t) => {
                validators.push((v: unknown) => builtInValidators[t](v))
            })
        }
        validators.push(...normalizeFns(custom))
    }

    for (const v of validators) {
        const msg = v(value)
        if (msg) errors.push(msg)
    }

    return { valid: errors.length === 0, errors }
}

export function validator(
    config: SingleValidatorConfig | SingleValidatorConfig[]
): ValidatorResult | ValidatorResult[] {
    if (Array.isArray(config)) return config.map((c) => runSingle(c))
    return runSingle(config)
}