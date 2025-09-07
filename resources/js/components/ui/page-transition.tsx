import { motion, type Variants } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="in"
            exit="out"
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedPageProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
}

export function AnimatedPage({ children, className = '', variants }: AnimatedPageProps) {
    const defaultVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            variants={variants || defaultVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    );
}
