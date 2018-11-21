export class FeedbackQuestion {
  answers: Answer[];
  question: Question;
}

export class Answer {
  constructor(
    public id: number,
    public questionId: number,
    public en: string,
    public es: string,
    public ptbr: string,
    public label: string
  ) {}
}

export class Question {
  id: number;
  en: string;
  es: string;
  ptbr: string;
}

export class FeedbackPollAnswer {
  constructor(
    public personId: number,
    public answerId: number,
    public questionId: number,
    public terminalId: number
  ) {}
}
