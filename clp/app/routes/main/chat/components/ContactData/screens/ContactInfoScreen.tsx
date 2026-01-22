import {
  Image,
  Star,
  Bell,
  Timer,
  Shield,
  Lock,
  Heart,
  Ban,
  ThumbsDown,
  Trash2,
  ChevronRight,
} from "lucide-react"
import { Switch } from "~/components/ui/switch"
import { useStackNavigator, type Screen } from "~/contexts"
import { MediaLinksDocsScreen } from "./MediaLinksDocsScreen"
import { StarredMessagesScreen } from "./StarredMessagesScreen"
import { DisappearingMessagesScreen } from "./DisappearingMessagesScreen"
import { EncryptionScreen } from "./EncryptionScreen"

type ContactInfoScreenProps = {
  name: string
  phone: string
  avatar?: string
  about?: string
  mediaCount?: number
  isMuted?: boolean
  onMuteToggle?: (muted: boolean) => void
}

export function ContactInfoScreen({
  name,
  phone,
  avatar,
  about,
  mediaCount = 0,
  isMuted = false,
  onMuteToggle,
}: ContactInfoScreenProps) {
  const { push } = useStackNavigator()

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const navigateTo = (screen: Screen) => {
    push(screen)
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center py-8">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="size-32 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-32 items-center justify-center rounded-full bg-muted text-3xl font-semibold text-foreground">
            {initials || "?"}
          </div>
        )}
        <h2 className="mt-4 text-xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">{phone}</p>
      </div>

      {about && (
        <div className="border-t border-border px-4 py-4">
          <p className="text-xs text-muted-foreground">About</p>
          <p className="mt-1 text-sm">{about}</p>
        </div>
      )}

      <div className="border-t border-border">
        <button
          onClick={() =>
            navigateTo({
              id: "media",
              title: "Media, links and docs",
              component: <MediaLinksDocsScreen />,
            })
          }
          className="flex w-full items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Image className="size-5 text-muted-foreground" />
            <span className="text-sm">Media, links and docs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{mediaCount}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </button>

        <button
          onClick={() =>
            navigateTo({
              id: "starred",
              title: "Starred messages",
              component: <StarredMessagesScreen />,
            })
          }
          className="flex w-full items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Star className="size-5 text-muted-foreground" />
            <span className="text-sm">Starred messages</span>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>

      <div className="border-t border-border">
        <div className="flex w-full items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Bell className="size-5 text-muted-foreground" />
            <span className="text-sm">Mute notifications</span>
          </div>
          <Switch
            checked={isMuted}
            onCheckedChange={onMuteToggle}
          />
        </div>

        <button
          onClick={() =>
            navigateTo({
              id: "disappearing",
              title: "Disappearing messages",
              component: <DisappearingMessagesScreen />,
            })
          }
          className="flex w-full items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Timer className="size-5 text-muted-foreground" />
            <div className="flex flex-col items-start">
              <span className="text-sm">Disappearing messages</span>
              <span className="text-xs text-muted-foreground">Off</span>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>

        <button
          onClick={() =>
            navigateTo({
              id: "privacy",
              title: "Advanced chat privacy",
              component: (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Advanced privacy settings for this chat.
                  </p>
                </div>
              ),
            })
          }
          className="flex w-full items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Shield className="size-5 text-muted-foreground" />
            <div className="flex flex-col items-start">
              <span className="text-sm">Advanced chat privacy</span>
              <span className="text-xs text-muted-foreground">Off</span>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>

      <div className="border-t border-border">
        <button
          onClick={() =>
            navigateTo({
              id: "encryption",
              title: "Encryption",
              component: <EncryptionScreen contactName={name} />,
            })
          }
          className="flex w-full items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <Lock className="size-5 text-muted-foreground" />
          <div className="flex flex-col items-start">
            <span className="text-sm">Encryption</span>
            <span className="text-xs text-muted-foreground">
              Messages are end-to-end encrypted. Click to verify.
            </span>
          </div>
        </button>
      </div>

      <div className="border-t border-border">
        <button
          onClick={() =>
            navigateTo({
              id: "favorites",
              title: "Add to Favorites",
              component: (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Add this contact to your favorites list.
                  </p>
                </div>
              ),
            })
          }
          className="flex w-full items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <Heart className="size-5 text-muted-foreground" />
          <span className="text-sm">Add to Favorites</span>
        </button>
      </div>

      <div className="border-t border-border">
        <button className="flex w-full items-center gap-4 px-4 py-4 text-destructive hover:bg-muted/50 transition-colors">
          <Ban className="size-5" />
          <span className="text-sm">Block {name.split(" ")[0]}</span>
        </button>

        <button className="flex w-full items-center gap-4 px-4 py-4 text-destructive hover:bg-muted/50 transition-colors">
          <ThumbsDown className="size-5" />
          <span className="text-sm">Report {name.split(" ")[0]}</span>
        </button>

        <button className="flex w-full items-center gap-4 px-4 py-4 text-destructive hover:bg-muted/50 transition-colors">
          <Trash2 className="size-5" />
          <span className="text-sm">Delete chat</span>
        </button>
      </div>

      <div className="h-8" />
    </div>
  )
}
