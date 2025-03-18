import { useState } from 'react';
import { Participant } from '../../lib/types';
import {
    Avatar,
    AvatarFallback,
} from '../ui/avatar';
import {
    Button,
} from '../ui/button';
import { Badge } from '../ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '../ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '../ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import {
    CheckCircle2,
    XCircle,
    User as UserIcon,
    Clock,
    CheckCheck,
    Star,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ratingApi} from '@/lib/api';

// Rating types
export interface Rating {
    id: number;
    given_by: number;
    given_to: number;
    request_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    feedback?: string;
    created_at: string;
}

export interface CreateRatingData {
    given_by: number;
    given_to: number;
    request_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    feedback?: string;
}

interface ParticipantsListProps {
    participants: Participant[];
    requestId: number;
    isOwner: boolean;
    playTime: string,
    onAccept: (participantId: number) => void;
    onReject: (participantId: number) => void;
}

// Mock API function for adding rating
// const addRatingForUserAPI = async (ratingData: CreateRatingData): Promise<Rating> => {
//     // Simulating API call
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 id: Math.floor(Math.random() * 1000),
//                 ...ratingData,
//                 created_at: new Date().toISOString()
//             });
//         }, 1000);
//     });
// };

export const ParticipantsList = ({
    participants,
    requestId,
    isOwner,
    playTime,
    onAccept,
    onReject
}: ParticipantsListProps) => {
    const [confirmingAction, setConfirmingAction] = useState<{
        participantId: number | null;
        action: 'accept' | 'reject' | null;
    }>({ participantId: null, action: null });

    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [starRating, setStarRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const { user } = useAuth();

    const form = useForm({
        defaultValues: {
            feedback: '',
        },
    });

    const isPlayTimeInPast = () => {
        const playDateTime = new Date(playTime);
        const currentDateTime = new Date();
        return playDateTime < currentDateTime;
    };

    // Get the initials from a name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    // Get badge color based on status
    const getStatusBadgeVariant = (status: Participant['status']) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'Pending':
            default:
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        }
    };

    // Get status icon
    const getStatusIcon = (status: Participant['status']) => {
        switch (status) {
            case 'Confirmed':
                return <CheckCheck className="h-4 w-4 text-green-600" />;
            case 'Cancelled':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'Pending':
            default:
                return <Clock className="h-4 w-4 text-amber-600" />;
        }
    };

    // Handle action confirmation
    const handleConfirmAction = () => {
        if (confirmingAction.participantId && confirmingAction.action) {
            if (confirmingAction.action === 'accept') {
                onAccept(confirmingAction.participantId);
            } else {
                onReject(confirmingAction.participantId);
            }
        }
        setConfirmingAction({ participantId: null, action: null });
    };

    // Open rating dialog
    const openRatingDialog = (participant: Participant) => {
        if (!isPlayTimeInPast()) {
            toast.success(`You can only rate participants after the play time has passed.`);
            return;
        }

        setSelectedParticipant(participant);
        setRatingDialogOpen(true);
        setStarRating(null);
        form.reset();
    };

    // Submit rating
    const submitRating = async () => {
        if (!user?.id || !selectedParticipant || !starRating) return;

        setIsSubmittingRating(true);

        try {
            const ratingData: CreateRatingData = {
                given_by: user.id,
                given_to: selectedParticipant.user_id,
                request_id: requestId,
                rating: starRating,
                feedback: form.getValues().feedback || undefined
            };

            await ratingApi.submitRating(ratingData);

            toast.success(`You've successfully rated ${selectedParticipant.name}.`);

            setRatingDialogOpen(false);
        } catch (error) {
            toast.error("Failed to submit rating. Please try again.");
        } finally {
            setIsSubmittingRating(false);
        }
    };

    if (!participants) {
        return (
            <main>
                <p>No participants.</p>
            </main>
        );
    }

    return (
        <div>
            {participants && participants.length === 0 ? (
                <div className="text-center p-6 border rounded-md bg-muted/10">
                    <UserIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">No participants yet</p>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                        Participants will appear here once they join
                    </p>
                </div>
            ) : (
                <ScrollArea className="max-h-96 pr-3 overflow-y-auto pb-4 my-5">
                    <div className="space-y-3">
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-md border transition-all duration-200",
                                    participant.status === 'Confirmed' && "border-green-200 bg-green-50",
                                    participant.status === 'Cancelled' && "border-red-200 bg-red-50",
                                    participant.status === 'Pending' && "border-amber-200 bg-amber-50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-background">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {participant ? getInitials(participant.name) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Link to={`/public/profile/${participant.user_id}`}><p className="font-medium">{participant?.name || 'Unknown User'}</p></Link>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {getStatusIcon(participant.status)}
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-full px-2 py-0 text-xs font-normal",
                                                    getStatusBadgeVariant(participant.status)
                                                )}
                                            >
                                                {participant.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {isOwner && participant.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                        onClick={() => setConfirmingAction({
                                                            participantId: participant.user_id,
                                                            action: 'accept'
                                                        })}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Confirm this participant</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => setConfirmingAction({
                                                            participantId: participant.id,
                                                            action: 'reject'
                                                        })}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Reject this participant</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}

                                {participant.user_id !== user?.id && participant.status === 'Confirmed' && (
                                    <div>
                                        <Button
                                            variant="outline"
                                            className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                                            onClick={() => openRatingDialog(participant)}
                                        >
                                            <Star className="h-4 w-4" />
                                            Rate Player
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* Confirmation Dialog */}
            <AlertDialog
                open={confirmingAction.participantId !== null}
                onOpenChange={(open) => !open && setConfirmingAction({ participantId: null, action: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmingAction.action === 'accept' ? 'Accept Participant' : 'Reject Participant'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmingAction.action === 'accept'
                                ? 'Are you sure you want to accept this participant? They will be notified about your decision.'
                                : 'Are you sure you want to reject this participant? They will be notified about your decision.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                            className={confirmingAction.action === 'accept' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            {confirmingAction.action === 'accept' ? 'Accept' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Rating Dialog */}
            <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Rate {selectedParticipant?.name}</DialogTitle>
                        <DialogDescription>
                            Share your experience playing with this participant
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex justify-center mb-6">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-all duration-200"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        onClick={() => setStarRating(star as 1 | 2 | 3 | 4 | 5)}
                                    >
                                        <Star
                                            className={cn(
                                                "h-8 w-8 transition-all duration-200",
                                                (hoverRating !== null && star <= hoverRating) || (hoverRating === null && starRating !== null && star <= starRating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <p className="font-medium text-sm">
                                {starRating === 1 && "Poor"}
                                {starRating === 2 && "Fair"}
                                {starRating === 3 && "Good"}
                                {starRating === 4 && "Very Good"}
                                {starRating === 5 && "Excellent"}
                                {!starRating && "Select a rating"}
                            </p>
                        </div>

                        <Form {...form}>
                            <form className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="feedback"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Feedback (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Share your experience with this participant..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Your feedback helps other players know what to expect
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>

                    <DialogFooter className="flex sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setRatingDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="bg-primary hover:bg-primary/90"
                            disabled={!starRating || isSubmittingRating}
                            onClick={submitRating}
                        >
                            {isSubmittingRating ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </div>
                            ) : (
                                "Submit Rating"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};