import { useEffect, useMemo, useState } from "react"
import { Form, data, useActionData, useLoaderData, useNavigate, useSubmit } from "react-router"
import { VerifyToken } from "~/utils/Security/unsharedkeyEncryption/Combined/Verification/VerifyToken"
import db from "~/utils/Database/Supabase"
import { log } from "~/utils/log"
import { validator } from "~/utils/Validator/validator"
import { handleLogin } from "~/routes/api/auth/lib/handle-login"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"

type ThirdPartyUser = {
  username: string
  date_of_birth: string
  first_name: string
  middle_name: string | null
  last_name: string
  account_name: string | null
}

const selectUserFields =
  "username,date_of_birth,first_name,middle_name,last_name,account_name"

export const loader = async ({ request }: { request: Request }) => {
  try {
    if (!db) return data(null, { status: 500 })
    const url = new URL(request.url)
    const accessToken = url.searchParams.get("access_token")
    if (!accessToken) return data(null, { status: 400 })

    const tokenData = await VerifyToken(
      {
        token: accessToken,
        addedKeyNames: ["third_party_key"],
      },
      request.headers,
    )

    if (!tokenData || typeof tokenData !== "object") {
      return data(null, { status: 401 })
    }

    const userId = (tokenData as { user_id?: string }).user_id
    if (!userId || typeof userId !== "string") {
      return data(null, { status: 401 })
    }

    const { data: user, error: userError } = await db
      .from("users")
      .select(selectUserFields)
      .eq("id", userId)
      .maybeSingle()

    if (userError) {
      throw userError
    }

    if (!user) {
      return data(null, { status: 404 })
    }

    const { data: accountType, error: accountError } = await db
      .from("user_account_type")
      .select("is_verified")
      .eq("id", userId)
      .maybeSingle()

    if (accountError) {
      throw accountError
    }

    if (!accountType || accountType.is_verified) {
      return data(null, { status: 403 })
    }

    return data({ user }, { status: 200 })
  } catch (error) {
    log({
      type: "error",
      message: "Third-party access loader failed",
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return data(null, { status: 500 })
  }
}

export const action = async ({ request }: { request: Request }) => {
  try {
    if (request.method !== "POST") return data(null, { status: 405 })
    const formData = await request.formData()
    const accessToken = String(formData.get("access_token") || "")

    if (!accessToken) return data(null, { status: 400 })

    const tokenData = await VerifyToken(
      {
        token: accessToken,
        addedKeyNames: ["third_party_key"],
      },
      request.headers,
    )

    if (!tokenData || typeof tokenData !== "object") {
      return data(null, { status: 401 })
    }

    const userId = (tokenData as { user_id?: string }).user_id
    if (!userId || typeof userId !== "string") {
      return data(null, { status: 401 })
    }

    const payload = {
      username: String(formData.get("username") || "").trim(),
      first_name: String(formData.get("first_name") || "").trim(),
      middle_name: String(formData.get("middle_name") || "").trim() || null,
      last_name: String(formData.get("last_name") || "").trim(),
      account_name: String(formData.get("account_name") || "").trim() || null,
      date_of_birth: String(formData.get("date_of_birth") || "").trim(),
    }

    const updatePayload: Partial<typeof payload> = {}
    const hasField = (name: string) => formData.has(name)
    if (hasField("username")) updatePayload.username = payload.username
    if (hasField("first_name")) updatePayload.first_name = payload.first_name
    if (hasField("middle_name")) updatePayload.middle_name = payload.middle_name
    if (hasField("last_name")) updatePayload.last_name = payload.last_name
    if (hasField("account_name")) updatePayload.account_name = payload.account_name
    if (hasField("date_of_birth")) updatePayload.date_of_birth = payload.date_of_birth

    const results = validator([
      hasField("username")
        ? { value: payload.username, type: "username", required: true }
        : { value: "", custom: () => true },
      hasField("first_name")
        ? { value: payload.first_name, type: "name", required: true }
        : { value: "", custom: () => true },
      hasField("middle_name")
        ? { value: payload.middle_name ?? "", type: "optional_name", required: false }
        : { value: "", custom: () => true },
      hasField("last_name")
        ? { value: payload.last_name, type: "name", required: true }
        : { value: "", custom: () => true },
      hasField("account_name")
        ? { value: payload.account_name ?? "", type: "account_name", required: false }
        : { value: "", custom: () => true },
      hasField("date_of_birth")
        ? { value: payload.date_of_birth, type: "date_of_birth", required: true }
        : { value: "", custom: () => true },
    ]) as { valid: boolean; errors: string[] }[]

    const errors = results.flatMap((result) => result.errors)
    if (errors.length) {
      return data({ errors }, { status: 400 })
    }

    if (updatePayload.username) {
      const usernameLookup = updatePayload.username.toLowerCase()
      const { data: existingUser, error: usernameError } = await db
        .from("users")
        .select("id")
        .ilike("username", usernameLookup)
        .maybeSingle()

      if (usernameError) {
        throw usernameError
      }

      if (existingUser && existingUser.id !== userId) {
        return data({ errors: ["Username already in use"] }, { status: 409 })
      }
    }

    const { data: accountType, error: accountError } = await db
      .from("user_account_type")
      .select("is_verified")
      .eq("id", userId)
      .maybeSingle()

    if (accountError) {
      throw accountError
    }

    if (!accountType || accountType.is_verified) {
      return data(null, { status: 403 })
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await db
        .from("users")
        .update(updatePayload)
        .eq("id", userId)

      if (updateError) {
        throw updateError
      }

      const { error: verifyError } = await db
        .from("user_account_type")
        .update({ is_verified: true })
        .eq("id", userId)

      if (verifyError) {
        throw verifyError
      }
    }

    const { data: userSession, error: userSessionError } = await db
      .from("users")
      .select("xs")
      .eq("id", userId)
      .maybeSingle()

    if (userSessionError) {
      throw userSessionError
    }

    if (!userSession?.xs) {
      return data(null, { status: 500 })
    }

    return handleLogin(request, { xs: userSession.xs, user_id: userId })
  } catch (error) {
    log({
      type: "error",
      message: "Third-party access action failed",
      error: error instanceof Error ? error : new Error(String(error)),
    })
    return data(null, { status: 500 })
  }
}

const ThirdPartyProfile = () => {
  const navigate = useNavigate()
  const loaderData = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [user, setUser] = useState<ThirdPartyUser | null>(
    loaderData?.user || null,
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const submit = useSubmit()
  const initialUser = useMemo(() => loaderData?.user || null, [loaderData?.user])
  const accessToken = useMemo(() => {
    if (typeof window === "undefined") return ""
    return new URLSearchParams(window.location.search).get("access_token") || ""
  }, [])

  useEffect(() => {
    if (!loaderData?.user) {
      navigate("/auth")
    }
  }, [loaderData?.user, navigate])

  if (!loaderData?.user) {
    return null
  }

  if (!user) {
    return null
  }

  const getChanges = () => {
    if (!user || !initialUser) return {}
    const changes: Partial<ThirdPartyUser> = {}
    if (user.username !== initialUser.username) changes.username = user.username
    if (user.first_name !== initialUser.first_name) changes.first_name = user.first_name
    if (user.middle_name !== initialUser.middle_name) changes.middle_name = user.middle_name
    if (user.last_name !== initialUser.last_name) changes.last_name = user.last_name
    if (user.account_name !== initialUser.account_name) changes.account_name = user.account_name
    if (user.date_of_birth !== initialUser.date_of_birth) {
      changes.date_of_birth = user.date_of_birth
    }
    return changes
  }

  const confirmSubmit = () => {
    const changes = getChanges()
    const formData = new FormData()
    formData.set("access_token", accessToken)
    Object.entries(changes).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.set(key, String(value))
      } else {
        formData.set(key, "")
      }
    })
    submit(formData, { method: "post" })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Complete your profile</h1>
        <p className="text-sm text-muted-foreground">
          Update the required fields to continue.
        </p>
      </div>

      <Form
        method="post"
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          setDialogOpen(true)
        }}
      >
        <label className="grid gap-1 text-sm">
          Username
          <input
            value={user.username}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, username: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>

        <label className="grid gap-1 text-sm">
          First name
          <input
            value={user.first_name}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, first_name: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Middle name
          <input
            value={user.middle_name || ""}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, middle_name: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Last name
          <input
            value={user.last_name}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, last_name: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Account name
          <input
            value={user.account_name || ""}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, account_name: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Date of birth
          <input
            type="date"
            value={user.date_of_birth}
            onChange={(event) =>
              setUser((current) =>
                current ? { ...current, date_of_birth: event.target.value } : current,
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>
        <Button type="submit" className="h-11">
          Continue
        </Button>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm your changes</AlertDialogTitle>
              <AlertDialogDescription>
                Please confirm the updates you made before continuing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmSubmit}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {actionData && (actionData as { errors?: string[] }).errors?.length ? (
          <div className="text-sm text-destructive">
            {(actionData as { errors?: string[] }).errors?.[0]}
          </div>
        ) : null}
      </Form>
    </div>
  )
}

export default ThirdPartyProfile
