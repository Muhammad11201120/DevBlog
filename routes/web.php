<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\Post;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    $posts = Post::with(['user', 'category'])
        ->withCount([
            'comments',
            'likes as likes_count' => fn($q) => $q->where('is_dislike', false),
            'likes as dislikes_count' => fn($q) => $q->where('is_dislike', true),
        ])
        ->latest()
        ->paginate(12)
        ->withQueryString();


    return Inertia::render('welcome', [
        'posts' => $posts,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        if (! $user) {
            abort(403);
        }
        if (! $user->can('access-dashboard')) {
            abort(403);
        }
        return app(DashboardController::class)();
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::resource('posts', PostController::class)->only(['create', 'store', 'edit', 'update', 'destroy']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::post('/posts/{post}/like', [LikeController::class, 'togglePost'])->name('posts.like');
    Route::post('/comments/{comment}/like', [LikeController::class, 'toggleComment'])->name('comments.like');
});

// Category routes (admin only)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('categories', CategoryController::class);
    Route::get('/admin/posts', [PostController::class, 'adminIndex'])->name('admin.posts.index');
});

// Public posts routes (register after create to avoid /posts/create being captured by /posts/{post})
Route::resource('posts', PostController::class)->only(['index', 'show']);

// Public category routes
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Locale switcher
Route::get('/locale/{locale}', function (string $locale) {
    $supported = ['en', 'ar'];
    if (! in_array($locale, $supported, true)) {
        $locale = config('app.fallback_locale', 'en');
    }

    Cookie::queue(cookie()->forever('locale', $locale));

    return Redirect::back();
})->name('locale.switch');
