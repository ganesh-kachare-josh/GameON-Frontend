import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestApi } from '../../lib/api';
import { SportLevel } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

export const CreateRequestForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // States for form fields
    const [selectedSport, setSelectedSport] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<SportLevel>('Basic');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [courtPrice, setCourtPrice] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get user's sports from auth context
    // const userSports = user?.Sports || {};
    const sportOptions = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis', 'Volleyball'];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to create a play request');
            return;
        }

        if (!selectedSport || !location || !date || !time) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // Create datetime string for the backend
            const dateTimeStr = `${date}T${time}:00Z`;

            // Create request payload
            const requestData = {
                user_id: user.id,
                sport: { [selectedSport]: selectedLevel },
                location,
                time: dateTimeStr,
                court_price: courtPrice ? parseFloat(courtPrice) : 0,
            };

            const response = await requestApi.createRequest(requestData);

            // Redirect to request details page
            navigate(`/request/${response.data.id}`);
        } catch (err: any) {
            console.error('Failed to create play request:', err);
            setError(err.response?.data?.message || 'Failed to create play request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Play Request</CardTitle>
                <CardDescription>
                    Set up a new game and find players to join you
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="sport" className="text-sm font-medium">
                            Select Sport & Level *
                        </label>
                        <div className="flex space-x-2">
                            <Select
                                value={selectedSport}
                                onValueChange={setSelectedSport}
                                required
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a sport" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(sportOptions).map((sport) => (
                                        <SelectItem key={sport} value={sport}>
                                            {sport}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedLevel}
                                onValueChange={(value) => setSelectedLevel(value as SportLevel)}
                                required
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Location *
                        </label>
                        <Input
                            id="location"
                            placeholder="Enter venue/court location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Date *
                        </label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="time" className="text-sm font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Time *
                        </label>
                        <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="courtPrice" className="text-sm font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Court Price (₹)
                        </label>
                        <Input
                            id="courtPrice"
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            value={courtPrice}
                            onChange={(e) => setCourtPrice(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center p-3 text-sm rounded-md bg-red-50 text-red-500">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter>
                <div className="flex space-x-2 w-full">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Request'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};