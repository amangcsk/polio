import { LearningResourceList } from '../LearningResourceList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function LearningResourceListExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-16">
        <div>
          <h2 className="text-2xl font-bold mb-8">일반 사용자 뷰</h2>
          <LearningResourceList />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-8">관리자 뷰</h2>
          <LearningResourceList showManagement={true} />
        </div>
      </div>
    </QueryClientProvider>
  );
}