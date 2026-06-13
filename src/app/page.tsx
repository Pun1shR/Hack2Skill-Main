'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('guru_user_id');
    
    if (!userId) {
      router.push('/login');
    } else {
      router.push('/chat');
    }
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && <p>Awakening the Cosmos...</p>}
    </div>
  );
}
