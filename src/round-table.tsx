import { cn } from "@/lib/utils"

type Kind = "host" | "local" | "traveler" | "you" | "invite" | "empty"

const SEAT: Record<Kind, string> = {
  host: "bg-accent text-accent-foreground",
  local: "bg-primary text-primary-foreground",
  traveler: "border-2 border-primary bg-card text-primary",
  you: "border-2 border-primary bg-card text-primary ring-4 ring-accent",
  invite: "border-2 border-dashed border-foreground bg-accent/40",
  empty: "border-2 border-dashed border-input",
}

const DOT: Record<Kind, string> = {
  host: "bg-accent",
  local: "bg-primary",
  traveler: "border-[1.5px] border-primary bg-card",
  you: "border-[1.5px] border-primary bg-card ring-2 ring-accent",
  invite: "border-[1.5px] border-dashed border-foreground",
  empty: "border-[1.5px] border-dashed border-input",
}

type Props = {
  host: string
  locals: string[]
  travelers: string[]
  seats: number
  /** Whether the viewer is seated, being offered a seat, or not shown. */
  you?: "seated" | "invite"
  label: string
  className?: string
}

function people({
  host,
  locals,
  travelers,
  seats,
  you,
}: Omit<Props, "label">) {
  const list: { name: string; kind: Kind }[] = [
    { name: host, kind: "host" },
    ...locals.map((name) => ({ name, kind: "local" as Kind })),
    ...travelers.map((name) => ({ name, kind: "traveler" as Kind })),
  ]
  if (you === "seated") list.push({ name: "You", kind: "you" })
  if (you === "invite") list.push({ name: "You?", kind: "invite" })
  while (list.length < seats) list.push({ name: "", kind: "empty" })
  return list
}

/** The table seen from above, with everyone who has a seat at it. */
export function RoundTable(props: Props) {
  const list = people(props)
  const free = list.filter((p) => p.kind === "empty").length
  return (
    <div
      role="img"
      aria-label={`Table hosted by ${props.host} with ${props.locals.length} other locals, ${props.travelers.length} travelers and ${free} free seats`}
      className={cn("relative mx-auto aspect-square w-64", props.className)}
    >
      <div className="absolute inset-[27%] flex items-center justify-center rounded-full bg-secondary p-2 text-center font-heading text-sm leading-tight font-semibold text-secondary-foreground">
        {props.label}
      </div>
      {list.map((p, i) => {
        const angle = (i / list.length) * 2 * Math.PI - Math.PI / 2
        return (
          <div
            key={i}
            className="absolute flex w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{
              left: `${50 + 40 * Math.cos(angle)}%`,
              top: `${50 + 40 * Math.sin(angle)}%`,
            }}
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm font-semibold",
                SEAT[p.kind]
              )}
            >
              {p.kind === "invite" ? "?" : p.name[0]}
            </div>
            <span className="h-4 text-[11px] leading-4 font-medium">
              {p.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** A compact row of the same seats, for lists. */
export function SeatDots(props: Omit<Props, "label">) {
  return (
    <div className="flex gap-1" aria-hidden>
      {people(props).map((p, i) => (
        <span key={i} className={cn("size-3 rounded-full", DOT[p.kind])} />
      ))}
    </div>
  )
}

export function SeatLegend() {
  return (
    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
      {(["host", "local", "traveler"] as const).map((k) => (
        <span key={k} className="flex items-center gap-1.5 capitalize">
          <span className={cn("size-3 rounded-full", DOT[k])} />
          {k}
        </span>
      ))}
    </div>
  )
}
