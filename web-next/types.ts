export interface Company {
  id: number,
  name: string,
  payments?: {
    id: number,
    amount: number
  }[]
}
