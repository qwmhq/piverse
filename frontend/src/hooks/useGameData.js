import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import * as api from '../services/api';

export function useLiveFeed() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['feed'],
    queryFn: api.fetchFeed,
    refetchOnWindowFocus: false // rely on socket for updates
  });

  useEffect(() => {
    const handleNewFeedEvent = (newEvent) => {
      // Transform socket event to match feed item format
      // Socket sends: { type, walletAddress, userMessage, aiResponse, timestamp }
      // Feed expects: { role, content, walletAddress, createdAt, _id }
      
      if (newEvent.type === 'chat' && newEvent.userMessage && newEvent.aiResponse) {
        const userMsg = {
          _id: `user_${Date.now()}`,
          role: 'user',
          content: newEvent.userMessage,
          walletAddress: newEvent.walletAddress,
          createdAt: newEvent.timestamp,
          isNew: true // Flag for animation
        };
        
        const aiMsg = {
          _id: `ai_${Date.now() + 1}`,
          role: 'ai', 
          content: newEvent.aiResponse,
          walletAddress: newEvent.walletAddress,
          createdAt: newEvent.timestamp,
          isNew: true // Flag for animation
        };
        
        queryClient.setQueryData(['feed'], (oldData) => {
          if(!oldData) return [aiMsg, userMsg];
          // Prepend both messages (AI first since feed is reversed)
          return [aiMsg, userMsg, ...oldData].slice(0, 50);
        });
      } else {
        // Fallback for other event types
        queryClient.setQueryData(['feed'], (oldData) => {
          if(!oldData) return [newEvent];
          return [newEvent, ...oldData].slice(0, 50);
        });
      }
    };

    // Attach the listener
    socket.on('new_feed_event', handleNewFeedEvent);
    
    // Re-attach on reconnection to ensure we don't miss events
    socket.on('connect', () => {
      console.log('[Socket] Connected - Feed listener active');
    });

    return () => {
      socket.off('new_feed_event', handleNewFeedEvent);
      socket.off('connect');
    };
  }, [queryClient]);

  return query;
}

export function useGameStats() {
    const [watcherCount, setWatcherCount] = useState(0);

    const query = useQuery({
        queryKey: ['gameStats'],
        queryFn: async () => {
             // Get the current game ID from the backend
             const backendStats = await api.fetchStats();
             
             if (!backendStats?.gameId) {
                 return {
                     status: "not_initialized",
                     name: "OFFLINE",
                     jackpot: 0,
                     totalAttempts: 0,
                     attemptPrice: 0.01,
                     pda: null,
                     gameId: null,
                     devWallet: null,
                     initialized: false
                 };
             }

             // Return backend stats directly
             return {
                 status: backendStats.status || "active",
                 name: backendStats.name || "CLAW VERSE",
                 jackpot: backendStats.jackpot || 0,
                 totalAttempts: backendStats.totalAttempts || 0,
                 attemptPrice: 0.00, 
                 pda: "OFF_CHAIN_PDA",
                 gameId: backendStats.gameId,
                 devWallet: "OFF_CHAIN",
                 endTime: Date.now() + 86400000, 
                 marketStatus: 'active',
                 winner: null, 
                 initialized: true
             };
        },
        refetchInterval: 10000,
        retry: 2,
    });

    useEffect(() => {
        socket.on('watcher_count', (count) => {
            setWatcherCount(count);
        });

        return () => {
             socket.off('watcher_count');
        }
    }, []);

    return { ...query, watcherCount };
}

export function useMarketStats() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['market'],
        queryFn: api.fetchMarketStats,
    });

    useEffect(() => {
        socket.on('market_stats_update', (newStats) => {
             queryClient.setQueryData(['market'], newStats);
        });
        
        return () => {
            socket.off('market_stats_update');
        }
    }, [queryClient]);

    return query;
}

export function useUserPredictions(walletAddress) {
    return useQuery({
        queryKey: ['predictions', walletAddress],
        queryFn: () => api.fetchUserPredictions(walletAddress),
        enabled: !!walletAddress
    });
}

export function usePlacePrediction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.placePrediction,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['predictions', variables.walletAddress]);
            queryClient.invalidateQueries(['activePrediction', variables.walletAddress]);
        }
    });
}

export function useSendChatMessage() {
     return useMutation({
        mutationFn: api.sendChatMessage,
     });
}

export function useActivePrediction(walletAddress, gameStats) {
  // Placeholder for active prediction since on-chain logic is removed
  return useQuery({
      queryKey: ['activePrediction', walletAddress, gameStats?.pda],
      queryFn: async () => {
          // Return null for now or mock data if needed
          return null;
      },
      enabled: !!walletAddress && !!gameStats?.pda
  });
}
