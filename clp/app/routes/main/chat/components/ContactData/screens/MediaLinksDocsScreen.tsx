import { useState } from "react"
import { cn } from "~/lib/utils"

type TabType = "media" | "links" | "docs"

const tabs: { id: TabType; label: string }[] = [
  { id: "media", label: "Media" },
  { id: "links", label: "Links" },
  { id: "docs", label: "Docs" },
]

const sampleMedia = [
  "https://picsum.photos/200/200?random=1",
  "https://picsum.photos/200/200?random=2",
  "https://picsum.photos/200/200?random=3",
  "https://picsum.photos/200/200?random=4",
  "https://picsum.photos/200/200?random=5",
  "https://picsum.photos/200/200?random=6",
]

export function MediaLinksDocsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("media")

  return (
    <div className="flex flex-col">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-2">
        {activeTab === "media" && (
          <div className="grid grid-cols-3 gap-1">
            {sampleMedia.map((src, index) => (
              <button
                key={index}
                className="aspect-square overflow-hidden rounded hover:opacity-80 transition-opacity"
              >
                <img
                  src={src}
                  alt={`Media ${index + 1}`}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {activeTab === "links" && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">No links</p>
          </div>
        )}

        {activeTab === "docs" && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">No documents</p>
          </div>
        )}
      </div>
    </div>
  )
}
