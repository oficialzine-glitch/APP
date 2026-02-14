import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HaircutsPageProps {
  onBack: () => void;
}

interface HairstyleCard {
  id: string;
  image: string;
  title?: string;
}

interface HairstyleCategory {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  gradient: string;
  hairstyles: HairstyleCard[];
}

const hairstyleCategories: HairstyleCategory[] = [
  {
    id: 'color',
    title: 'Classic Hairstyles',
    subtitle: '2,340 Used by people',
    badge: 'NEW',
    gradient: 'from-cyan-500 via-blue-500 to-blue-600',
    hairstyles: [
      { id: '1', image: 'https://via.placeholder.com/400x400/a78bfa/ffffff?text=Ombre+Blonde', title: 'Side Part' },
      { id: '2', image: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Rose+Gold', title: 'Wavy Side Part' },
      { id: '3', image: 'https://via.placeholder.com/400x400/a78bfa/ffffff?text=Platinum+Blonde', title: 'Buzz Cut' },
      { id: '4', image: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Cherry+Red', title: 'Beach Waves' },
      { id: '5', image: 'https://via.placeholder.com/400x400/a78bfa/ffffff?text=Silver+Ash', title: 'Middle Part' },
      { id: '6', image: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Copper+Gold', title: 'Warrior Cut' },
    ]
  },
  {
    id: 'wavy',
    title: 'Popular Styles',
    subtitle: '3,156 Used by people',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    hairstyles: [
      { id: '1', image: 'https://via.placeholder.com/400x400/64748b/ffffff?text=Loose+Curls', title: 'Bleached buzz' },
      { id: '2', image: 'https://via.placeholder.com/400x400/475569/ffffff?text=Tight+Curls', title: 'Messy Hair' },
    ]
  },
  {
    id: 'short',
    title: 'Short & Chic',
    subtitle: '1,892 Used by people',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    hairstyles: [
      { id: '1', image: 'https://via.placeholder.com/400x400/14b8a6/ffffff?text=Pixie+Cut', title: 'Pixie Cut' },
      { id: '2', image: 'https://via.placeholder.com/400x400/06b6d4/ffffff?text=Bob+Cut', title: 'Bob Cut' },
      { id: '3', image: 'https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Shag', title: 'Shag' },
      { id: '4', image: 'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Crop', title: 'Crop' },
    ]
  },
];

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20 pt-8">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-16">
          {hairstyleCategories.map((category, index) => (
            <div key={category.id} className="animate-fade-in">
              {index === 0 ? (
                <div className="flex flex-col gap-8">
                  <div className={`bg-gradient-to-r ${category.gradient} rounded-3xl p-6 relative overflow-hidden`}>
                    {category.badge && (
                      <div className="absolute top-3 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white font-bold text-xs uppercase">{category.badge}</span>
                      </div>
                    )}
                    <div className="relative z-10 pt-6">
                      <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                      <p className="text-white/70 mt-1 text-sm">{category.subtitle}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 bg-slate-700/40 hover:bg-slate-600/50 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center">
                      <ChevronLeft className="w-5 h-5 text-slate-300" />
                    </button>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {category.hairstyles.map((hairstyle) => (
                        <div
                          key={hairstyle.id}
                          className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105"
                        >
                          <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                            <img
                              src={hairstyle.image}
                              alt={hairstyle.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {hairstyle.title && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent">
                              <p className="text-white text-sm font-medium">{hairstyle.title}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : index === 1 ? (
                <div className="flex flex-col gap-8">
                  <div className={`bg-gradient-to-r ${category.gradient} rounded-3xl p-6 relative overflow-hidden`}>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                      <p className="text-white/70 mt-1 text-sm">{category.subtitle}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 bg-slate-700/40 hover:bg-slate-600/50 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center">
                      <ChevronLeft className="w-5 h-5 text-slate-300" />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      {category.hairstyles.map((hairstyle) => (
                        <div
                          key={hairstyle.id}
                          className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-700/30 hover:border-slate-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 transform hover:scale-105"
                        >
                          <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                            <img
                              src={hairstyle.image}
                              alt={hairstyle.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {hairstyle.title && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent">
                              <p className="text-white text-sm font-medium">{hairstyle.title}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
