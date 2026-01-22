import {
  Bell,
  Lock,
  Palette,
  ShieldCheck,
  User,
} from "lucide-react"

const settingsItems = [
  { id: "account", label: "Account", icon: User },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
]

export function SettingsSidebar() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 px-4 py-3">
      <div className="text-xl font-semibold tracking-tight">Settings</div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2">
        {settingsItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
