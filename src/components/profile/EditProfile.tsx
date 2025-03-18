import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    Save,
    X,
    Plus,
    AlertCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi, userApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { convertSportsToArray, convertSportsToObject } from '@/utils/sportsFormatConverter';

// Types based on your PostgreSQL schema
interface ISportDetails {
    name: string,
    level: string
}
interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    sports: ISportDetails[];
}

// Available sports and levels for selection
const availableSports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis', 'Volleyball']

const skillLevels = ["Basic", "Intermediate", "Advanced"];


const EditProfile: React.FC = () => {
    const navigate = useNavigate();

    // State for form values
    const [profile, setProfile] = useState<UserProfile>({
        id: 1,
        name: "",
        email: "",
        phone_number: "",
        sports: []
    });

    const { user } = useAuth()

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };

    // Handle input changes for basic info
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle adding a new sport
    const addSport = () => {
        setProfile(prev => ({
            ...prev,
            sports: [...prev.sports, { name: availableSports[0], level: "Beginner", experience: 0 }]
        }));
    };

    // Handle removing a sport
    const removeSport = (index: number) => {
        setProfile(prev => ({
            ...prev,
            sports: prev.sports.filter((_, i) => i !== index)
        }));
    };

    // Handle sport detail changes
    const handleSportChange = (index: number, field: keyof ISportDetails, value: string | number) => {
        setProfile(prev => {
            const updatedSports = [...prev.sports];
            updatedSports[index] = {
                ...updatedSports[index],
                [field]: value
            };
            return {
                ...prev,
                sports: updatedSports
            };
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedSports = convertSportsToObject(profile.sports)
            const updatedProfile = {
                ...profile,
                sports: updatedSports
            }

            const response = await authApi.updateProfile(updatedProfile)


            if (response) {
                setSuccess("Profile updated successfully!");
                setIsSubmitting(false);
            }

            // Redirect back to profile page after successful update
            // setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            setError("Failed to update profile. Please try again.");
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = user?.id

                if (userId === undefined) {
                    return;
                }
                const response = await userApi.getProfile(userId)
                console.log(response);
                const rawUserData = response.data

                const arraySports = convertSportsToArray(rawUserData.sports as Record<string, string>)

                setProfile({
                    ...rawUserData,
                    sports: arraySports
                })

            } catch (error) {
                console.log(error);
            }
        }


        if (user?.id) {
            fetchUserData()
        }
    }, [user?.id])

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <p className="text-muted-foreground mt-1">Update your personal information and preferences</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="personal" className="w-full mb-6">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                        <TabsTrigger value="sports">Sports</TabsTrigger>
                    </TabsList>

                    {/* Personal Info Tab */}
                    <TabsContent value="personal">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-1 flex flex-col items-center justify-center    ">
                                <CardContent className="flex flex-col items-center">
                                    <Avatar className="h-36 w-36 border-4 border-primary/10 mb-6">
                                        <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                            {getInitials(profile.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>
                                        Update your basic information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Smith"
                                                    value={profile.name}
                                                    onChange={handleInputChange}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={profile.email}
                                                    onChange={handleInputChange}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone_number"
                                                    name="phone_number"
                                                    placeholder="+1 (555) 123-4567"
                                                    value={profile.phone_number}
                                                    onChange={handleInputChange}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="sports">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sports & Skills</CardTitle>
                                <CardDescription>
                                    Update your sports preferences and skill levels
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {profile.sports.map((sport, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 relative"
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2"
                                                onClick={() => removeSport(index)}
                                            >
                                                <X size={16} />
                                            </Button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`sport-${index}`}>Sport</Label>
                                                    <Select
                                                        value={sport.name}
                                                        onValueChange={(value) => handleSportChange(index, 'name', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a sport" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableSports.map((sportName) => (
                                                                <SelectItem disabled={profile.sports.some((sport) => sport.name == sportName)} key={sportName} value={sportName}>
                                                                    {sportName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`level-${index}`}>Skill Level</Label>
                                                    <Select
                                                        value={sport.level}
                                                        onValueChange={(value) => handleSportChange(index, 'level', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {skillLevels.map((level) => (
                                                                <SelectItem key={level} value={level}>
                                                                    {level}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addSport}
                                        className="w-full"
                                        disabled={profile.sports.length >= 10}
                                    >
                                        <Plus size={16} className="mr-2" />
                                        Add Sport
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/* Sports Tab */}
                </Tabs>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/profile')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save size={16} />
                                Save Changes
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;