import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useQueueTicket from '../hooks/useQueueTicket';
import useAudioNotification from '../hooks/useAudioNotification';
import LiveQueueHeader from '../components/queue/LiveQueueHeader';
import LivePositionTracker from '../components/queue/LivePositionTracker';
import TicketDetailCard from '../components/queue/TicketDetailCard';
import QueueActionButtons from '../components/queue/QueueActionButtons';

export const LiveQueueStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const passedTicket = location.state?.ticket;
  const tokenId = params.id || params.ticketId;

  // Custom Hooks
  const { audioEnabled, playChime, toggleAudio } = useAudioNotification();
  const {
    ticketData,
    isLoading,
    position,
    estimatedWaitMins,
    progressPercent,
    lastSyncedTime,
    isCancelled,
    isSkipped,
    isServed,
    fetchLiveTicket,
    handleDelayTicket,
    handleLeaveQueue,
  } = useQueueTicket(passedTicket, tokenId);

  // Play audio chime when served or when top spot is reached
  useEffect(() => {
    if (isServed || position === 1) {
      playChime();
    }
  }, [isServed, position, playChime]);

  const venueName = ticketData?.venue?.name || 'Main Cafeteria';
  const counterName = ticketData?.counter?.name || 'General Counter';
  const counterCode = ticketData?.counter?.code || 'V';
  const ticketNumber = ticketData?.ticketNumber || '#V-25';
  const guestName = ticketData?.guestName || 'Guest User';
  const partySize = ticketData?.partySize || 1;
  const qrCodeToken = ticketData?.qrCodeToken;

  if (isLoading && !ticketData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Live Header Bar */}
      <LiveQueueHeader
        venueName={venueName}
        counterName={counterName}
        counterCode={counterCode}
        audioEnabled={audioEnabled}
        onToggleAudio={toggleAudio}
        onRefresh={fetchLiveTicket}
        lastSyncedTime={lastSyncedTime}
      />

      {/* Main Position & Progress Tracker */}
      <LivePositionTracker
        ticketNumber={ticketNumber}
        guestName={guestName}
        position={position}
        estimatedWaitMins={estimatedWaitMins}
        progressPercent={progressPercent}
        isServing={isServed || position === 0}
        isSkipped={isSkipped}
        isCancelled={isCancelled}
      />

      {/* Ticket Verification Details & QR Code */}
      <TicketDetailCard
        ticketNumber={ticketNumber}
        partySize={partySize}
        qrCodeToken={qrCodeToken}
        joinedAt={ticketData?.joinedAt ? new Date(ticketData.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
      />

      {/* Queue Actions */}
      <QueueActionButtons
        isServing={isServed || position === 0}
        isCancelled={isCancelled}
        isSkipped={isSkipped}
        onDelayTicket={handleDelayTicket}
        onLeaveQueue={handleLeaveQueue}
        onRejoinQueue={() => navigate('/')}
      />
    </div>
  );
};

export default LiveQueueStatus;
