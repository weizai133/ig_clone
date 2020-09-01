export default interface User {
  id: number,
  username: string,
  created_at?: string,
  updated_at?: string | null
}

interface FindUserBody {
  username: string
}

interface NumOfPosts {
  num_of_posts: number
}

interface NumOfFollowers {
  num_of_followers: number
}

interface NumOfFollowings {
  num_of_followings: number
}

interface UserInfo extends NumOfPosts, NumOfFollowers, NumOfFollowings {}

export {
  FindUserBody,
  UserInfo,
  NumOfPosts,
  NumOfFollowers,
  NumOfFollowings
}
