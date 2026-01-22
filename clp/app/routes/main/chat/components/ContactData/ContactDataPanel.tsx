import { useState } from "react"
import { StackNavigatorProvider } from "~/contexts"
import { StackView } from "./StackView"
import { ContactInfoScreen } from "./screens"

type ContactDataPanelProps = {
  name: string
  phone: string
  avatar?: string
  about?: string
  mediaCount?: number
  onClose: () => void
}

export function ContactDataPanel({
  name,
  phone,
  avatar,
  about,
  mediaCount = 0,
  onClose,
}: ContactDataPanelProps) {
  const [isMuted, setIsMuted] = useState(false)

  const initialScreen = {
    id: "contact-info",
    title: "Contact info",
    component: (
      <ContactInfoScreen
        name={name}
        phone={phone}
        avatar={avatar}
        about={about}
        mediaCount={mediaCount}
        isMuted={isMuted}
        onMuteToggle={setIsMuted}
      />
    ),
  }

  return (
    <StackNavigatorProvider initialScreen={initialScreen}>
      <StackView onClose={onClose} showEditButton />
    </StackNavigatorProvider>
  )
}
