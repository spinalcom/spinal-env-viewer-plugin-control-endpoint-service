export interface IControlPointRes {
  id: string;
  name: string;
  type: string;
  endpoints: {
    id: string;
    name: string;
    type: string;
  }[];
}
