import { useState } from "react"
import { ArrowLeft, Check, Clock, Coffee, MapPin, Star } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  CAFE,
  CATEGORIES,
  CODE,
  INITIAL_EVENTS,
  seatsFree,
  type Booking,
  type Event,
} from "@/data"
import { RoundTable, SeatDots, SeatLegend } from "@/round-table"

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
      {children}
    </h1>
  )
}

function freeLabel(n: number) {
  if (n <= 0) return "Table is full"
  return n === 1 ? "1 seat free" : `${n} seats free`
}

/* ---------------------------------------------------------------- Traveler */

type TravelerScreen =
  | "welcome"
  | "events"
  | "detail"
  | "ticket"
  | "review"
  | "thanks"

function Traveler(props: {
  events: Event[]
  booking: Booking | null
  onBook: (eventId: number) => void
  onCancel: () => void
  onFinish: (eventId: number, tip: string) => void
}) {
  const { events, booking } = props
  const [screen, setScreen] = useState<TravelerScreen>("welcome")
  const [selectedId, setSelectedId] = useState(events[0].id)
  const [filter, setFilter] = useState("All")
  const [rating, setRating] = useState(0)
  const [tip, setTip] = useState("")

  const event = events.find((e) => e.id === selectedId)!
  const booked = events.find((e) => e.id === booking?.eventId)
  const visible = events.filter(
    (e) => filter === "All" || e.category === filter
  )
  const back: Partial<Record<TravelerScreen, TravelerScreen>> = {
    events: "welcome",
    detail: "events",
    ticket: "events",
  }

  function openTicket() {
    setSelectedId(booking!.eventId)
    setScreen("ticket")
  }

  return (
    <>
      {back[screen] && (
        <Button
          variant="ghost"
          size="sm"
          className="-mb-2 -ml-2 self-start"
          onClick={() => setScreen(back[screen]!)}
        >
          <ArrowLeft /> Back
        </Button>
      )}

      {screen === "welcome" && (
        <>
          <RoundTable
            {...events[0]}
            you="invite"
            label={events[0].when}
            className="mt-2"
          />
          <Title>A seat at a local's table.</Title>
          <p className="text-muted-foreground">
            Local Table is a café in Kallio where people who live in Helsinki
            host small everyday activities. Pick one, walk in, and sit down
            with them.
          </p>
          <div className="mt-auto flex flex-col gap-2">
            <Button size="lg" onClick={() => setScreen("events")}>
              See what's on
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Free to join. You only pay for your own coffee.
            </p>
          </div>
        </>
      )}

      {screen === "events" && (
        <>
          {booked && (
            <button
              onClick={openTicket}
              className="flex items-center justify-between gap-3 rounded-xl bg-accent p-3 text-left text-sm text-accent-foreground"
            >
              <span>
                <span className="block font-semibold">
                  {booking!.status === "seated"
                    ? `You're at table ${booked.table}`
                    : "Your seat is saved"}
                </span>
                {booked.title}, {booked.when}
              </span>
              <span className="shrink-0 font-medium underline">Open</span>
            </button>
          )}
          <Title>What's on at the café</Title>
          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map((c) => (
              <Button
                key={c}
                size="sm"
                variant={filter === c ? "default" : "outline"}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          {visible.map((e) => (
            <button
              key={e.id}
              className="rounded-xl text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() => {
                setSelectedId(e.id)
                setScreen("detail")
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{e.title}</CardTitle>
                  <CardDescription>
                    {e.when}, with {e.host}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-3 text-sm">
                  <SeatDots
                    {...e}
                    you={booked?.id === e.id ? "seated" : undefined}
                  />
                  {booked?.id === e.id ? (
                    <Badge className="ml-auto bg-accent text-accent-foreground">
                      Your seat
                    </Badge>
                  ) : (
                    <span className="ml-auto text-muted-foreground">
                      {freeLabel(seatsFree(e, booking))}
                    </span>
                  )}
                </CardContent>
              </Card>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing in {filter} this week. Try another category.
            </p>
          )}
        </>
      )}

      {screen === "detail" && (
        <>
          <div className="flex flex-col gap-2">
            <Badge variant="secondary">{event.category}</Badge>
            <Title>{event.title}</Title>
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="flex items-center gap-2">
              <Clock className="size-4" /> {event.when}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> Starts at {CAFE}
            </span>
          </div>
          <p className="text-sm">{event.description}</p>

          <Card>
            <CardHeader>
              <CardTitle>Who's coming</CardTitle>
              <CardDescription>
                {event.host} hosts. {event.hostBio}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <RoundTable
                {...event}
                label={`Table ${event.table}`}
                you={
                  booked?.id === event.id
                    ? "seated"
                    : seatsFree(event, booking) > 0
                      ? "invite"
                      : undefined
                }
              />
              <SeatLegend />
            </CardContent>
          </Card>

          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="font-medium">Coming alone?</dt>
              <dd className="text-muted-foreground">
                Most people do. {event.host} meets you at the counter.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Language</dt>
              <dd className="text-muted-foreground">English is fine.</dd>
            </div>
            <div>
              <dt className="font-medium">What to bring</dt>
              <dd className="text-muted-foreground">{event.bring}</dd>
            </div>
          </dl>

          {event.tips.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-3 text-sm">
                <h2 className="font-medium">From travelers who went</h2>
                {event.tips.map((t) => (
                  <figure key={t.text} className="border-l-2 border-accent pl-3">
                    <blockquote>{t.text}</blockquote>
                    <figcaption className="text-muted-foreground">
                      {t.from}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}

          <div className="sticky bottom-0 -mx-4 mt-auto -mb-4 border-t bg-background p-4">
            {booked?.id === event.id ? (
              <Button size="lg" className="w-full" onClick={openTicket}>
                Open your ticket
              </Button>
            ) : booked ? (
              <Button size="lg" className="w-full" disabled>
                You already have a seat at another table
              </Button>
            ) : seatsFree(event, booking) <= 0 ? (
              <Button size="lg" className="w-full" disabled>
                Table is full
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  props.onBook(event.id)
                  setRating(0)
                  setTip("")
                  setScreen("ticket")
                }}
              >
                Take a seat
              </Button>
            )}
          </div>
        </>
      )}

      {screen === "ticket" && booked && booking?.status === "booked" && (
        <>
          <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check />
          </div>
          <Title>Your seat is saved.</Title>
          <Card>
            <CardHeader>
              <CardTitle>{booked.title}</CardTitle>
              <CardDescription>{booked.when}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <span>Where: {CAFE}</span>
              <span>Host: {booked.host}</span>
              <span>Bring: {booked.bring}</span>
            </CardContent>
          </Card>
          <div className="rounded-xl bg-accent py-6 text-center text-accent-foreground">
            <div className="font-heading text-4xl font-semibold tracking-wider">
              {CODE}
            </div>
            <div className="mt-1 text-sm">
              Show this at the counter when you arrive
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Come ten minutes early. The staff will check you in and walk you
            to your table.
          </p>
          <Button
            variant="ghost"
            className="mt-auto"
            onClick={() => {
              props.onCancel()
              setScreen("events")
              toast("Seat given up")
            }}
          >
            Give up my seat
          </Button>
        </>
      )}

      {screen === "ticket" && booked && booking?.status === "seated" && (
        <>
          <Title>You're at table {booked.table}.</Title>
          <p className="text-sm text-muted-foreground">
            {booked.host} knows you're here and is on the way to say hello.
          </p>
          <RoundTable {...booked} you="seated" label={booked.title} />
          <SeatLegend />
          <Card>
            <CardHeader>
              <CardDescription>Not sure what to say?</CardDescription>
              <CardTitle>
                Ask a local: "Where do you go on a free Sunday?"
              </CardTitle>
            </CardHeader>
          </Card>
          <Button
            size="lg"
            variant="outline"
            className="mt-auto"
            onClick={() => setScreen("review")}
          >
            The activity is over
          </Button>
        </>
      )}

      {screen === "review" && (
        <>
          <Title>How was it?</Title>
          <p className="text-sm text-muted-foreground">
            {event.title} with {event.host}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Button
                key={n}
                variant="ghost"
                size="icon-lg"
                aria-label={`${n} stars`}
                aria-pressed={n === rating}
                onClick={() => setRating(n)}
              >
                <Star
                  className={
                    n <= rating ? "size-6 fill-accent" : "size-6 opacity-40"
                  }
                />
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tip">A tip for the next traveler</Label>
            <Textarea
              id="tip"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="What did you learn that a guidebook would not tell you?"
            />
            <p className="text-xs text-muted-foreground">
              Your tip appears on this event for others to read.
            </p>
          </div>
          <Button
            size="lg"
            className="mt-auto"
            disabled={rating === 0}
            onClick={() => {
              props.onFinish(event.id, tip.trim())
              setScreen("thanks")
            }}
          >
            Share
          </Button>
        </>
      )}

      {screen === "thanks" && (
        <>
          <Title>Kiitos!</Title>
          <p className="text-muted-foreground">
            {event.host} got your thanks
            {tip.trim() && ", and your tip is now on the event page"}.
          </p>
          <div className="mt-auto flex flex-col gap-2">
            <Button size="lg" onClick={() => setScreen("events")}>
              Find another table
            </Button>
            {tip.trim() && (
              <Button variant="outline" onClick={() => setScreen("detail")}>
                See your tip
              </Button>
            )}
          </div>
        </>
      )}
    </>
  )
}

/* ------------------------------------------------------------------- Staff */

function Staff(props: {
  events: Event[]
  booking: Booking | null
  onCheckIn: () => void
}) {
  const booked = props.events.find((e) => e.id === props.booking?.eventId)
  const tonight = props.events.filter((e) => e.when.startsWith("Tonight"))

  return (
    <>
      <Title>Counter, tonight</Title>
      <Card>
        <CardHeader>
          <CardTitle>Arrivals</CardTitle>
          <CardDescription>
            Ask for the code, check the guest in, walk them to the table.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          {booked && (
            <div className="flex items-center gap-3">
              <div>
                <div className="font-medium">Traveler, code {CODE}</div>
                <div className="text-muted-foreground">
                  {booked.title}, table {booked.table}
                </div>
              </div>
              {props.booking!.status === "seated" ? (
                <Badge variant="secondary" className="ml-auto">
                  Seated
                </Badge>
              ) : (
                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={props.onCheckIn}
                >
                  Check in
                </Button>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium">Alex, code LT-377</div>
              <div className="text-muted-foreground">
                Sauna and sea dip with locals, table 3
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Seated
            </Badge>
          </div>
          {!booked && (
            <p className="text-muted-foreground">
              Nobody else is expected right now.
            </p>
          )}
        </CardContent>
      </Card>

      <h2 className="font-heading font-semibold">Tables tonight</h2>
      {tonight.map((e) => (
        <Card key={e.id}>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-lg font-semibold text-secondary-foreground">
              {e.table}
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="font-medium">{e.title}</div>
              <div className="text-muted-foreground">
                {e.when.replace("Tonight ", "")}, host {e.host}
              </div>
              <SeatDots
                {...e}
                you={
                  booked?.id === e.id && props.booking!.status === "seated"
                    ? "seated"
                    : undefined
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------- Host */

function Host(props: {
  events: Event[]
  booking: Booking | null
  onPublish: (e: Event) => void
}) {
  const [category, setCategory] = useState("Food")
  const mine = props.events.filter((e) => e.host === "You")

  return (
    <>
      <Title>Host a table</Title>
      <p className="text-sm text-muted-foreground">
        Share something you would do anyway. The café saves you a table and
        your coffee is on the house.
      </p>

      {mine.map((e) => {
        const joined = props.booking?.eventId === e.id ? 1 : 0
        return (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle>{e.title}</CardTitle>
              <CardDescription>
                {e.when}, table {e.table}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3 text-sm">
              <SeatDots {...e} you={joined ? "seated" : undefined} />
              <span className="ml-auto text-muted-foreground">
                {joined ? "1 traveler signed up" : "No sign-ups yet"}
              </span>
            </CardContent>
          </Card>
        )
      })}

      <form
        className="flex flex-1 flex-col gap-4"
        onSubmit={(ev) => {
          ev.preventDefault()
          const form = new FormData(ev.currentTarget)
          props.onPublish({
            id: Date.now(),
            title: String(form.get("title")),
            category,
            when: String(form.get("when")),
            table: 5,
            seats: Number(form.get("guests")) + 1,
            host: "You",
            hostBio: "Lives in Helsinki.",
            locals: [],
            travelers: [],
            description: String(form.get("description")),
            bring: "Nothing.",
            tips: [],
          })
          ev.currentTarget.reset()
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">What will you do?</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Sunday pancakes"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="when">When</Label>
            <Input
              id="when"
              name="when"
              required
              placeholder="Sunday 11:00"
            />
          </div>
          <div className="flex w-24 flex-col gap-2">
            <Label htmlFor="guests">Guests</Label>
            <Input
              id="guests"
              name="guests"
              type="number"
              min={2}
              max={7}
              defaultValue={4}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Tell travelers what to expect</Label>
          <Textarea id="description" name="description" required />
        </div>
        <Button size="lg" type="submit" className="mt-auto">
          Publish
        </Button>
      </form>
    </>
  )
}

/* ------------------------------------------------------------------- Shell */

const ROLES = [
  { id: "traveler", label: "Traveler" },
  { id: "host", label: "Local host" },
  { id: "staff", label: "Café staff" },
]

function Prototype() {
  const [role, setRole] = useState("traveler")
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [booking, setBooking] = useState<Booking | null>(null)

  const pane = (id: string) =>
    role === id ? "flex flex-1 flex-col gap-4 p-4" : "hidden"

  return (
    <div className="flex h-svh w-full flex-col sm:h-auto sm:max-w-sm sm:gap-3 sm:py-6 lg:py-0">
      <Tabs value={role} onValueChange={setRole} className="p-2 sm:p-0">
        <TabsList className="w-full" aria-label="View the service as">
          {ROLES.map((r) => (
            <TabsTrigger
              key={r.id}
              value={r.id}
              className="data-active:bg-primary data-active:text-primary-foreground"
            >
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background sm:h-[740px] sm:flex-none sm:rounded-[2rem] sm:border sm:shadow-sm">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Coffee className="size-4" />
          </span>
          <span className="font-heading font-semibold">Local Table</span>
          {role !== "traveler" && (
            <Badge variant="secondary" className="ml-auto">
              {ROLES.find((r) => r.id === role)!.label}
            </Badge>
          )}
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className={pane("traveler")}>
            <Traveler
              events={events}
              booking={booking}
              onBook={(eventId) => setBooking({ eventId, status: "booked" })}
              onCancel={() => setBooking(null)}
              onFinish={(eventId, tip) => {
                setBooking(null)
                if (!tip) return
                setEvents(
                  events.map((e) =>
                    e.id === eventId
                      ? { ...e, tips: [{ from: "You", text: tip }, ...e.tips] }
                      : e
                  )
                )
              }}
            />
          </div>
          <div className={pane("host")}>
            <Host
              events={events}
              booking={booking}
              onPublish={(e) => {
                setEvents([e, ...events])
                toast("Published. Travelers can now see your table.")
              }}
            />
          </div>
          <div className={pane("staff")}>
            <Staff
              events={events}
              booking={booking}
              onCheckIn={() => {
                setBooking({ ...booking!, status: "seated" })
                toast("Checked in. The host has been told.")
              }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

const TASKS = [
  "You are Ana, alone in Helsinki for three days. Find out what this service is.",
  "Find something to do tonight that is not a tourist attraction, and take a seat.",
  "You have arrived at the café. Show your code at the counter. Facilitator: switch to Café staff, check the guest in, switch back to Traveler.",
  "The activity is over. Tell others how it went.",
  "Switch to Local host. You live in Helsinki: offer an activity of your own, then find it as a traveler.",
]

const QUESTIONS = [
  "Before taking a seat, what were you unsure about?",
  "Did seeing who is at the table change how you felt about going alone?",
  "Where did you hesitate or not know what to press?",
  "As a local, what would make you host?",
]

export function App() {
  const [round, setRound] = useState(1)

  return (
    <div className="flex min-h-svh flex-col items-center gap-8 bg-muted lg:flex-row lg:items-start lg:justify-center lg:p-10">
      <Prototype key={round} />
      <aside className="hidden w-full max-w-sm lg:block">
        <Card>
          <CardHeader>
            <CardTitle>Test plan</CardTitle>
            <CardDescription>
              For the facilitator. Read one task at a time and ask the tester
              to think aloud. Do not help.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <ol className="flex list-decimal flex-col gap-2 pl-4">
              {TASKS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
            <Separator />
            <div className="font-medium">Ask afterwards</div>
            <ul className="flex list-disc flex-col gap-2 pl-4">
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <Button variant="outline" onClick={() => setRound(round + 1)}>
              Reset for next tester
            </Button>
          </CardContent>
        </Card>
      </aside>
      <Toaster theme="light" position="top-center" />
    </div>
  )
}

export default App
