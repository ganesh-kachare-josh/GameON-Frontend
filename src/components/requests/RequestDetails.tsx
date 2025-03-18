import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestApi } from '../../lib/api';
import { PlayRequest, Participant } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Calendar, MapPin, Clock, IndianRupee, UserIcon, PhoneIcon, Mail } from 'lucide-react';
import { ParticipantsList } from './ParticipantsList';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

export const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const requestId = parseInt(id || '0');
    const navigate = useNavigate();
    const { user } = useAuth();

    const [request, setRequest] = useState<PlayRequest | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUserJoined, setIsUserJoined] = useState(false);

    const isOwner = user?.id === request?.user_id;

    // Format date and time
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC' , 
        });
    };

    const fetchRequestDetails = async () => {
        try {
            setIsLoading(true);
            const response = await requestApi.getRequestById(requestId);
            setRequest(response.data);

            // Fetch participants
            const participantsResponse = await requestApi.getParticipants(requestId);
            setParticipants(participantsResponse.data);

            // Check if current user is already a participant
            if (user) {
                const joined = participantsResponse.data ? participantsResponse.data.some(
                    (participant: Participant) => participant.user_id === user.id
                ) : false;
                setIsUserJoined(joined);
            }

            setError('');
        } catch (err) {
            console.error('Failed to fetch request details:', err);
            setError('Failed to load request details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (requestId) {
            fetchRequestDetails();
        }
    }, [requestId, user?.id]);

    const handleDeleteRequest = async () => {
        if (!isOwner || !request) return;

        const confirm = window.confirm('Are you sure you want to delete this play request?');
        if (!confirm) return;

        try {
            setIsDeleting(true);
            await requestApi.deleteRequest(request.id);
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to delete request:', err);
            setError('Failed to delete the request. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleJoinRequest = async () => {
        if (!user || !request) return;

        try {
            setIsJoining(true);
            await requestApi.joinRequest({
                User_id: user.id,
                Request_id: request.id
            });
            await fetchRequestDetails();
            setIsUserJoined(true);
        } catch (error) {
            console.error('Failed to join request:', error);
        } finally {
            setIsJoining(false);
        }
    };

    const handleAcceptParticipant = async (participantUserId: number) => {
        if (!isOwner || !request) return;

        try {
            await requestApi.acceptParticipant(request.id, participantUserId);
            fetchRequestDetails();
        } catch (err) {
            console.error('Failed to accept participant:', err);
        }
    };

    const handleRejectParticipant = async (participantId: number) => {
        if (!isOwner || !request) return;

        try {
            await requestApi.rejectParticipant(participantId);
            fetchRequestDetails();
        } catch (err) {
            console.error('Failed to reject participant:', err);
        }
    };

    const navigateToCreatorProfile = () => {
        if (request) {
            navigate(`/public/profile/${request.user_id}`);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="text-center p-8 text-red-500">
                <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                <p>{error || 'Request not found'}</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/dashboard')}
                >
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const sportName = Object.keys(request.sport)[0];
    const sportLevel = Object.values(request.sport)[0];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">{sportName} Game</CardTitle>
                            <CardDescription>
                                Status: <Badge variant="outline">{request.status}</Badge>
                            </CardDescription>
                        </div>
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {sportLevel}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Host/Creator information */}
                    <div className="bg-muted/20 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Host Information</h3>
                        <div className="flex items-center cursor-pointer hover:text-primary transition-colors" onClick={navigateToCreatorProfile}>
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>
                                    {getInitials(request.name || '')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{request.name || 'Anonymous Host'}</p>
                                <div className="flex text-xs text-muted-foreground mt-1 space-x-3">
                                    {request.email && (
                                        <div className="flex items-center">
                                            <Mail className="h-3 w-3 mr-1" />
                                            <span>{request.email}</span>
                                        </div>
                                    )}
                                    {request.phone_number && (
                                        <div className="flex items-center">
                                            <PhoneIcon className="h-3 w-3 mr-1" />
                                            <span>{request.phone_number}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isOwner && (
                                <Badge variant="secondary" className="ml-auto">You</Badge>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Location</p>
                                <p>{request.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Date</p>
                                <p>{formatDate(request.time)}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Time</p>
                                <p>{formatTime(request.time)}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <IndianRupee className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Court Price</p>
                                <p>₹{request.court_price || 'Free'}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                <span className="font-semibold">Participants</span>
                                {participants && participants.length > 0 && (
                                    <Badge variant="outline" className="ml-2">
                                        {participants.length}
                                    </Badge>
                                )}
                            </div>

                            {!isOwner && !isUserJoined && request.status === 'Open' && (
                                <Button
                                    onClick={handleJoinRequest}
                                    disabled={isJoining}
                                >
                                    {isJoining ? 'Joining...' : 'Join Game'}
                                </Button>
                            )}

                            {!isOwner && isUserJoined && (
                                <Badge variant="secondary" className="px-3 py-1">
                                    You've joined
                                </Badge>
                            )}
                        </div>

                        <ParticipantsList
                            participants={participants}
                            requestId={request.id}
                            isOwner={isOwner}
                            playTime={request.time}
                            onAccept={handleAcceptParticipant}
                            onReject={handleRejectParticipant}
                        />
                    </div>
                </CardContent>
                {isOwner && (
                    <CardFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteRequest}
                            disabled={isDeleting}
                            className="ml-auto"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Request'}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};