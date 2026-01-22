import { Plus, Search, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

const communities = [
  { id: "class-project", name: "Class Project", detail: "3 groups" },
  { id: "design-hub", name: "Design Hub", detail: "2 groups" },
  { id: "friends", name: "Friends", detail: "5 groups" },
]

export function CommunitiesSidebar() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight">Communities</div>
        <Button variant="ghost" size="icon-sm" aria-label="New community">
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search communities"
          className="h-10 rounded-full bg-muted/50 pl-9"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2">
        {communities.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-muted/60">
              <Users className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{item.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {item.detail}
              </div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}
