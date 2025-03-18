import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, IndianRupee } from 'lucide-react';
import { PlayRequest } from '../../lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAuth } from '../../context/AuthContext';
import { requestApi } from '../../lib/api';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface RequestCardProps {
    request: PlayRequest;
    onJoin: () => void;
    isJoined: boolean
}

export const RequestCard = ({ request, onJoin, isJoined }: RequestCardProps) => {
    const [joining, setJoining] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const isOwner = user?.id === request.user_id;
    const sportName = Object.keys(request.sport)[0];
    const sportLevel = Object.values(request.sport)[0];

    // Format date and time
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
    };

    const handleJoinRequest = async () => {
        if (!user) return;

        try {
            setJoining(true);

            await requestApi.joinRequest({
                User_id: user.id,
                Request_id: request.id
            });
            onJoin();
        } catch (error) {
            console.error('Failed to join request:', error);
        } finally {
            setJoining(false);
        }
    };

    const handleViewDetails = () => {
        navigate(`/request/${request.id}`);
    };

    const navigateToCreatorProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/public/profile/${request.user_id}`);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle>{sportName}</CardTitle>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {sportLevel}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-3">
                    {/* Creator details */}
                    <div
                        className="flex items-center text-sm cursor-pointer hover:text-primary transition-colors"
                        onClick={navigateToCreatorProfile}
                    >
                        <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                                {request.name ? getInitials(request.name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{request.name || 'User'}</span>
                        {isOwner && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                    </div>

                    <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{request.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(request.time)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatTime(request.time)}</span>
                    </div>
                    {request.court_price >=0 && (
                        <div className="flex items-center text-sm">
                            <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>₹{request.court_price} court fee</span>
                        </div>
                    )}
                    <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {isOwner ? "You're hosting" : isJoined ? "You've joined" : "Open to join"}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {isOwner ? (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleViewDetails}
                    >
                        Manage Request
                    </Button>
                ) : (
                    <div className="flex space-x-2 w-full">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleViewDetails}
                        >
                            View Details
                        </Button>
                        {isJoined ? (
                            <Button
                                variant="secondary"
                                className="flex-1"
                                disabled
                            >
                                Joined
                            </Button>
                        ) : (
                            <Button
                                className="flex-1"
                                onClick={handleJoinRequest}
                                disabled={joining || request.status !== 'Open'}
                            >
                                {joining ? 'Joining...' : 'Join'}
                            </Button>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};