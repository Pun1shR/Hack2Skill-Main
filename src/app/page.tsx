'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login as engineering student per request
    localStorage.setItem('guru_user_id', 'eng');
    router.push('/chat');
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && <p>Awakening the Cosmos...</p>}
    </div>
  );
}
