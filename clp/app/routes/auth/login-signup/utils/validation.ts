export const ACCEPTABLE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
]

export const ALLOWED_USERNAME_SPECIAL_CHARS = ["_", "-", "."]

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }

  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain || !ACCEPTABLE_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      error: "Email is invalid",
    }
  }

  return { isValid: true }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" }
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" }
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password must be less than 128 characters" }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" }
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one special character" }
  }

  return { isValid: true }
}

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" }
  }

  return { isValid: true }
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: "Username is required" }
  }

  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters long" }
  }

  if (username.length > 30) {
    return { isValid: false, error: "Username must be less than 30 characters" }
  }

  const allowedCharsRegex = new RegExp(
    `^[a-zA-Z0-9${ALLOWED_USERNAME_SPECIAL_CHARS.map((char) => `\\${char}`).join("")}]+$`
  )

  if (!allowedCharsRegex.test(username)) {
    return {
      isValid: false,
      error: `Username can only contain letters, numbers, and these special characters: ${ALLOWED_USERNAME_SPECIAL_CHARS.join(", ")}`,
    }
  }

  if (!/^[a-zA-Z]/.test(username)) {
    return { isValid: false, error: "Username must start with a letter" }
  }

  if (username.endsWith("_") || username.endsWith("-") || username.endsWith(".")) {
    return { isValid: false, error: "Username cannot end with a special character" }
  }

  return { isValid: true }
}

export const validateFirstName = (firstName: string): ValidationResult => {
  if (!firstName) {
    return { isValid: false, error: "First name is required" }
  }

  if (firstName.length < 2) {
    return { isValid: false, error: "First name must be at least 2 characters long" }
  }

  if (firstName.length > 50) {
    return { isValid: false, error: "First name must be less than 50 characters" }
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/
  if (!nameRegex.test(firstName)) {
    return {
      isValid: false,
      error: "First name can only contain letters, spaces, hyphens, and apostrophes",
    }
  }

  return { isValid: true }
}

export const validateMiddleName = (middleName: string): ValidationResult => {
  if (!middleName) {
    return { isValid: true }
  }

  if (middleName.length > 50) {
    return { isValid: false, error: "Middle name must be less than 50 characters" }
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/
  if (!nameRegex.test(middleName)) {
    return {
      isValid: false,
      error: "Middle name can only contain letters, spaces, hyphens, and apostrophes",
    }
  }

  return { isValid: true }
}

export const validateLastName = (lastName: string): ValidationResult => {
  if (!lastName) {
    return { isValid: false, error: "Last name is required" }
  }

  if (lastName.length < 2) {
    return { isValid: false, error: "Last name must be at least 2 characters long" }
  }

  if (lastName.length > 50) {
    return { isValid: false, error: "Last name must be less than 50 characters" }
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/
  if (!nameRegex.test(lastName)) {
    return {
      isValid: false,
      error: "Last name can only contain letters, spaces, hyphens, and apostrophes",
    }
  }

  return { isValid: true }
}

export const validateDateOfBirth = (dateOfBirth: Date | undefined): ValidationResult => {
  if (!dateOfBirth) {
    return { isValid: false, error: "Date of birth is required" }
  }

  const today = new Date()
  const age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    const actualAge = age - 1
    if (actualAge < 13) {
      return { isValid: false, error: "You must be at least 13 years old to create an account" }
    }
  } else {
    if (age < 13) {
      return { isValid: false, error: "You must be at least 13 years old to create an account" }
    }
  }

  if (dateOfBirth > today) {
    return { isValid: false, error: "Date of birth cannot be in the future" }
  }

  return { isValid: true }
}
