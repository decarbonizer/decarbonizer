import { decarbonizerFetch } from './fetch';

export interface Message {
  content: string;
  version: number;
}

export async function getMessages() {
  return decarbonizerFetch<Array<Message>>('/api/v1/message');
}
