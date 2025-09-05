<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\Post;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::pluck('id');
        Comment::factory(50)->create()->each(function ($comment) use ($posts) {
            $comment->post_id = $posts->random();
            $comment->save();
        });
    }
}
