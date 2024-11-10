
export type User = {
    id: number
    username: string
    email: string
}

export type Quiz = {
    id: number
    name: string
    description: string
    category: string
    user_count: number
    average_score: number
    average_rating: number
    created_by: User
    last_updated: string
}