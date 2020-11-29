export interface Like {
  id: number;
  photo_id: string;
  user_id: string;
  created_at: string;
  username?: string;
}

export interface CreateLikeBody {
  photo_id: string;
  user_id: string;
  created_at: string;
}

export interface LikeRawBodyRedis {
  photo_id: string;
  user_id: string;
  created_at: string;
}