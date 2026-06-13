'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        // Check if user has completed onboarding
        const { data: userProfile } = await supabase
          .from('users')
          .select('preferred_name, exams')
          .eq('id', session.user.id)
          .single();
          
        if (userProfile && userProfile.preferred_name) {
          router.push('/chat');
        } else {
          router.push('/onboarding');
        }
      }
    };
    
    checkSession();
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && <p>Awakening the Cosmos...</p>}
    </div>
  );
}
