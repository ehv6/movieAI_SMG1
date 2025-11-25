import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

export default function WhereToWatch({ movieId }) {
  const { t } = useI18n();
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!movieId) return;

    async function fetchProviders() {
      try {
        setLoading(true);
        const res = await fetch(`/api/movies/${movieId}/providers?country=US`);
        if (!res.ok) throw new Error('Failed to fetch streaming info');
        const data = await res.json();
        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, [movieId]);

  if (loading) return <p className="text-gray-300">{t('loadingStreamingInfo')}</p>;
  if (error) return <p className="text-red-300">{error}</p>;

  if (!providers) return null;

  const hasFlatrate = providers.flatrate?.length > 0;
  const hasRent = providers.rent?.length > 0;
  const hasBuy = providers.buy?.length > 0;

  return (
    <div className="mt-4">
      {hasFlatrate && (
        <div className="mb-4">
          <h4 className="font-semibold text-white text-shadow-md mb-2">{t('stream')}</h4>
          <ProviderRow list={providers.flatrate} />
        </div>
      )}

      {hasRent && (
        <div className="mb-4">
          <h4 className="font-semibold text-white text-shadow-md mb-2">{t('rent')}</h4>
          <ProviderRow list={providers.rent} />
        </div>
      )}

      {hasBuy && (
        <div>
          <h4 className="font-semibold text-white text-shadow-md mb-2">{t('buy')}</h4>
          <ProviderRow list={providers.buy} />
        </div>
      )}

      {!hasFlatrate && !hasRent && !hasBuy && (
        <p className="text-gray-300">{t('noStreamingData')}</p>
      )}
    </div>
  );
}

function ProviderRow({ list }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {list.map((p) => (
        <div key={p.providerId} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
          {p.logoUrl && (
            <img
              src={p.logoUrl}
              alt={p.name}
              className="w-8 h-8 rounded"
              title={p.name}
            />
          )}
          <span className="text-sm text-white font-medium">{p.name}</span>
        </div>
      ))}
    </div>
  );
}
