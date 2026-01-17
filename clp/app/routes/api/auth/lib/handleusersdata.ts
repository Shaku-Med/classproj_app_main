import db from "~/utils/Database/Supabase"
import SetToken from "~/utils/Security/unsharedkeyEncryption/Combined/Verification/SetToken"
import { handleLogin } from "~/routes/api/auth/lib/handle-login"

type ThirdPartyUserData = {
  email?: string | null
  username?: string | null
  fullName?: string | null
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  accountName?: string | null
  picture?: string | null
}

type UserPayload = {
  id: string
  email: string
  xs?: string
  username: string
  date_of_birth: string
  first_name: string
  middle_name: string | null
  last_name: string
  account_name: string | null
}

type AccountTypePayload = {
  id: string
  role: string
  is_verified: boolean
  is_third_party: boolean
  third_party_name: string | null
  expires_at: string | null
}

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const createThirdPartyAccessToken = async (userId: string, request?: Request) => {
  if (!request?.headers) {
    return null
  }
  const token = await SetToken(
    request.headers,
    {
      expiresIn: "30m",
      algorithm: "HS512",
    },
    ["third_party_key"],
    { user_id: userId },
  )
  return token?.data || null
}

const toClientUser = (user: UserPayload) => ({
  username: user.username,
  date_of_birth: user.date_of_birth,
  first_name: user.first_name,
  middle_name: user.middle_name,
  last_name: user.last_name,
  account_name: user.account_name,
})

const sanitizeName = (value: string) =>
  value.replace(/[^A-Za-z\s'-]/g, "").replace(/\s+/g, " ").trim()

const sanitizeUsername = (value: string) =>
  value.replace(/[^A-Za-z0-9._-]/g, "").trim()

const sanitizeAccountName = (value: string) =>
  value.replace(/[^A-Za-z0-9\s_-]/g, "").replace(/\s+/g, " ").trim()

const formatDate = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const defaultDateOfBirth = () => {
  const date = new Date()
  date.setUTCFullYear(date.getUTCFullYear() - 18)
  return formatDate(date)
}

const buildBaseUsername = (data: ThirdPartyUserData) => {
  const emailSeed = data.email?.split("@")[0] || ""
  return (
    data.username ||
    emailSeed ||
    data.fullName ||
    data.accountName ||
    [data.firstName, data.lastName].filter(Boolean).join(" ")
  )
}

const buildNames = (data: ThirdPartyUserData) => {
  const first = sanitizeName(data.firstName || "")
  const middle = sanitizeName(data.middleName || "")
  const last = sanitizeName(data.lastName || "")
  if (first && last) {
    return { first, middle: middle || null, last }
  }
  const full = sanitizeName(data.fullName || data.accountName || "")
  if (full) {
    const parts = full.split(" ").filter(Boolean)
    const derivedFirst = parts[0] || "User"
    const derivedLast = parts.slice(1).join(" ") || "Account"
    return {
      first: derivedFirst,
      middle: null,
      last: derivedLast,
    }
  }
  return { first: "User", middle: null, last: "Account" }
}

const buildAccountName = (data: ThirdPartyUserData, names: { first: string; last: string }) => {
  const candidate = data.accountName || data.fullName || `${names.first} ${names.last}`
  const sanitized = sanitizeAccountName(candidate)
  if (!sanitized || sanitized.length < 3 || sanitized.length > 50) {
    return null
  }
  return sanitized
}

const buildUsernameWithSuffix = (seed: string) => {
  const sanitized = sanitizeUsername(seed) || "user"
  const suffix = String(Math.floor(1000 + Math.random() * 9000))
  const maxBaseLength = Math.max(3, 30 - suffix.length)
  const base = sanitized.slice(0, maxBaseLength)
  return `${base}${suffix}`.toLowerCase()
}

const normalizeThirdPartyName = (value: string) => {
  const normalized = sanitizeAccountName(value).toLowerCase()
  if (normalized.length >= 2 && normalized.length <= 50) {
    return normalized
  }
  return "third_party"
}

const toUserPayload = (data: ThirdPartyUserData): Omit<UserPayload, "id"> => {
  const email = (data.email || "").trim().toLowerCase()
  const names = buildNames(data)
  const username = buildUsernameWithSuffix(buildBaseUsername(data))
  const accountName = buildAccountName(data, names)
  return {
    email,
    username,
    date_of_birth: defaultDateOfBirth(),
    first_name: names.first,
    middle_name: names.middle,
    last_name: names.last,
    account_name: accountName,
  }
}

const selectUserFields =
  "id,xs,email,username,date_of_birth,first_name,middle_name,last_name,account_name"
const selectAccountFields =
  "id,role,is_verified,is_third_party,third_party_name,expires_at"

const createAccountType = async (userId: string, type: string) => {
  const { data, error } = await db
    .from("user_account_type")
    .insert({
      id: userId,
      is_third_party: true,
      third_party_name: normalizeThirdPartyName(type),
    })
    .select(selectAccountFields)
    .single()

  if (error) {
    throw error
  }

  return data as AccountTypePayload
}

const createUserSettings = async (userId: string) => {
  const { error } = await db
    .from("user_settings")
    .insert({ id: userId })
    .single()

  if (error) {
    throw error
  }
}

const findExistingUser = async (email?: string, username?: string) => {
  const filters: string[] = []
  if (email) {
    filters.push(`email.ilike.${email}`)
  }
  if (username) {
    filters.push(`username.ilike.${username}`)
  }
  if (!filters.length) {
    return null
  }

  const { data, error } = await db
    .from("users")
    .select(selectUserFields)
    .or(filters.join(","))
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as UserPayload | null) || null
}

const findAccountType = async (userId: string) => {
  const { data, error } = await db
    .from("user_account_type")
    .select(selectAccountFields)
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as AccountTypePayload | null) || null
}

