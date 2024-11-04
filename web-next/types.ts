export type Company = {
  id: number,
  name: string,
  payments?: Array<{
    id: number,
    amount: number
  }>
}
