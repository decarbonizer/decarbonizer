export interface ApiObject {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiObjectCreate {
  _id?: string;
}

export interface ApiObjectUpdate {
  _id?: string;
}
