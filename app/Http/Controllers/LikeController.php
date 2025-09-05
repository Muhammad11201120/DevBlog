<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class LikeController extends Controller
{
    public function togglePost(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'is_dislike' => ['nullable', 'boolean'],
        ]);

        $isDislike = (bool) ($validated['is_dislike'] ?? false);
        $existing = $post->likes()->where('user_id', $request->user()->id)->first();

        if ($existing && (bool)$existing->is_dislike === $isDislike) {
            $existing->delete();
        } else {
            // upsert
            $post->likes()->updateOrCreate(
                ['user_id' => $request->user()->id],
                ['is_dislike' => $isDislike, 'user_id' => $request->user()->id]
            );
        }

        return back();
    }

    public function toggleComment(Request $request, Comment $comment): RedirectResponse
    {
        $validated = $request->validate([
            'is_dislike' => ['nullable', 'boolean'],
        ]);

        $isDislike = (bool) ($validated['is_dislike'] ?? false);
        $existing = $comment->likes()->where('user_id', $request->user()->id)->first();

        if ($existing && (bool)$existing->is_dislike === $isDislike) {
            $existing->delete();
        } else {
            $comment->likes()->updateOrCreate(
                ['user_id' => $request->user()->id],
                ['is_dislike' => $isDislike, 'user_id' => $request->user()->id]
            );
        }

        return back();
    }
}


