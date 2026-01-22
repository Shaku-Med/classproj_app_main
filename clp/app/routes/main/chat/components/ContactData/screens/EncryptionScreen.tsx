import { Lock, QrCode, Copy } from "lucide-react"
import { Button } from "~/components/ui/button"

type EncryptionScreenProps = {
  contactName: string
}

const securityCode = "12345 67890 12345 67890 12345 67890 12345 67890 12345 67890 12345 67890"

export function EncryptionScreen({ contactName }: EncryptionScreenProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(securityCode.replace(/\s/g, ""))
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center px-6 py-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="size-8 text-primary" />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Messages and calls with {contactName} are secured with end-to-end encryption.
        </p>
      </div>

      <div className="flex flex-col items-center border-t border-border px-6 py-6">
        <div className="flex size-48 items-center justify-center rounded-xl bg-muted">
          <QrCode className="size-32 text-muted-foreground" />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Scan this code with {contactName}'s phone to verify encryption.
        </p>
      </div>

      <div className="border-t border-border px-6 py-6">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          60-DIGIT NUMBER
        </p>
        <div className="rounded-lg bg-muted p-4">
          <p className="font-mono text-xs leading-relaxed tracking-wider">
            {securityCode}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
          onClick={handleCopy}
        >
          <Copy className="mr-2 size-4" />
          Copy
        </Button>
      </div>

      <div className="px-6 py-4">
        <p className="text-xs text-muted-foreground">
          If the security code matches, you can be sure your messages and calls are secure.
        </p>
      </div>
    </div>
  )
}
