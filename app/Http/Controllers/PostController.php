<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user')
            ->withCount([
                'comments',
                'likes as likes_count' => fn($q) => $q->where('is_dislike', false),
                'likes as dislikes_count' => fn($q) => $q->where('is_dislike', true),
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();
        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Post::class);
        return Inertia::render('Posts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $this->authorize('create', Post::class);
        $data = $request->validated();
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        $post = $request->user()->posts()->create($data);
        return redirect()->route('posts.show', $post)->with('success', 'Post created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Post $post)
    {
        $post->load([
            'user',
            'comments.user',
            'comments.replies.user',
        ]);

        $post->loadCount([
            'comments',
            'likes as likes_count' => fn($q) => $q->where('is_dislike', false),
            'likes as dislikes_count' => fn($q) => $q->where('is_dislike', true),
        ]);

        // comment like/dislike counts
        $post->comments->loadCount([
            'likes as likes_count' => fn($q) => $q->where('is_dislike', false),
            'likes as dislikes_count' => fn($q) => $q->where('is_dislike', true),
        ]);
        $post->comments->each(function ($comment) {
            $comment->replies->loadCount([
                'likes as likes_count' => fn($q) => $q->where('is_dislike', false),
                'likes as dislikes_count' => fn($q) => $q->where('is_dislike', true),
            ]);
        });

        $user = $request->user();
        $user_like = null;
        if ($user) {
            $user_like = $post->likes()->where('user_id', $user->id)->first();
        }

        return Inertia::render('Posts/Show', [
            'post' => $post,
            'user_like' => $user_like ? [
                'id' => $user_like->id,
                'is_dislike' => (bool) $user_like->is_dislike,
            ] : null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);
        return Inertia::render('Posts/Edit', ['post' => $post]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);
        $post->update($request->validated());
        return redirect()->route('posts.show', $post)->with('success', 'Post updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post deleted');
    }
}
