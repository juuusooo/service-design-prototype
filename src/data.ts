export const CAFE = "Local Table café, Kallio"
export const CATEGORIES = ["Food", "Outdoors", "Games", "Language"]
export const CODE = "LT-482"

export type Tip = { from: string; text: string }

export type Event = {
  id: number
  title: string
  category: string
  when: string
  table: number
  /** Seats at the table, including the host. */
  seats: number
  host: string
  hostBio: string
  locals: string[]
  travelers: string[]
  description: string
  bring: string
  tips: Tip[]
}

export type Booking = {
  eventId: number
  status: "booked" | "seated"
}

export function seatsFree(e: Event, booking: Booking | null) {
  const you = booking?.eventId === e.id ? 1 : 0
  return e.seats - 1 - e.locals.length - e.travelers.length - you
}

export const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: "Sauna and sea dip with locals",
    category: "Outdoors",
    when: "Tonight 18:00",
    table: 3,
    seats: 7,
    host: "Mikko",
    hostBio: "Lives in Kallio and goes to the public sauna every week.",
    locals: ["Aino", "Olli"],
    travelers: ["Alex"],
    description:
      "We meet at the café, walk together to a neighbourhood sauna and finish with a dip in the sea. First-timers welcome.",
    bring: "Swimsuit and towel. The sauna costs about 15 €.",
    tips: [
      {
        from: "Jonas, Germany",
        text: "Mikko showed us a kiosk I would never have found. Ask him about the lörtsy.",
      },
    ],
  },
  {
    id: 2,
    title: "Board game night",
    category: "Games",
    when: "Tonight 19:00",
    table: 1,
    seats: 8,
    host: "Aino",
    hostBio: "Student who brings a new game every time.",
    locals: ["Pekka", "Riikka", "Tuomas"],
    travelers: [],
    description:
      "Easy games that work even without a common language, played at the café's big table.",
    bring: "Nothing. Buy a drink at the counter.",
    tips: [],
  },
  {
    id: 3,
    title: "Survival Finnish over coffee",
    category: "Language",
    when: "Tomorrow 10:00",
    table: 2,
    seats: 6,
    host: "Leena",
    hostBio: "Retired teacher who likes meeting visitors.",
    locals: ["Kaisa"],
    travelers: ["Mei", "Tom"],
    description:
      "Learn to order, greet and say thank you in Finnish, then try it out at the counter.",
    bring: "Nothing.",
    tips: [
      {
        from: "Priya, India",
        text: "I ordered my next three coffees in Finnish. People lit up.",
      },
    ],
  },
  {
    id: 4,
    title: "Bake Karelian pies",
    category: "Food",
    when: "Tomorrow 16:00",
    table: 4,
    seats: 6,
    host: "Sanna",
    hostBio: "Uses her grandmother's recipe.",
    locals: ["Heikki", "Marja"],
    travelers: ["Lucia"],
    description:
      "We bake in the café kitchen and eat the result together with egg butter.",
    bring: "Ingredients cost 8 €, paid at the café.",
    tips: [],
  },
  {
    id: 5,
    title: "Kallio backstreets walk",
    category: "Outdoors",
    when: "Saturday 12:00",
    table: 3,
    seats: 8,
    host: "Olli",
    hostBio: "Has lived in the same block for twenty years.",
    locals: ["Ville"],
    travelers: [],
    description:
      "A slow walk past the places locals actually use: the flea market, the corner bar, the best view.",
    bring: "Comfortable shoes.",
    tips: [],
  },
]
