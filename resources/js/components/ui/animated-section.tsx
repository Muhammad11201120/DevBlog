import { motion, type Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedSectionProps {
    children: React.ReactNode;
    variants?: Variants;
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

export function AnimatedSection({
    children,
    variants,
    className = '',
    delay = 0,
    duration = 0.6,
    threshold = 0.1,
    once = true,
}: AnimatedSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        threshold,
        once,
        margin: '-50px 0px',
    });

    const defaultVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 60,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                delay,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants || defaultVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    threshold?: number;
    once?: boolean;
}

export function AnimatedContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    threshold = 0.1,
    once = true,
}: AnimatedContainerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        threshold,
        once,
        margin: '-50px 0px',
    });

    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={itemVariants}>
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
}

interface AnimatedTextProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

export function AnimatedText({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    threshold = 0.1,
    once = true,
}: AnimatedTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        threshold,
        once,
        margin: '-20px 0px',
    });

    const textVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                delay,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hover?: boolean;
    threshold?: number;
    once?: boolean;
}

export function AnimatedCard({
    children,
    className = '',
    delay = 0,
    hover = true,
    threshold = 0.1,
    once = true,
}: AnimatedCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        threshold,
        once,
        margin: '-50px 0px',
    });

    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay,
                ease: 'easeOut',
            },
        },
        hover: hover ? {
            scale: 1.05,
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: {
                duration: 0.3,
                ease: 'easeOut',
            },
        } : undefined,
    };

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={hover ? 'hover' : undefined}
            className={className}
        >
            {children}
        </motion.div>
    );
}
