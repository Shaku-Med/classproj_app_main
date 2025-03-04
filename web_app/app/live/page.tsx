'use client'
import React, { useState } from 'react';
import { Search, Star, Users, Wifi } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function StreamerCard({ streamer }: any) {
  return (
    <Card className=" rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="relative">
        <img 
          src={streamer.thumbnail} 
          alt={`${streamer.name}'s stream`} 
          className="w-full h-40 object-cover aspect-square"
        />
        {streamer.isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            <span>LIVE</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          {streamer.viewers} viewers
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={streamer.avatar} 
            alt={streamer.name} 
            className="w-10 h-10 rounded-full border-2 border-purple-500"
          />
          <div>
            <h3 className=" font-bold truncate">{streamer.name}</h3>
            <p className=" opacity-[.7] text-sm truncate">{streamer.category}</p>
          </div>
        </div>
        <p className=" opacity-[.6] text-sm mt-2 line-clamp-2">{streamer.description}</p>
        <div className="flex justify-between mt-3 text-xs opacity-[.8]">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{streamer.followers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{streamer.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  
  // Mock data for demo purposes
  const streamers = [
    {
      id: 1,
      name: "GamerPro99",
      category: "Valorant",
      description: "Top 500 player grinding ranked. Road to Radiant!",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: true,
      viewers: 1243,
      followers: "45.2K",
      rating: 4.8
    },
    {
      id: 2,
      name: "ArtistAtWork",
      category: "Digital Art",
      description: "Creating digital art and taking commissions. Join the creative journey!",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: true,
      viewers: 552,
      followers: "23.1K",
      rating: 4.7
    },
    {
      id: 3,
      name: "TechTalker",
      category: "Just Chatting",
      description: "Discussing the latest tech news and answering your questions!",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: false,
      viewers: 0,
      followers: "89.5K",
      rating: 4.9
    },
    {
      id: 4,
      name: "ChessGrandmaster",
      category: "Chess",
      description: "International Master analyzing games and teaching strategies.",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: true,
      viewers: 876,
      followers: "120K",
      rating: 4.9
    },
    {
      id: 5,
      name: "MusicMaestro",
      category: "Music",
      description: "Live piano sessions and taking song requests from viewers.",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: false,
      viewers: 0,
      followers: "67.8K",
      rating: 4.6
    },
    {
      id: 6,
      name: "FitnessFreak",
      category: "Fitness",
      description: "Daily workout streams and nutrition tips for a healthier lifestyle.",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: true,
      viewers: 421,
      followers: "34.2K",
      rating: 4.7
    },
    {
      id: 7,
      name: "CookingChampion",
      category: "Cooking",
      description: "Professional chef cooking restaurant-quality dishes at home.",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: false,
      viewers: 0,
      followers: "56.3K", 
      rating: 4.8
    },
    {
      id: 8,
      name: "ComedyKing",
      category: "Just Chatting",
      description: "Bringing laughter to your day with jokes and funny stories.",
      thumbnail: `https://wallpaperaccess.com/full/393735.jpg`,
      avatar: `https://th.bing.com/th/id/OIP.c2WZQrwIUTWpk-EpfkQr8AHaFj?rs=1&pid=ImgDetMain`,
      isLive: true,
      viewers: 1879,
      followers: "98.7K",
      rating: 4.9
    }
  ];

  // Filter streamers based on search query and filter option
  const filteredStreamers = streamers.filter(streamer => {
    const matchesSearch = streamer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          streamer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          streamer.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterOption === 'live') {
      return matchesSearch && streamer.isLive;
    } else if (filterOption === 'offline') {
      return matchesSearch && !streamer.isLive;
    } else {
      return matchesSearch;
    }
  });

  return (
    <div className=" h-full overflow-auto">
      {/* Header */}
      <header className=" bg-muted shadow-md z-[1000000] sticky top-0 left-0">
        <div className="container mx-auto px-4 py-[1.2rem] ">
          <h1 className="text-3xl font-bold ">Chatzy - Streams</h1>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search streamers, categories, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <Button variant={`outline`}
              onClick={() => setFilterOption('all')}
              className={`px-4 py-2 rounded-lg ${filterOption === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-secondary/50 hover:bg-secondary'} transition-colors`}
            >
              All
            </Button>
            <Button variant={`outline`}
              onClick={() => setFilterOption('live')}
              className={`px-4 py-2 rounded-lg ${filterOption === 'live' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-secondary/50 hover:bg-secondary'} transition-colors flex items-center gap-1`}
            >
              <Wifi className="w-4 h-4" />
              Live
            </Button>
            <Button variant={`outline`}
              onClick={() => setFilterOption('offline')}
              className={`px-4 py-2 rounded-lg ${filterOption === 'offline' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-secondary/50 hover:bg-secondary'} transition-colors`}
            >
              Offline
            </Button>
          </div>
        </div>
      </section>

      {/* Results Counter */}
      <section className="container mx-auto px-4 pb-4">
        <p className="text-gray-400">Showing {filteredStreamers.length} results</p>
      </section>

      {/* Stream Grid */}
      <section className="container mx-auto px-4 pb-12">
        {filteredStreamers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredStreamers.map(streamer => (
              <StreamerCard key={streamer.id} streamer={streamer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-300">No streams found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter options</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;