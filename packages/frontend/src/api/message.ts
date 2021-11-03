import { decarbonizerFetch } from './fetch';

export interface Message {
  content: string;
}

export async function getMessage() {
  return decarbonizerFetch<Message>('/api/v1/message');
}
