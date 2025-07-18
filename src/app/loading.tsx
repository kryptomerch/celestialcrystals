import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <LoadingSpinner 
        size="lg" 
        text="Loading your crystal journey..." 
        className="py-20"
      />
    </div>
  );
}
