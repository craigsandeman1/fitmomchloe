import { useState, useEffect } from 'react';
import { useVideoStore } from '../store/video';
import { useAuthStore } from '../store/auth';
import { Play, Lock, Clock, ChevronDown, ChevronUp, Filter, ArrowRight } from 'lucide-react';
import { Auth } from '../components/Auth';
import SEO from '../components/SEO';
import workoutVideo from '../assets/videos/working-out.mp4';

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

const Workouts = () => {
  const { user } = useAuthStore();
  const {
    videos,
    categories,
    userSubscription,
    userPurchases,
    loading,
    error,
    fetchVideos,
    fetchCategories,
    fetchUserSubscription,
    fetchUserPurchases,
  } = useVideoStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
    if (user) {
      fetchUserSubscription();
      fetchUserPurchases();
    }
  }, [user]);

  const filteredVideos = videos.filter(video => {
    const categoryMatch = selectedCategory === 'all' || video.category_id === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || video.difficulty_level === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const canAccessVideo = (videoId: string) => {
    if (!user) return false;
    if (userSubscription?.status === 'active') return true;
    return userPurchases.some(purchase => purchase.video_id === videoId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="30-Minute Workouts That Melt Mom Belly Fat | No Gym Required | Fit Mom Chloe" 
        description="Discover how busy moms are transforming their bodies with these quick, effective workouts you can do at home. Tired of workouts that don't deliver results?" 
        canonicalUrl="/workouts"
      />
      {/* Hero Section - Visible to all */}
      <div className="relative overflow-hidden bg-background min-h-[85vh]">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
          >
            <source src={workoutVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/30" />
        </div>

        {/* Main Content */}
        <div className="relative min-h-[85vh] flex items-center">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div>
                <h1 className="font-playfair text-5xl md:text-6xl mb-6">
                  Transform Your Body,{' '}
                  <span className="text-primary">Transform Your Life</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Access our premium library of professionally crafted workout videos designed to help you achieve your fitness goals.
                </p>

                {/* Featured Categories */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {categories.slice(0, 4).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-left group relative overflow-hidden hover:-translate-y-1"
                    >
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Explore</span>
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!user ? (
                    <button 
                      onClick={() => {/* Implement trial signup */}}
                      className="btn-primary relative overflow-hidden group hover:-translate-y-1 transition-all"
                    >
                      <span className="relative z-10">Start 7-Day Free Trial</span>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const element = document.getElementById('workout-library');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary relative overflow-hidden group hover:-translate-y-1 transition-all"
                    >
                      <span className="relative z-10">View Your Library</span>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column - Featured Video Preview */}
              <div className="relative aspect-[4/3] bg-white rounded-2xl shadow-2xl overflow-hidden group hover:-translate-y-2 transition-all cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                  alt="Featured Workout"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-medium mb-2">Featured: Full Body HIIT</h3>
                    <p className="text-white/80 text-sm">
                      30-minute high-intensity workout to boost your metabolism
                    </p>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors transform group-hover:scale-110">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Workout Library Section - Protected */}
      {!user ? (
        <div className="section-container py-20">
          <h1 className="font-playfair text-4xl mb-8 text-center">Access Premium Workouts</h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in or create an account to access our premium workout content.
          </p>
          <div className="max-w-md mx-auto">
            <Auth />
          </div>
        </div>
      ) : (
        <div id="workout-library" className="section-container py-20">
          {/* Filters */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-primary mb-4"
            >
              <Filter size={20} className="mr-2" />
              <span>Filter Videos</span>
              {showFilters ? <ChevronUp size={20} className="ml-2" /> : <ChevronDown size={20} className="ml-2" />}
            </button>

            {showFilters && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Levels</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading videos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail_url || 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {canAccessVideo(video.id) ? (
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Play size={48} className="text-white" />
                      </a>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Lock size={24} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-playfair text-xl mb-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{video.duration || '30 mins'}</span>
                      </div>
                      {video.difficulty_level && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {video.difficulty_level}
                        </span>
                      )}
                    </div>

                    {!canAccessVideo(video.id) && (
                      <div className="mt-4 pt-4 border-t">
                        {video.individual_price ? (
                          <button
                            onClick={() => {/* Implement purchase flow */}}
                            className="w-full btn-primary"
                          >
                            Purchase for R{video.individual_price}
                          </button>
                        ) : (
                          <button
                            onClick={() => {/* Implement subscription flow */}}
                            className="w-full btn-primary"
                          >
                            Subscribe to Access
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredVideos.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No videos found matching your filters.
                </div>
              )}
            </div>
          )}

          {/* Subscription CTA */}
          {!userSubscription?.status && (
            <div className="mt-16 bg-primary/10 rounded-lg p-8 text-center">
              <h2 className="font-playfair text-2xl mb-4">Get Unlimited Access</h2>
              <p className="text-gray-600 mb-6">
                Subscribe to access all workout videos and exclusive content.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="btn-primary">
                  Monthly Plan - R299/month
                </button>
                <button className="btn-primary">
                  Yearly Plan - R2999/year
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Workouts;