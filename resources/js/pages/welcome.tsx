import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    bounceIn,
    cardHover,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    fadeInUp,
    heroButtons,
    heroSubtitle,
    heroTitle,
    pulse,
    staggerContainer,
    staggerItem,
} from '@/lib/animations';
import { translate, type SupportedLocale } from '@/lib/i18n';
import { getPaginationLabel } from '@/lib/pagination';
import { dashboard, login, register } from '@/routes/simple';
import { type SharedData } from '@/types';
import type { BlogPost } from '@/types/blog';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, CheckCircle, Code, Heart, MessageCircle, Share2, Star, Users, Zap } from 'lucide-react';
import { useState } from 'react';

type PaginationLink = { url: string | null; label: string; active: boolean };

export default function Welcome() {
    const page = usePage<SharedData & { posts?: { data: BlogPost[]; links: PaginationLink[] } }>();
    const { auth, posts } = page.props;
    const locale = (page.props.locale as SupportedLocale) || 'en';
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    return (
        <>
            <Head title={translate('welcome.title', locale)}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <AppHeader />
            <div className="relative min-h-screen bg-background text-foreground">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    {/* Animated background pattern */}
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'linear',
                        }}
                    />

                    {/* Floating geometric shapes */}
                    <motion.div
                        className="absolute top-20 left-10 h-20 w-20 rounded-full bg-blue-200/30 blur-xl"
                        animate={{
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute top-40 right-20 h-32 w-32 rounded-full bg-purple-200/30 blur-xl"
                        animate={{
                            y: [20, -20, 20],
                            x: [10, -10, 10],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-1/4 h-16 w-16 rounded-full bg-indigo-200/30 blur-xl"
                        animate={{
                            y: [-15, 15, -15],
                            x: [-5, 5, -5],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                        <motion.div className="text-center" variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.div variants={bounceIn}>
                                <Badge className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white shadow-lg">
                                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                                        <Star className="h-4 w-4" />
                                    </motion.div>
                                    {translate('welcome.badge', locale)}
                                </Badge>
                            </motion.div>

                            <motion.h1
                                className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
                                variants={heroTitle}
                            >
                                {translate('welcome.hero_title_prefix', locale)}{' '}
                                <motion.span
                                    className="text-foreground"
                                    animate={{
                                        textShadow: [
                                            '0 0 0px rgba(59, 130, 246, 0)',
                                            '0 0 20px rgba(59, 130, 246, 0.3)',
                                            '0 0 0px rgba(59, 130, 246, 0)',
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    DevBlog
                                </motion.span>
                            </motion.h1>

                            <motion.p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground sm:text-2xl" variants={heroSubtitle}>
                                {translate('welcome.hero_subtitle', locale)}
                            </motion.p>

                            <motion.div className="flex flex-col items-center justify-center gap-4 sm:flex-row" variants={heroButtons}>
                                {auth.user && (auth.user.role === 'writer' || auth.user.role === 'admin') ? (
                                    <>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link href={dashboard()}>
                                                <Button
                                                    size="lg"
                                                    className="hover-lift bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:from-blue-700 hover:to-purple-700"
                                                >
                                                    {translate('welcome.cta_go_to_dashboard', locale)}
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                    >
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </motion.div>
                                                </Button>
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <a href="#posts">
                                                <Button variant="outline" size="lg" className="hover-lift px-8 py-3 text-lg">
                                                    {translate('welcome.cta_browse_posts', locale)}
                                                </Button>
                                            </a>
                                        </motion.div>
                                    </>
                                ) : (
                                    <>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link href={register()}>
                                                <Button
                                                    size="lg"
                                                    className="hover-lift bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:from-blue-700 hover:to-purple-700"
                                                >
                                                    {translate('welcome.cta_create_account', locale)}
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                    >
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </motion.div>
                                                </Button>
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link href={login()}>
                                                <Button variant="outline" size="lg" className="hover-lift px-8 py-3 text-lg">
                                                    {translate('auth.login', locale)}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <AnimatedSection className="bg-background py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="mb-16 text-center"
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {translate('welcome.features_title', locale)}
                            </h2>
                            <p className="mt-4 text-xl text-muted-foreground">{translate('welcome.features_subtitle', locale)}</p>
                        </motion.div>

                        <motion.div
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div variants={staggerItem}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 transition-all duration-300 dark:from-slate-800 dark:to-slate-700">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            whileHover={{ opacity: 1 }}
                                        />
                                        <div className="relative">
                                            <motion.div
                                                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <motion.div
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                >
                                                    <Code className="h-6 w-6" />
                                                </motion.div>
                                            </motion.div>
                                            <h3 className="mb-2 text-xl font-semibold text-foreground">
                                                {translate('welcome.feature_1_title', locale)}
                                            </h3>
                                            <p className="text-muted-foreground">{translate('welcome.feature_1_desc', locale)}</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={staggerItem}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 p-8 transition-all duration-300 dark:from-slate-800 dark:to-slate-700">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            whileHover={{ opacity: 1 }}
                                        />
                                        <div className="relative">
                                            <motion.div
                                                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                                                >
                                                    <Users className="h-6 w-6" />
                                                </motion.div>
                                            </motion.div>
                                            <h3 className="mb-2 text-xl font-semibold text-foreground">
                                                {translate('welcome.feature_2_title', locale)}
                                            </h3>
                                            <p className="text-muted-foreground">{translate('welcome.feature_2_desc', locale)}</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={staggerItem}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-red-50 p-8 transition-all duration-300 dark:from-slate-800 dark:to-slate-700">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            whileHover={{ opacity: 1 }}
                                        />
                                        <div className="relative">
                                            <motion.div
                                                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        rotate: [0, 180, 360],
                                                    }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
                                                >
                                                    <Zap className="h-6 w-6" />
                                                </motion.div>
                                            </motion.div>
                                            <h3 className="mb-2 text-xl font-semibold text-foreground">
                                                {translate('welcome.feature_3_title', locale)}
                                            </h3>
                                            <p className="text-muted-foreground">{translate('welcome.feature_3_desc', locale)}</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={staggerItem}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 p-8 transition-all duration-300 dark:from-slate-800 dark:to-slate-700">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            whileHover={{ opacity: 1 }}
                                        />
                                        <div className="relative">
                                            <motion.div
                                                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity, delay: 1.1 }}>
                                                    <BookOpen className="h-6 w-6" />
                                                </motion.div>
                                            </motion.div>
                                            <h3 className="mb-2 text-xl font-semibold text-foreground">
                                                {translate('welcome.feature_4_title', locale)}
                                            </h3>
                                            <p className="text-muted-foreground">{translate('welcome.feature_4_desc', locale)}</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* Stats Section */}
                <AnimatedSection className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-24 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    {/* Animated background pattern */}
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'linear',
                        }}
                    />

                    {/* Floating geometric shapes */}
                    <motion.div
                        className="absolute top-20 left-10 h-20 w-20 rounded-full bg-blue-200/30 blur-xl"
                        animate={{
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute top-40 right-20 h-32 w-32 rounded-full bg-purple-200/30 blur-xl"
                        animate={{
                            y: [20, -20, 20],
                            x: [10, -10, 10],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-1/4 h-16 w-16 rounded-full bg-indigo-200/30 blur-xl"
                        animate={{
                            y: [-15, 15, -15],
                            x: [-5, 5, -5],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="mb-16 text-center"
                            variants={fadeInDown}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {translate('welcome.stats_title', locale)}
                            </h2>
                            <p className="mt-4 text-xl text-muted-foreground">{translate('welcome.stats_subtitle', locale)}</p>
                        </motion.div>

                        <motion.div
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div className="text-center" variants={bounceIn} whileHover={{ scale: 1.05 }}>
                                <motion.div
                                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
                                    variants={pulse}
                                    animate="pulse"
                                >
                                    {translate('welcome.stat_1_number', locale)}
                                </motion.div>
                                <motion.div className="mt-2 text-xl text-muted-foreground" variants={fadeInUp}>
                                    {translate('welcome.stat_1_label', locale)}
                                </motion.div>
                            </motion.div>

                            <motion.div className="text-center" variants={bounceIn} whileHover={{ scale: 1.05 }}>
                                <motion.div
                                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
                                    variants={pulse}
                                    animate="pulse"
                                >
                                    {translate('welcome.stat_2_number', locale)}
                                </motion.div>
                                <motion.div className="mt-2 text-xl text-muted-foreground" variants={fadeInUp}>
                                    {translate('welcome.stat_2_label', locale)}
                                </motion.div>
                            </motion.div>

                            <motion.div className="text-center" variants={bounceIn} whileHover={{ scale: 1.05 }}>
                                <motion.div
                                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
                                    variants={pulse}
                                    animate="pulse"
                                >
                                    {translate('welcome.stat_3_number', locale)}
                                </motion.div>
                                <motion.div className="mt-2 text-xl text-muted-foreground" variants={fadeInUp}>
                                    {translate('welcome.stat_3_label', locale)}
                                </motion.div>
                            </motion.div>

                            <motion.div className="text-center" variants={bounceIn} whileHover={{ scale: 1.05 }}>
                                <motion.div
                                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
                                    variants={pulse}
                                    animate="pulse"
                                >
                                    {translate('welcome.stat_4_number', locale)}
                                </motion.div>
                                <motion.div className="mt-2 text-xl text-muted-foreground" variants={fadeInUp}>
                                    {translate('welcome.stat_4_label', locale)}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* Newsletter Section */}
                <AnimatedSection className="bg-slate-50 py-24 dark:bg-background">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="mx-auto max-w-2xl text-center"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <motion.h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl" variants={fadeInUp}>
                                {translate('welcome.newsletter_title', locale)}
                            </motion.h2>
                            <motion.p className="mt-4 text-xl text-muted-foreground" variants={fadeInUp}>
                                {translate('welcome.newsletter_subtitle', locale)}
                            </motion.p>
                            <motion.div className="mt-8 flex flex-col gap-4 sm:flex-row" variants={fadeInUp}>
                                <motion.div className="flex-1" whileFocus={{ scale: 1.02 }}>
                                    <Input
                                        type="email"
                                        placeholder={translate('welcome.newsletter_placeholder', locale)}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-lg"
                                    />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:from-blue-700 hover:to-purple-700"
                                        onClick={() => {
                                            if (email) {
                                                setSubscribed(true);
                                                setEmail('');
                                            }
                                        }}
                                    >
                                        {translate('welcome.newsletter_button', locale)}
                                    </Button>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={subscribed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                {subscribed && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                                            <CheckCircle className="h-5 w-5" />
                                        </motion.div>
                                        {translate('welcome.newsletter_success', locale)}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </AnimatedSection>
                {/* Testimonials Section */}
                <AnimatedSection className="bg-background py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="mb-16 text-center"
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {translate('welcome.testimonials_title', locale)}
                            </h2>
                            <p className="mt-4 text-xl text-muted-foreground">{translate('welcome.testimonials_subtitle', locale)}</p>
                        </motion.div>

                        <motion.div
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div variants={fadeInLeft}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="p-8 shadow-lg">
                                        <motion.div
                                            className="mb-4 flex items-center gap-1"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.6 + i * 0.1 }}
                                                >
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                        <p className="mb-6 text-muted-foreground">
                                            "DevBlog has transformed how I learn new technologies. The quality of content and community engagement is
                                            outstanding."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            />
                                            <div>
                                                <div className="font-semibold">Sarah Johnson</div>
                                                <div className="text-sm text-muted-foreground">Senior Developer</div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="p-8 shadow-lg">
                                        <motion.div
                                            className="mb-4 flex items-center gap-1"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.8 + i * 0.1 }}
                                                >
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                        <p className="mb-6 text-muted-foreground">
                                            "The interactive tutorials and real-world examples have accelerated my learning curve significantly."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            />
                                            <div>
                                                <div className="font-semibold">Ahmed Al-Rashid</div>
                                                <div className="text-sm text-muted-foreground">Full Stack Developer</div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={fadeInRight}>
                                <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                    <Card className="p-8 shadow-lg">
                                        <motion.div
                                            className="mb-4 flex items-center gap-1"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1.0 + i * 0.1 }}
                                                >
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                        <p className="mb-6 text-muted-foreground">
                                            "As a beginner, the structured learning path and supportive community made my journey much easier."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            />
                                            <div>
                                                <div className="font-semibold">Maria Garcia</div>
                                                <div className="text-sm text-muted-foreground">Junior Developer</div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </AnimatedSection>

                {/* Latest Posts Section */}
                <section id="posts" className="bg-slate-50 py-24 dark:bg-background">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="mb-16 text-center"
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {translate('welcome.latest_posts', locale)}
                            </h2>
                            <p className="mt-4 text-xl text-muted-foreground">{translate('welcome.latest_subtitle', locale)}</p>
                        </motion.div>

                        <motion.div
                            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            {posts?.data?.map((post: BlogPost, index: number) => (
                                <motion.div key={post.id} variants={staggerItem} whileHover={{ y: -8 }}>
                                    <motion.div variants={cardHover} initial="rest" whileHover="hover">
                                        <Card className="group overflow-hidden bg-white shadow-lg transition-all duration-300 dark:bg-slate-700">
                                            <div className="relative h-48 overflow-hidden">
                                                {post.image_url ? (
                                                    <motion.img
                                                        src={post.image_url}
                                                        alt={post.title}
                                                        className="h-full w-full object-cover"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-600 dark:to-slate-500"></div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                {post.category && (
                                                    <motion.div
                                                        className="absolute top-4 left-4"
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.2 + index * 0.1 }}
                                                    >
                                                        <span
                                                            className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg"
                                                            style={{ backgroundColor: post.category.color }}
                                                        >
                                                            {post.category.name}
                                                        </span>
                                                    </motion.div>
                                                )}
                                                <div className="absolute right-4 bottom-4 left-4">
                                                    <h3 className="line-clamp-2 text-lg font-semibold text-white">
                                                        <Link href={`/posts/${post.id}`} className="hover:underline">
                                                            {post.title}
                                                        </Link>
                                                    </h3>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</span>
                                                    <span>•</span>
                                                    <span>
                                                        {translate('welcome.post.by', locale)}{' '}
                                                        {post.user?.name ?? translate('welcome.post.unknown', locale)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.1 }}>
                                                            <MessageCircle className="h-4 w-4" />
                                                            <span>{post.comments_count ?? 0}</span>
                                                        </motion.div>
                                                        <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.1 }}>
                                                            <Heart className="h-4 w-4" />
                                                            <span>{post.likes_count ?? 0}</span>
                                                        </motion.div>
                                                    </div>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-muted-foreground hover:text-foreground"
                                                            onClick={async () => {
                                                                try {
                                                                    await navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`);
                                                                } catch (error) {
                                                                    console.error('Failed to copy link to clipboard', error);
                                                                }
                                                            }}
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {posts?.links && posts.links.length > 0 && (
                            <motion.div
                                className="mt-12 flex flex-wrap items-center justify-center gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                {posts.links.map((link: PaginationLink, idx: number) =>
                                    link.url ? (
                                        <motion.div key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={link.url}
                                                className={`rounded-lg border px-4 py-2 transition-colors ${
                                                    link.active
                                                        ? 'border-blue-500 bg-blue-500 text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
                                                }`}
                                            >
                                                <span>{getPaginationLabel(link.label, locale)}</span>
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <span
                                            key={idx}
                                            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500 dark:border-gray-600 dark:bg-slate-600 dark:text-gray-400"
                                        >
                                            <span>{getPaginationLabel(link.label, locale)}</span>
                                        </span>
                                    ),
                                )}
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>
            <AppFooter />
        </>
    );
}
