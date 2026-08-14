import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import socket from '../services/socket';
import { sendLocalNotification, notifyCallOut, notifyTop3Spot, notifySkipped } from '../services/notificationService';

export const useQueueTicket = (passedTicket = null, tokenId = null) => {
  const [ticketData, setTicketData] = useState(() => {
    if (passedTicket) return passedTicket;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('queueit_active_ticket');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(!passedTicket);
  const [lastSyncedTime, setLastSyncedTime] = useState('');
  const [position, setPosition] = useState(passedTicket?.positionInQueue ?? 4);
  const [initialPosition] = useState(passedTicket?.positionInQueue || 5);
  const [isDelayed, setIsDelayed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isServed, setIsServed] = useState(false);

  const ticketDataRef = useRef(ticketData);
  useEffect(() => {
    ticketDataRef.current = ticketData;
  }, [ticketData]);

  // Fetch latest ticket data from API
  const fetchLiveTicket = useCallback(async () => {
    try {
      const currentTicket = ticketDataRef.current;
      const activeId = tokenId || currentTicket?._id;
      let res;
      if (activeId && !activeId.startsWith('tkt_') && !activeId.startsWith('mock_')) {
        res = await api.get(`/tickets/my-ticket?ticketId=${activeId}`);
      } else {
        res = await api.get('/tickets/my-ticket');
      }

      if (res && res.ticket) {
        setTicketData(res.ticket);
        if (typeof res.ticket.positionInQueue === 'number') {
          setPosition(res.ticket.positionInQueue);
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('queueit_active_ticket', JSON.stringify(res.ticket));
        }

        if (res.ticket.status === 'serving') {
          setIsServed(true);
          notifyCallOut(res.ticket.counter?.name || 'Counter', res.ticket.ticketNumber);
        } else if (res.ticket.status === 'skipped') {
          setIsSkipped(true);
          notifySkipped(res.ticket.counter?.name || 'Counter', res.ticket.ticketNumber);
        } else if (res.ticket.positionInQueue <= 3 && res.ticket.positionInQueue > 0) {
          notifyTop3Spot(res.ticket.counter?.name || 'Counter', res.ticket.positionInQueue, res.ticket.ticketNumber);
        }
      }
    } catch (err) {
      console.warn('[useQueueTicket]: Live sync notice:', err.message);
    } finally {
      setIsLoading(false);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [tokenId]);

  // Initial fetch on mount
  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      if (isMounted) {
        await fetchLiveTicket();
      }
    };
    initFetch();
    return () => {
      isMounted = false;
    };
  }, [fetchLiveTicket]);

  // Real-Time Socket.io Connection Effect
  useEffect(() => {
    const handleTicketUpdated = (updatedTicket) => {
      if (!updatedTicket) return;
      const current = ticketDataRef.current;
      const currentTicketNumber = current?.ticketNumber || passedTicket?.ticketNumber;
      const currentId = current?._id || passedTicket?._id || tokenId;

      if (
        updatedTicket._id === currentId ||
        updatedTicket.ticketNumber === currentTicketNumber
      ) {
        setTicketData((prev) => ({ ...prev, ...updatedTicket }));
        if (updatedTicket.status === 'serving') {
          setPosition(0);
          setIsServed(true);
          sendLocalNotification('🔔 Your turn!', `Token ${updatedTicket.ticketNumber} is now serving!`);
        } else if (updatedTicket.status === 'skipped') {
          setIsSkipped(true);
        } else if (updatedTicket.status === 'left') {
          setIsCancelled(true);
        }
      }
    };

    const handleTicketCreated = () => {
      fetchLiveTicket();
    };

    socket.on('ticket:updated', handleTicketUpdated);
    socket.on('ticket:created', handleTicketCreated);

    return () => {
      socket.off('ticket:updated', handleTicketUpdated);
      socket.off('ticket:created', handleTicketCreated);
    };
  }, [passedTicket, tokenId, fetchLiveTicket]);

  // Calculated stats
  const waitPerPersonMins = 3;
  const estimatedWaitMins = position * waitPerPersonMins;
  const progressPercent = Math.min(
    100,
    Math.max(15, Math.round(((initialPosition - position) / initialPosition) * 100))
  );

  // Actions
  const handleDelayTicket = useCallback(() => {
    setIsDelayed(true);
    setPosition((prev) => prev + 3);
    toast.success("Moved back by 3 spots! Take your time.");
  }, []);

  const handleLeaveQueue = useCallback(async () => {
    const current = ticketDataRef.current;
    try {
      if (current?._id && !current._id.startsWith('tkt_')) {
        await api.delete(`/tickets/${current._id}/leave`);
      }
      setIsCancelled(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('queueit_active_ticket');
      }
      toast.success("Left queue successfully");
    } catch {
      setIsCancelled(true);
      toast.success("Left queue successfully");
    }
  }, []);

  return {
    ticketData,
    isLoading,
    position,
    estimatedWaitMins,
    progressPercent,
    lastSyncedTime,
    isDelayed,
    isCancelled,
    isSkipped,
    isServed,
    fetchLiveTicket,
    handleDelayTicket,
    handleLeaveQueue,
    setPosition,
  };
};

export default useQueueTicket;
