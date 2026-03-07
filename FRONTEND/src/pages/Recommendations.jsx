import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRecommendations } from '../services/recommendApi';
import ProductCard from '../components/shared/ProductCard';
import Loader from '../components/ui/Loader';
import { ChromeButton } from '../components/ui/ChromeButton';
import { GlassCard } from '../components/ui/GlassCard';
import { useLocation } from 'react-router-dom';

const Recommendations = () => {
  const [searchParams] = useSearchParams();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchRecommendations = async () => {
    setIsLoading(true);
    // Parse tags from URL (e.g. ?tags=casual,streetwear)
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',') : [];

    if (!tags.length) {
      setIsLoading(false);
      return; 
    }

    try {
      const data = await getRecommendations(tags);
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch on mount since data is already gathered
    fetchRecommendations();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen">
        <Loader message="CALCULATING COSINE SIMILARITY..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 px-8 min-h-screen text-center">
        <h1 className="font-orbitron text-red-500 text-3xl mb-4">SYSTEM ERROR</h1>
        <p className="font-space text-chrome-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-8 pb-24 min-h-screen">
      <h1 className="font-orbitron text-3xl md:text-5xl mb-4 chrome-text text-center uppercase">
        RECOMMENDED FOR YOU
      </h1>
      <p className="text-center font-space text-chrome-400 mb-12 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        Based on detected styles vector: 
        {searchParams.get('tags')?.split(',').map(tag => (
           <span key={tag} className="text-neon-cyan border border-neon-cyan/50 px-2 py-1 rounded text-xs uppercase bg-neon-cyan/10">
             {tag.trim()}
           </span>
        ))}
      </p>

      {recommendations.length === 0 ? (
        <div className="text-center font-space text-chrome-500">
           No matching styles found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {recommendations.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
