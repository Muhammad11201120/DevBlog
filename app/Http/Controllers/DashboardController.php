<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $metrics = [
            'posts' => Post::count(),
            'comments' => Comment::count(),
            'likes' => Like::where('is_dislike', false)->count(),
            'dislikes' => Like::where('is_dislike', true)->count(),
            'users' => User::count(),
        ];

        $recentPosts = Post::with('user')->latest()->take(5)->get();
        $recentComments = Comment::with(['user', 'post'])->latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'recentPosts' => $recentPosts,
            'recentComments' => $recentComments,
        ]);
    }
}


