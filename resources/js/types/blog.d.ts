export interface BlogUser {
    id: number;
    name: string;
}

export interface BlogCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: string;
    image_url?: string;
    published_at?: string;
    user?: BlogUser;
    category?: BlogCategory;
    comments_count?: number;
    likes_count?: number;
    dislikes_count?: number;
    created_at?: string;
    updated_at?: string;
}
