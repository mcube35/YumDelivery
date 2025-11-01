import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,  // 1분 - 데이터 신선도 유지
      gcTime: 5 * 60 * 1000,      // 5분 - 캐시 보관 시간
      retry: 1,                   // 실패 시 1번 재시도
      refetchOnWindowFocus: false, // 탭 전환시 refetch 안함
      refetchOnMount: true,       // 마운트 시 stale이면 refetch
      refetchOnReconnect: true,   // 네트워크 재연결 시 refetch
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
