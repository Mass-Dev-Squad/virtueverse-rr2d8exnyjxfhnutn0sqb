import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Leaf, Heart, Users, ShieldCheck } from 'lucide-react';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
export function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-foreground">
      <ThemeToggle className="absolute top-4 right-4" />
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Leaf className="text-white" />
          </div>
          VirtueVerse
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-800 dark:text-gray-100 leading-tight">
                Turn Good Deeds into Good Vibes.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                VirtueVerse is a whimsical community platform where every act of kindness is celebrated. Track your contributions, earn points, and see the positive impact ripple through your neighborhood.
              </p>
              <div className="mt-8 flex justify-center md:justify-start gap-4">
                <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:-translate-y-1 transition-transform">
                  <Link to="/signup">Start Doing Good</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <img src="/illustrations/hero-community.svg" alt="Illustration of diverse people working together in a community" className="w-full h-auto" />
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">A simple, joyful way to build a better community.</p>
            </div>
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <FeatureCard icon={<Heart />} title="Log Your Deeds" description="Easily submit acts of kindness, from helping a neighbor to cleaning a park." />
              <FeatureCard icon={<ShieldCheck />} title="Get Verified" description="Our community admins review submissions to ensure every good deed is recognized." />
              <FeatureCard icon={<Leaf />} title="Earn Virtue Points" description="Collect points for each verified deed and watch your positive impact grow." />
              <FeatureCard icon={<Users />} title="Climb the Leaderboard" description="Celebrate collective effort and inspire others on the community leaderboard." />
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="py-8 bg-gray-100 dark:bg-gray-950 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VirtueVerse. Built with ❤️ at Cloudflare.</p>
        </div>
      </footer>
    </div>
  );
}
const FeatureCard = ({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) => (
  <motion.div variants={itemVariants} className="text-center p-6 bg-background rounded-lg shadow-sm hover:shadow-lg transition-shadow">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-4">
      {React.cloneElement(icon, { className: "w-8 h-8 text-amber-500" })}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);