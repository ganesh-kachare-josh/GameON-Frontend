import { useState, useEffect } from "react";
import { requestApi } from "../../lib/api";
import { PlayRequest } from "../../lib/types";
import { RequestCard } from "./RequestCard";
import {
  Loader2,
  Search,
  Calendar as CalendarIcon,
  IndianRupee,
  MapPin,
  Star,
  User,
  Check,
  X,
  ListFilter,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/context/AuthContext";

const DateRangePicker = ({
  onChange,
}: {
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Format dates for display
  const formatDate = (date: Date) => {
    return date ? format(date, "PPP") : "";
  };

  useEffect(() => {
    if (startDate && endDate) {
      onChange({ startDate, endDate });
    }
  }, [startDate, endDate, onChange]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date" className="mb-2 block">
            Start Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? formatDate(startDate) : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => setStartDate(date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="end-date" className="mb-2 block">
            End Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={!startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? formatDate(endDate) : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => setEndDate(date || null)}
                disabled={(date) => (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

interface IDateRange {
  startDate: string;
  endDate: string;
}

export const RequestList = () => {
  const [requests, setRequests] = useState<PlayRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PlayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tab states
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("all-requests");

  // Filter states
  // const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateRange, setDateRange] = useState<IDateRange>({
    endDate: "",
    startDate: "",
  });
  const [proficiencyLevels, setProficiencyLevels] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("upcoming");

  const [userJoinedRequests, setUserJoinedRequests] = useState<number[]>([]);

  

  const { user } = useAuth();
  const currentUserId = user?.id;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestApi.getAllRequests();
      const joinedRequestsResponse = await requestApi.getJoinedRequestsById();
      console.log(response);
      console.log(joinedRequestsResponse);

      setUserJoinedRequests(joinedRequestsResponse.data?.joined_requests || []);
      setRequests(response.data || []);
      setError("");

      // Initialize filtered requests
      setFilteredRequests(response.data || []);

      // Extract unique values for filters
      const maxPrice = response.data && Math.max(...response.data.map((req) => req.court_price));
      setPriceRange([0, maxPrice]);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to load play requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = [...requests];

    // Filter by tab category (sport type)
    if (activeTab !== "all") {
      result = result.filter(
        (request) => Object.keys(request.sport)[0].toLowerCase() === activeTab
      );
    }

    // Filter by view mode
    if (viewMode === "my-requests") {
      result = result.filter((request) => request.user_id === currentUserId);
    } else if (viewMode === "joined-requests") {
      
      result =
        userJoinedRequests && userJoinedRequests.length > 0
          ? result.filter((request) => userJoinedRequests.includes(request.id))
          : [];
    } else if (viewMode === "confirmed-requests") {
      result = result.filter((request) => request.status === "Completed");
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (request) =>
          request.name.toLowerCase().includes(term) ||
          request.location.toLowerCase().includes(term) ||
          Object.keys(request.sport)[0].toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (selectedStatus.length > 0) {
      result = result.filter((request) =>
        selectedStatus.includes(request.status)
      );
    }

    // Filter by sports
    if (selectedSports.length > 0) {
      result = result.filter((request) =>
        selectedSports.includes(Object.keys(request.sport)[0].toLowerCase())
      );
    }

    // Filter by locations
    if (selectedLocations.length > 0) {
      result = result.filter((request) =>
        selectedLocations.includes(request.location)
      );
    }

    // Filter by price range
    result = result.filter(
      (request) =>
        request.court_price >= priceRange[0] &&
        request.court_price <= priceRange[1]
    );

    // Filter by date range
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);

      result = result.filter((request) => {
        const requestDate = new Date(request.time);
        return requestDate >= start && requestDate <= end;
      });
    }

    // Filter by proficiency levels (assuming it exists in the data)
    if (proficiencyLevels.length > 0) {
      // This is a placeholder - adjust based on your actual data structure
      result = result.filter(
        (request) =>
          request.sport &&
          request.sport.proficiency_level &&
          proficiencyLevels.includes(request.sport.proficiency_level)
      );
    }

    // Sort results
    if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOption === "price-low-high") {
      result.sort((a, b) => a.court_price - b.court_price);
    } else if (sortOption === "price-high-low") {
      result.sort((a, b) => b.court_price - a.court_price);
    } else if (sortOption === "upcoming") {
      result.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    }

    setFilteredRequests(result);
  }, [
    requests,
    activeTab,
    viewMode,
    searchTerm,
    selectedStatus,
    selectedSports,
    selectedLocations,
    priceRange,
    dateRange,
    proficiencyLevels,
    sortOption,
    currentUserId,
  ]);

  // Get unique sports from all requests for tabs
  const sportTabs = [
    ...new Set(
       requests.map((request) => Object.keys(request.sport)[0].toLowerCase())
    ),
  ];

  // Get unique locations for filter
  const locations = [...new Set(requests.map((request) => request.location))];

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setSelectedSports([]);
    setSelectedLocations([]);
    setPriceRange([0, Math.max(...requests.map((req) => req.court_price))]);
    setDateRange({
      endDate: "",
      startDate: "",
    });
    setProficiencyLevels([]);
    setSortOption("newest");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all-requests">
            <ListFilter className="w-4 h-4 mr-2" />
            All Requests
          </TabsTrigger>
          <TabsTrigger value="joined-requests">
            <Check className="w-4 h-4 mr-2" />
            Joined Requests
          </TabsTrigger>
          <TabsTrigger value="my-requests">
            <User className="w-4 h-4 mr-2" />
            My Requests
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filter Controls */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or sport..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="newest">Newest First</SelectItem> */}
              {/* <SelectItem value="oldest">Oldest First</SelectItem> */}
              <SelectItem value="upcoming">Upcoming First</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            
            <PopoverContent className="w-80 md:w-96 p-4 h-[400px] absolute -right-16 overflow-y-scroll">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset all
                  </Button>
                </div>

                <Separator />

                {/* Status filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Open", "Accepted", "Cancelled", "Completed"].map(
                      (status) => (
                        <div
                          key={status}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatus.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStatus([...selectedStatus, status]);
                              } else {
                                setSelectedStatus(
                                  selectedStatus.filter((s) => s !== status)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`status-${status}`}>{status}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                {/* Sports filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sports</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sportTabs.map((sport) => (
                      <div key={sport} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sport-${sport}`}
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSports([...selectedSports, sport]);
                            } else {
                              setSelectedSports(
                                selectedSports.filter((s) => s !== sport)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`sport-${sport}`}>
                          {sport.charAt(0).toUpperCase() + sport.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Location filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Locations</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {locations.map((location) => (
                      <div
                        key={location}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLocations([
                                ...selectedLocations,
                                location,
                              ]);
                            } else {
                              setSelectedLocations(
                                selectedLocations.filter((l) => l !== location)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`location-${location}`}>
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Range filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Price Range</h4>
                    <div className="text-sm">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    max={Math.max(...requests.map((req) => req.court_price))}
                    step={10}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  />
                </div>

                <Separator />

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Date Range</h4>
                  <DateRangePicker
                    onChange={({ startDate, endDate }) =>
                      setDateRange({
                        startDate: startDate ? startDate.toISOString() : "",
                        endDate: endDate ? endDate.toISOString() : "",
                      })
                    }
                  />
                </div>

                <Separator />

                {/* Proficiency Level filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Proficiency Level</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Beginner", "Intermediate", "Advanced", "Pro"].map(
                      (level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`level-${level}`}
                            checked={proficiencyLevels.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setProficiencyLevels([
                                  ...proficiencyLevels,
                                  level,
                                ]);
                              } else {
                                setProficiencyLevels(
                                  proficiencyLevels.filter((l) => l !== level)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`level-${level}`}>{level}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedStatus.length > 0 ||
        selectedSports.length > 0 ||
        selectedLocations.length > 0 ||
        proficiencyLevels.length > 0 ||
        dateRange !== null) && (
        <div className="flex flex-wrap gap-2 py-2">
          {selectedStatus.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setSelectedStatus(selectedStatus.filter((s) => s !== status))
                }
              />
            </Badge>
          ))}

          {selectedSports.map((sport) => (
            <Badge
              key={sport}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setSelectedSports(selectedSports.filter((s) => s !== sport))
                }
              />
            </Badge>
          ))}

          {selectedLocations.map((location) => (
            <Badge
              key={location}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" /> {location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setSelectedLocations(
                    selectedLocations.filter((l) => l !== location)
                  )
                }
              />
            </Badge>
          ))}

          {proficiencyLevels.map((level) => (
            <Badge
              key={level}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Star className="h-3 w-3" /> {level}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setProficiencyLevels(
                    proficiencyLevels.filter((l) => l !== level)
                  )
                }
              />
            </Badge>
          ))}

          {dateRange && dateRange.startDate && dateRange.endDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(dateRange.startDate), "MMM dd")} -{" "}
              {format(new Date(dateRange.endDate), "MMM dd")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setDateRange({
                    endDate: "",
                    startDate: "",
                  })
                }
              />
            </Badge>
          )}

          {(priceRange[0] > 0 ||
            priceRange[1] <
              Math.max(...requests.map((req) => req.court_price))) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />${priceRange[0]} - $
              {priceRange[1]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setPriceRange([
                    0,
                    Math.max(...requests.map((req) => req.court_price)),
                  ])
                }
              />
            </Badge>
          )}
        </div>
      )}

      {/* Sport Type Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">All Sports</TabsTrigger>
          {sportTabs.map((sport) => (
            <TabsTrigger key={sport} value={sport}>
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  isJoined={
                    userJoinedRequests &&
                    userJoinedRequests.includes(Number(request.id))
                  }
                  request={request}
                  onJoin={fetchRequests}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">
                  No matching requests found
                </h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Try adjusting your filters or search criteria to find more
                  play requests.
                </p>
                <Button className="mt-4" onClick={resetFilters}>
                  Reset all filters
                </Button>
              </CardContent>
            </Card>
          )}
          
        </TabsContent>
      </Tabs>
    </div>
  );
};
