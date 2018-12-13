
export class ConferenceSchedule {
  id: string
  name: string
}
export class ConferenceSession {
  id: string
  title: string
  description: string
  date?: Date
  time?: Date
  duration?: number
  type: string
}

export class ConferenceSpeaker {
  id: string
  name: string
  bio: string
  avatar?: string
}

export class ConferenceSponsor {
  id: string
  name: string
  description: string
}
