import React, { useEffect, useState } from "react";
import {
  Calendar,
  Mail,
  Phone,
  Star,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { userApi, ratingApi } from "@/lib/api";
import { convertSportsToArray } from "@/utils/sportsFormatConverter";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CompleteRating } from "@/lib/types";

// Types based on your PostgreSQL schema
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  sports: Array<{
    name: string;
    level: string;
  }>;
  created_at: string;
}

interface ProfileProps {
  userId?: string | undefined;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  // Auth context for logged in user
  const { user: loggedInUser } = useAuth();

  // State for user profile
  const [user, setUser] = useState<UserProfile>({
    id: 0,
    name: "",
    email: "",
    phone_number: "",
    sports: [],
    created_at: "2025-02-01T09:45:00Z",
  });

  // State for user ratings
  const [ratings, setRatings] = useState<CompleteRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let currentUserId: number;

        if (userId === undefined) {
          currentUserId = loggedInUser?.id || 0;
        } else {
          currentUserId = Number(userId);
        }

        const response = await userApi.getProfile(currentUserId);
        const rawUserData = response.data;
        const arraySports = convertSportsToArray(
          rawUserData.sports as Record<string, string>
        );

        setUser({
          ...rawUserData,
          sports: arraySports,
          created_at: rawUserData.created_at || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserData();
  }, [loggedInUser?.id, userId]);

  // Fetch user ratings
  useEffect(() => {
    const fetchUserRatings = async () => {
      setIsLoading(true);
      try {
        let currentUserId: number;

        if (userId === undefined) {
          currentUserId = loggedInUser?.id || 0;
        } else {
          currentUserId = Number(userId);
        }

        // Call the ratings API to get all ratings for this user
        const response = await ratingApi.getUserRatings(currentUserId);
        if (response.data) {
          setRatings(response.data);
        }
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRatings();
  }, [loggedInUser?.id, userId]);

  // Calculate average rating
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
      : 0;

  // Calculate member duration
  const memberSince = new Date(
    user.created_at.replace("T", " ").replace("Z", "")
  );
  const timeAgo = formatDistanceToNow(memberSince, { addSuffix: true });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get sport name and level from sport object
  const getSportInfo = (sport: Record<string, string>) => {
    const sportName = Object.keys(sport)[0];
    return {
      name: sportName,
      level: sport[sportName],
    };
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Section with Avatar */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
        <div className="shrink-0">
          <Avatar className="h-36 w-36 border-4 border-primary shadow-lg">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2 capitalize">{user.name}</h1>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            {user.sports.map((sport, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm py-1 px-3"
              >
                {sport.name} · {sport.level}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center md:justify-start flex-wrap">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground" />
              <span>{user.phone_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <span>Joined {timeAgo}</span>
            </div>
          </div>

          {!userId && (
            <div className="flex gap-3 justify-center md:justify-start">
              <Button variant="default">
                <Link to={"/profile/edit"}>Edit Profile</Link>
              </Button>
            </div>
          )}
        </div>

        <Card className="w-full md:w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Star className="text-yellow-400 mr-2" fill="currentColor" />
              {isLoading ? "..." : averageRating.toFixed(1)}
            </CardTitle>
            <CardDescription className="text-center">
              Based on {isLoading ? "..." : ratings.length} ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter((r) => r.rating === star).length;
                const percentage =
                  ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center text-sm">
                    <span className="w-8">{star} ★</span>
                    {isLoading ? (
                      <Skeleton className="h-2 flex-1 mx-2" />
                    ) : (
                      <Progress
                        value={percentage}
                        className="h-2 flex-1 mx-2"
                      />
                    )}
                    <span className="w-8 text-right">
                      {isLoading ? "..." : count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="ratings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2" size={20} />
                All Ratings
              </CardTitle>
              <CardDescription>
                Reviews and feedback from other players
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Rating Summary */}
              <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">
                    {isLoading ? (
                      <Skeleton className="w-12 h-12" />
                    ) : (
                      averageRating.toFixed(1)
                    )}
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.round(averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {isLoading ? "..." : ratings.length} ratings
                </div>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Separator className="my-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              )}

              {/* No ratings */}
              {!isLoading && ratings.length === 0 && (
                <div className="text-center py-8">
                  <Star
                    className="mx-auto mb-4 text-muted-foreground"
                    size={48}
                  />
                  <h3 className="text-lg font-medium mb-2">No Ratings Yet</h3>
                  <p className="text-muted-foreground">
                    This player hasn't received any ratings yet.
                  </p>
                </div>
              )}

              {/* Rating list */}
              {!isLoading && (
                <div className="space-y-6">
                  {ratings.map((rating) => {
                    const sportInfo = getSportInfo(rating.sport);

                    return (
                      <Card
                        key={rating.id}
                        className="overflow-hidden border-none shadow-md"
                      >
                        <div className="h-2 bg-primary" />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center">
                                <Link
                                  to={`/public/profile/${rating.given_by}`}
                                  className="text-lg hover:text-primary hover:underline flex items-center"
                                >
                                  {rating.name}
                                  <ExternalLink size={14} className="ml-1" />
                                </Link>
                              </CardTitle>
                              <CardDescription>
                                {formatDate(rating.created_at)}
                              </CardDescription>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={18}
                                  className={
                                    rating.rating > i
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Link
                            to={`/request/${rating.request_id}`}
                            className="inline-flex items-center px-3 py-1 mb-3 rounded-full bg-secondary hover:bg-secondary/80 text-sm"
                          >
                            <Award size={14} className="mr-1" />
                            {sportInfo.name} · {sportInfo.level}
                            <ChevronRight size={14} className="ml-1" />
                          </Link>
                          <Separator />

                          {rating.feedback ? (
                            <div className="p-3 rounded-lg">
                              <p className="text-muted-foreground capitalize">
                                {rating.feedback}
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">
                              No written feedback provided
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sports Tab */}
        <TabsContent value="sports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2" size={20} />
                Sports & Skills
              </CardTitle>
              <CardDescription>
                Your sports preferences and experience levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.sports.map((sport, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-3 bg-primary" />
                    <CardHeader>
                      <CardTitle>{sport.name}</CardTitle>
                      <CardDescription>{sport.level}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Skill Level</span>
                            <span>{sport.level}</span>
                          </div>
                          <Progress
                            value={
                              sport.level === "Basic"
                                ? 33
                                : sport.level === "Intermediate"
                                ? 66
                                : 100
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
