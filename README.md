## DevBlog

تطبيق حديث متكامل مبني باستخدام Laravel 12 و Inertia.js و React و TypeScript و Vite.

### الشارات

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-%5E8.3-777BB4?logo=php&logoColor=white)
![Node](https://img.shields.io/badge/Node-%5E20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=1e1e1e)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-TBD-informational)

---

### جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [المتطلبات](#المتطلبات)
- [البدء السريع](#البدء-السريع)
    - [محليًا (PHP + Node)](#محليًا-php--node)
    - [باستخدام Laravel Sail (Docker)](#باستخدام-laravel-sail-docker)
- [البيئة](#البيئة)
- [أوامر شائعة](#أوامر-شائعة)
- [قاعدة البيانات](#قاعدة-البيانات)
- [الاختبارات](#الاختبارات)
- [هيكل المشروع](#هيكل-المشروع)
- [النشر](#النشر)
- [مثال-ci-github-actions](#مثال-ci-github-actions)
- [المساهمة](#المساهمة)
- [الأمان](#الأمان)
- [الترخيص](#الترخيص)

---

### نظرة عامة

DevBlog هو تطبيق Laravel 12 يستخدم Inertia.js لتقديم تجربة صفحة واحدة حديثة مع React وTypeScript، وبحزم عبر Vite.

أبرز النقاط:

- واجهة خلفية Laravel 12 مع توجيه قوي، والتحقق، والطوابير، والتخزين المؤقت
- جسر Inertia.js إلى واجهة أمامية React 18 + TypeScript
- خادم تطوير Vite لتحديث فوري سريع وبُنى إنتاجية

قم بتعديل هذا القسم لوصف هدف وتفاصيل مشروعك بدقة.

### التقنيات المستخدمة

- الواجهة الخلفية: Laravel 12 (PHP 8.3+)
- الواجهة الأمامية: React 18 + TypeScript عبر Inertia.js
- البناء: Vite 5
- قاعدة البيانات: MySQL/MariaDB/PostgreSQL (يُضبط عبر `.env`)

### المتطلبات

- PHP 8.3+
- Composer 2.6+
- Node.js 20+ و npm 9+ (أو Yarn/Pnpm)
- قاعدة بيانات SQL (يوصى بـ MySQL 8/MariaDB 10.6+/PostgreSQL 14+)
- Git

### البدء السريع

#### محليًا (PHP + Node)

```bash
# 1) تثبيت اعتمادات PHP
composer install

# 2) تهيئة البيئة
cp .env.example .env
php artisan key:generate

# 3) ضبط قاعدة البيانات في .env ثم تشغيل الترحيلات (والمولّدات الاختيارية)
php artisan migrate --seed

# 4) تثبيت اعتمادات الواجهة وتشغيل خادم Vite
npm install
npm run dev

# 5) تشغيل خادم Laravel في طرفية منفصلة
php artisan serve
```

زر http://127.0.0.1:8000 أثناء تشغيل Vite.

#### باستخدام Laravel Sail (Docker)

إن فضّلت Docker، ثبّت وشغّل Laravel Sail:

```bash
# 1) تثبيت الاعتمادات وSail
composer install
php artisan sail:install --no-interaction

# 2) تشغيل الحاويات (Windows PowerShell)
vendor\bin\sail.bat up -d

# 3) تهيئة .env لـ Sail (مثل DB_HOST=mysql) ثم الترحيل والبذور
vendor\bin\sail.bat artisan migrate --seed

# 4) تثبيت اعتمادات الواجهة وتشغيل Vite داخل الحاوية
vendor\bin\sail.bat npm install
vendor\bin\sail.bat npm run dev
```

سيكون التطبيق متاحًا على المنفذ الذي يعرّضه Sail (غالبًا http://localhost).

### البيئة

أقل المفاتيح المطلوبة في `.env` قبل التشغيل محليًا:

```dotenv
APP_NAME="DevBlog"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=devblog
DB_USERNAME=root
DB_PASSWORD=

# مع Sail استخدم DB_HOST=mysql وبيانات الاعتماد الافتراضية
```

اختياري ولكن مستحسن:

- أنشئ قاعدة بيانات باسم `devblog` (أو عدّل `DB_DATABASE`).
- إن كنت تستخدم التخزين للرفع، شغّل: `php artisan storage:link`.

### أوامر شائعة

```bash
# التطوير
npm run dev           # تحديث فوري Vite
php artisan serve     # خادم تطوير Laravel

# بناء الأصول
npm run build         # بناء إنتاجي

# تحسين (للإنتاج)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# قاعدة البيانات
php artisan migrate
php artisan migrate:fresh --seed
```

### قاعدة البيانات

- ملفات الترحيل في `database/migrations`.
- المولّدات (Seeders) في `database/seeders` ويمكن تشغيلها عبر `php artisan db:seed` أو `php artisan migrate --seed`.

### الاختبارات

```bash
php artisan test
```

أضف اختبارات PHPUnit أو Pest داخل `tests/`.

### هيكل المشروع

```
app/                # التطبيق (النماذج، وحدات التحكم، الأوامر)
bootstrap/          # تمهيد إطار العمل
config/             # ملفات الإعدادات
database/           # الترحيلات، المولّدات، المصانع
public/             # جذر مستندات خادم الويب
resources/
  js/               # تطبيق Inertia React (TypeScript)
  views/            # قوالب Blade إن وُجدت
routes/             # مسارات الويب/الـ API
storage/            # السجلات، الملفات المترجمة، الرفع
tests/              # اختبارات وحدة/وظيفية
vite.config.ts      # ضبط Vite
```

### النشر

خطوات عامة (Forge أو Vapor أو خادمك الخاص):

1. ضبط متغيرات البيئة للإنتاج (`APP_ENV=production`، `APP_DEBUG=false`).
2. تثبيت الاعتمادات: `composer install --no-dev --optimize-autoloader`.
3. بناء الأصول: `npm ci && npm run build` (أو البناء في CI ونشر النتائج).
4. تشغيل الترحيلات: `php artisan migrate --force`.
5. تحسين: `php artisan config:cache route:cache view:cache`.

تأكد أن الخادم يستوفي متطلبات إضافات PHP المتوافقة مع Laravel 12.

### مثال CI (GitHub Actions)

أنشئ الملف `.github/workflows/ci.yml`:

```yaml
name: CI

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    build-and-test:
        runs-on: ubuntu-latest
        services:
            mysql:
                image: mysql:8
                env:
                    MYSQL_ROOT_PASSWORD: root
                    MYSQL_DATABASE: devblog_test
                ports: ['3306:3306']
                options: >-
                    --health-cmd="mysqladmin ping -h 127.0.0.1 -proot"
                    --health-interval=10s --health-timeout=5s --health-retries=3

        steps:
            - uses: actions/checkout@v4

            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: '8.3'
                  coverage: none

            - name: Setup Node
              uses: actions/setup-node@v4
              with:
                  node-version: '20'

            - name: Install PHP deps
              run: composer install --prefer-dist --no-progress

            - name: Copy .env
              run: cp .env.example .env

            - name: Generate key
              run: php artisan key:generate

            - name: Configure DB
              run: |
                  php -r "file_put_contents('.env', preg_replace('/DB_DATABASE=.*/', 'DB_DATABASE=devblog_test', file_get_contents('.env')));"
                  php -r "file_put_contents('.env', preg_replace('/DB_USERNAME=.*/', 'DB_USERNAME=root', file_get_contents('.env')));"
                  php -r "file_put_contents('.env', preg_replace('/DB_PASSWORD=.*/', 'DB_PASSWORD=root', file_get_contents('.env')));"

            - name: Migrate
              run: php artisan migrate --force

            - name: Install JS deps and build
              run: |
                  npm ci
                  npm run build

            - name: Run tests
              run: php artisan test --no-interaction
```

### المساهمة

نرحّب بالمساهمات! يُفضّل فتح قضية أولًا لمناقشة أي تغييرات. عند إرسال طلب دمج (PR):

- حافظ على التغييرات مركزة ومحددة النطاق
- أرفق اختبارات حيثما أمكن
- اشرح الدافع والأثر المتوقع

### الأمان

إن اكتشفت ثغرة أمنية، راسل المشرف أو افتح تنبيهًا خاصًا على GitHub. يُرجى عدم إنشاء قضايا عامة للثغرات.

### الترخيص

الترخيص: قيد التحديد. استبدل هذا القسم بالرخصة التي تختارها (مثل MIT)، وأضف ملف `LICENSE` إلى جذر المستودع.
