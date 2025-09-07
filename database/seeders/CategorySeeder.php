<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'description' => 'Posts about technology, programming, and software development',
                'color' => '#3B82F6',
            ],
            [
                'name' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Frontend and backend web development topics',
                'color' => '#10B981',
            ],
            [
                'name' => 'Mobile Development',
                'slug' => 'mobile-development',
                'description' => 'iOS, Android, and cross-platform mobile development',
                'color' => '#F59E0B',
            ],
            [
                'name' => 'DevOps',
                'slug' => 'devops',
                'description' => 'Deployment, CI/CD, and infrastructure topics',
                'color' => '#EF4444',
            ],
            [
                'name' => 'Design',
                'slug' => 'design',
                'description' => 'UI/UX design, graphics, and user experience',
                'color' => '#8B5CF6',
            ],
            [
                'name' => 'Tutorials',
                'slug' => 'tutorials',
                'description' => 'Step-by-step guides and how-to articles',
                'color' => '#06B6D4',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
