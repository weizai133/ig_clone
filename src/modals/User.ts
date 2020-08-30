export default interface User {
  id: number,
  username: string,
  created_at?: string,
  updated_at?: string | null
}

interface findUserBody {
  username: string
}

export {
  findUserBody
}
