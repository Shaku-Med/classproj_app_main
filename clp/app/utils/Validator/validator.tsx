type ValidatorName = "password" | "deviceId"

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