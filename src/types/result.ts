export type Status = 'low' | 'normal' | 'high';

export interface Result {
  id: string;
  biomarkerId: string;
  value: number;
  sampledAt: string;
  status: Status;
}
