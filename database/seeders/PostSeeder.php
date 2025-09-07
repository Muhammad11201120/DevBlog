<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks temporarily
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Delete all existing data
        Like::query()->delete();
        Comment::query()->delete();
        Post::query()->delete();

        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Get or create a user for the posts
        $user = User::first() ?? User::factory()->create([
            'name' => 'مطور ويب',
            'email' => 'developer@example.com',
            'role' => 'writer'
        ]);

        $arabicPosts = [
            [
                'title' => 'مقدمة في تطوير الواجهات الأمامية الحديثة',
                'content' => 'تطوير الواجهات الأمامية أصبح أكثر تعقيداً مع ظهور إطارات العمل الحديثة مثل React و Vue.js. في هذا المقال، سنستكشف أفضل الممارسات لبناء واجهات مستخدم سريعة ومتجاوبة. سنتعلم كيفية استخدام TypeScript لتحسين جودة الكود، وأفضل طرق إدارة الحالة في التطبيقات الكبيرة.',
                'slug' => 'modern-frontend-development-intro'
            ],
            [
                'title' => 'أساسيات CSS Grid و Flexbox للمطورين',
                'content' => 'CSS Grid و Flexbox هما من أقوى أدوات التخطيط في CSS. في هذا الدليل الشامل، سنتعلم كيفية استخدام Grid لإنشاء تخطيطات معقدة ثنائية الأبعاد، وFlexbox للتخطيطات أحادية البعد. سنرى أمثلة عملية ونصائح لتحسين تجربة المستخدم.',
                'slug' => 'css-grid-flexbox-basics'
            ],
            [
                'title' => 'أمان تطبيقات الويب: أفضل الممارسات',
                'content' => 'أمان تطبيقات الويب موضوع بالغ الأهمية. سنناقش أهم الثغرات الأمنية مثل SQL Injection و XSS و CSRF، وكيفية حماية تطبيقاتك منها. سنتعلم أيضاً كيفية تنفيذ المصادقة الآمنة، وإدارة الجلسات، وحماية البيانات الحساسة.',
                'slug' => 'web-application-security-best-practices'
            ],
            [
                'title' => 'تحسين أداء مواقع الويب: دليل شامل',
                'content' => 'أداء الموقع يؤثر بشكل مباشر على تجربة المستخدم ومحركات البحث. سنتعلم تقنيات تحسين الأداء مثل ضغط الصور، تحسين CSS و JavaScript، استخدام CDN، وتحسين قاعدة البيانات. سنرى أيضاً كيفية قياس الأداء وتحسين Core Web Vitals.',
                'slug' => 'website-performance-optimization-guide'
            ],
            [
                'title' => 'Node.js و Express.js: بناء APIs قوية',
                'content' => 'Node.js يسمح للمطورين بكتابة JavaScript على الخادم. سنتعلم كيفية بناء APIs قوية باستخدام Express.js، وإدارة قاعدة البيانات مع MongoDB، وتنفيذ المصادقة والتفويض. سنرى أيضاً كيفية كتابة اختبارات وحدة واختبارات التكامل.',
                'slug' => 'nodejs-expressjs-building-strong-apis'
            ],
            [
                'title' => 'Git و GitHub: إدارة المشاريع البرمجية',
                'content' => 'Git هو نظام تحكم في الإصدارات الأساسي لكل مطور. سنتعلم أساسيات Git، وكيفية استخدام GitHub للتعاون في المشاريع، وإنشاء Pull Requests، وإدارة الفروع. سنرى أيضاً أفضل الممارسات لكتابة رسائل commit واضحة ومفيدة.',
                'slug' => 'git-github-managing-software-projects'
            ],
            [
                'title' => 'Responsive Design: تصميم متجاوب للجميع',
                'content' => 'التصميم المتجاوب ضروري لضمان عمل الموقع على جميع الأجهزة. سنتعلم كيفية استخدام Media Queries، واختيار Breakpoints مناسبة، واختبار التصميم على أجهزة مختلفة. سنرى أيضاً كيفية تحسين الصور للموبايل وضمان سرعة التحميل.',
                'slug' => 'responsive-design-for-everyone'
            ],
            [
                'title' => 'JavaScript ES6+: الميزات الحديثة',
                'content' => 'JavaScript تطور بشكل كبير مع إصدارات ES6 وما بعدها. سنستكشف الميزات الجديدة مثل Arrow Functions، Destructuring، Modules، وAsync/Await. سنرى أيضاً كيفية استخدام Promises وFetch API، وأفضل الممارسات لكتابة كود JavaScript حديث ونظيف.',
                'slug' => 'javascript-es6-modern-features'
            ],
            [
                'title' => 'قواعد البيانات: SQL مقابل NoSQL',
                'content' => 'اختيار نوع قاعدة البيانات المناسب مهم جداً لنجاح المشروع. سنقارن بين قواعد البيانات العلائقية مثل MySQL وPostgreSQL، وقواعد البيانات غير العلائقية مثل MongoDB. سنتعلم متى نستخدم كل نوع، وكيفية تصميم مخطط قاعدة البيانات بشكل صحيح.',
                'slug' => 'databases-sql-vs-nosql'
            ],
            [
                'title' => 'DevOps: أتمتة عمليات التطوير والنشر',
                'content' => 'DevOps يساعد في تسريع عملية التطوير وتحسين جودة المنتج. سنتعلم كيفية استخدام Docker لتعبئة التطبيقات، وCI/CD لآتمتة الاختبارات والنشر، ومراقبة الأداء في الإنتاج. سنرى أيضاً كيفية إدارة الخوادم السحابية وتطبيق أفضل ممارسات الأمان.',
                'slug' => 'devops-automating-development-deployment'
            ]
        ];

        foreach ($arabicPosts as $postData) {
            Post::create([
                'user_id' => $user->id,
                'title' => $postData['title'],
                'slug' => $postData['slug'],
                'content' => $postData['content'],
                'published_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
