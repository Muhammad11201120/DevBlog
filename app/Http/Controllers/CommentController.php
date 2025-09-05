<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Notifications\NewCommentNotification;

class CommentController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string'],
            'parent_id' => ['nullable', 'exists:comments,id'],
        ]);

        // Ensure parent belongs to same post if provided
        if (!empty($validated['parent_id'])) {
            $parent = Comment::find($validated['parent_id']);
            if (!$parent || $parent->post_id !== $post->id) {
                abort(422, 'Invalid parent comment.');
            }
        }

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Previously: notify subscribers. Subscription system removed.

        return back()->with('success', 'Comment added');
    }

    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        if ($request->user()->id !== $comment->user_id) {
            abort(403);
        }
        $comment->delete();
        return back()->with('success', 'Comment deleted');
    }
}