const insertUserWithRetries = async (payload: Omit<UserPayload, "id">) => {
  let lastError: unknown = null
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const username =
      attempt === 0 ? payload.username : buildUsernameWithSuffix(payload.username)
    const { data, error } = await db
      .from("users")
      .insert({ ...payload, username })
      .select(selectUserFields)
      .single()

    if (!error && data) {
      return data as UserPayload
    }
    lastError = error
  }
  throw lastError instanceof Error ? lastError : new Error("Failed to create user")
}

export const handleusersdata = async (
  data: ThirdPartyUserData,
  type: string,
  request?: Request,
) => {
  if (!db) {
    return new Response(null, { status: 500 })
  }

  const email = (data.email || "").trim().toLowerCase()
  const usernameSeed = sanitizeUsername(buildBaseUsername(data))
  const usernameLookup = (usernameSeed || email.split("@")[0] || "user").toLowerCase()

  try {
    const existingUser = await findExistingUser(email || undefined, usernameSeed ? usernameLookup : undefined)
    if (existingUser) {
      const accountType = await findAccountType(existingUser.id)
      if (accountType?.is_verified) {
        if (!request) {
          return jsonResponse({ error: "Unauthorized" }, 401)
        }
        if (!existingUser.xs) {
          return jsonResponse({ error: "Invalid session" }, 500)
        }
        return await handleLogin(request, { xs: existingUser.xs, user_id: existingUser.id })
      }
      const accessToken = await createThirdPartyAccessToken(existingUser.id, request)
      if (!accessToken) {
        return jsonResponse({ error: "Failed to create access token" }, 500)
      }
      return jsonResponse({
        status: "account_not_verified",
        user: toClientUser(existingUser),
        access_token: accessToken,
        third_party: {
          name: normalizeThirdPartyName(type),
          picture: data.picture || null,
        },
      })
    }

    if (!email) {
      return jsonResponse({ error: "email is required" }, 400)
    }

    const userPayload = toUserPayload({ ...data, email })
    const newUser = await insertUserWithRetries(userPayload)
    await createAccountType(newUser.id, type)
    await createUserSettings(newUser.id)
    const accessToken = await createThirdPartyAccessToken(newUser.id, request)
    if (!accessToken) {
      return jsonResponse({ error: "Failed to create access token" }, 500)
    }

    return jsonResponse({
      status: "account_created",
      user: toClientUser(newUser),
      access_token: accessToken,
      third_party: {
        name: normalizeThirdPartyName(type),
        picture: data.picture || null,
      },
    })
  } catch (error) {
    console.error("Third-party user handling failed:", error)
    return jsonResponse({ error: "Failed to handle third-party user" }, 500)
  }
}
