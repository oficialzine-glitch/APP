import React from 'react';

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
    title: 'Colored Highlights',
    subtitle: '2,340 Used by people',
    badge: 'NEW',
    gradient: 'from-cyan-500 via-blue-500 to-blue-600',
    hairstyles: [
      { id: '1', image: 'https://via.placeholder.com/400x400/a78bfa/ffffff?text=Ombre+Blonde', title: 'Ombre Blonde' },
      { id: '2', image: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Rose+Gold', title: 'Rose Gold' },
    ]
  },
  {
    id: 'wavy',
    title: 'Wavy & Curly',
    subtitle: '3,156 Used by people',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    hairstyles: [
      { id: '1', image: 'https://via.placeholder.com/400x400/64748b/ffffff?text=Loose+Curls', title: 'Loose Curls' },
      { id: '2', image: 'https://via.placeholder.com/400x400/475569/ffffff?text=Tight+Curls', title: 'Tight Curls' },
      { id: '3', image: 'https://via.placeholder.com/400x400/64748b/ffffff?text=Beach+Waves', title: 'Beach Waves' },
      { id: '4', image: 'https://via.placeholder.com/400x400/475569/ffffff?text=Soft+Waves', title: 'Soft Waves' },
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="pt-4 pb-6">
          <h1 className="text-3xl font-bold text-white">Hairstyle Gallery</h1>
          <p className="text-slate-400 mt-2">Explore and try on different hairstyle categories</p>
        </div>

        {/* Hairstyle Categories */}
        <div className="space-y-10">
          {hairstyleCategories.map((category) => (
            <div key={category.id} className="animate-fade-in">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.gradient} rounded-3xl p-8 mb-6 relative overflow-hidden`}>

                {category.badge && (
                  <div className="absolute top-4 left-6 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-bold text-sm uppercase">{category.badge}</span>
                  </div>
                )}

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                  <p className="text-white/70 mt-2">{category.subtitle}</p>
                </div>
              </div>

              {/* Hairstyle Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center py-8">
          <div className="relative inline-block overflow-visible isolate">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400/35 via-blue-500/28 to-blue-600/28 blur-2xl -z-10"
            />
            <button
              className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ring-1 ring-inset ring-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 overflow-visible"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl [background:radial-gradient(120%_60%_at_80%_50%,rgba(255,255,255,.16)_0%,transparent_55%)] opacity-70"
              />
              <span className="relative z-10">Try on haircuts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
