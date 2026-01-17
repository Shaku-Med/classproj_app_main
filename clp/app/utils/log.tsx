type LogType = 'info' | 'error' | 'warning' | 'debug' | 'trace' | 'fatal' | 'success';

type LogDetail = unknown;

interface LogOptions {
    type: LogType;
    message: LogDetail;
    details?: LogDetail[];
    error?: Error;
}

export const log = ({ type, message, details, error }: LogOptions) => {
    // console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
    // console.log('\x1b[33m%s\x1b[0m', message);  //yellow
    const logByType: Record<LogType, (...args: unknown[]) => void> = {
        info: console.info.bind(console),
        error: console.error.bind(console),
        warning: console.warn.bind(console),
        debug: console.debug.bind(console),
        trace: console.trace.bind(console),
        fatal: console.error.bind(console),
        success: console.log.bind(console),
    }

    const formatted = formatLogMessage({
        type,
        message,
        details: [
            ...(details ?? []),
            ...(error ? [error, ...(error.stack ? [error.stack] : [])] : []),
        ],
    })

    const style = getLogStyle(type)
    const logFn = logByType[type]

    if (isBrowser()) {
        logFn(`%c${formatted}`, style.css)
    } else {
        logFn(`${style.ansi}${formatted}${style.reset}`)
    }
}

const isBrowser = () => typeof window !== 'undefined'

const getLogStyle = (type: LogType) => {
    const reset = '\x1b[0m'
    const styles: Record<LogType, { ansi: string; css: string }> = {
        info: { ansi: '\x1b[36m', css: 'color:#00bcd4' },
        error: { ansi: '\x1b[31m', css: 'color:#f44336' },
        warning: { ansi: '\x1b[33m', css: 'color:#ff9800' },
        debug: { ansi: '\x1b[35m', css: 'color:#9c27b0' },
        trace: { ansi: '\x1b[90m', css: 'color:#9e9e9e' },
        fatal: { ansi: '\x1b[41m\x1b[37m', css: 'background:#b71c1c;color:#fff' },
        success: { ansi: '\x1b[32m', css: 'color:#4caf50' },
    }

    return { ...styles[type], reset }
}

const formatLogMessage = ({
    type,
    message,
    details,
}: {
    type: LogType
    message: LogDetail
    details?: LogDetail[]
}) => {
    const parts: LogDetail[] = [message, ...(details ?? [])]
    const formatted = parts.map(formatLogPart).filter(Boolean).join(' ')
    return sanitizeForLog(`[${type.toUpperCase()}] ${formatted}`)
}

const formatLogPart = (part: LogDetail) => {
    if (part instanceof Error) {
        return part.message || 'Error'
    }
    if (typeof part === 'string') {
        return part
    }
    return safeStringify(part)
}

const sanitizeForLog = (value: string) =>
    value
        .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
        .replace(/[\r\n]+/g, ' ')

const safeStringify = (value: unknown) => {
    try {
        const seen = new WeakSet()
        return JSON.stringify(value, (_key, val) => {
            if (typeof val === 'object' && val !== null) {
                if (seen.has(val)) {
                    return '[Circular]'
                }
                seen.add(val)
            }
            if (typeof val === 'bigint') {
                return `${val}n`
            }
            return val
        })
    } catch {
        return String(value)
    }
}