import React, { useEffect, useState } from 'react';
import ProductCard from '../components/shared/ProductCard';
import Loader from '../components/ui/Loader';
import { getProducts } from '../services/productApi';

const CommunityFeed = () => {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // We'll mock the community feed using the normal products API for now
        // In reality, this would hit GET /api/designs/community
        const data = await getProducts();
        // Shuffle the array to simulate a random social feed
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFeed(shuffled);
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen">
        <Loader message="SYNCING WITH COMMUNITY NETWORK..." />
      </div>
    );
  }

  return (
    <div className="pt-24 px-8 pb-24 min-h-screen">
      <div className="text-center mb-12">
         <h1 className="font-orbitron text-3xl md:text-5xl mb-4 chrome-text uppercase">
           PUBLIC FEED
         </h1>
         <p className="font-space text-chrome-400 max-w-2xl mx-auto">
           Showing the latest aesthetic vectors generated and published by the network.
         </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {feed.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
