import { Suspense } from 'react';
import TutorialPage from '@/components/TutorialPage';

export default function TutorialLevelPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center bg-[#121212] text-[#FFFFFF]">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    }>
      <TutorialPage />
    </Suspense>
  );
}

