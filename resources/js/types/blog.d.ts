export interface BlogUser {
    id: number
    name: string
}

export interface BlogPost {
    id: number
    title: string
    slug: string
    content: string
    user?: BlogUser
    comments_count?: number
    likes_count?: number
    dislikes_count?: number
    created_at?: string
    updated_at?: string
}


