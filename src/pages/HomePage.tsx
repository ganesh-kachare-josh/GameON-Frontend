import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Calendar,
  Users,
  Activity,
  PlusCircle,
  UserPlus,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

const FloatingElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="animate-float">{children}</div>;
};

const scrollToWorksSection = () => {
  const worksSection = document.getElementById("works-section");
  if (worksSection) {
    worksSection.scrollIntoView({ behavior: "smooth" });
  }
};

const Hero = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => navigate(path);
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-16">
        <div className="flex flex-col gap-4 md:gap-8 md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Find Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Game Partners
            </span>{" "}
            in Minutes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-[600px]">
            Connect with local sports enthusiasts, create or join play requests,
            and never miss a game again with GameON.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => handleNavigate("login")}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToWorksSection}>
              See How It Works
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Easy Setup</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Free to Join</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <FloatingElement>
            <img
              src="image.png"
              alt="People playing sports together"
              className="rounded-lg shadow-xl"
            />
          </FloatingElement>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="w-full py-16 bg-white" id="works-section">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            How GameON Works
          </h2>
          <p className="text-lg text-gray-600 max-w-[800px] mx-auto">
            Our platform makes it simple to find game partners through an
            intuitive workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-indigo-100 rounded-full">
                <PlusCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Create a Play Request
              </h3>
              <p className="text-gray-600">
                Specify your sport, location, time, and player requirements to
                set up a perfect game.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-purple-100 rounded-full">
                <UserPlus className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Find Players
              </h3>
              <p className="text-gray-600">
                Browse available players or let them discover your request and
                join your game.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-blue-100 rounded-full">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Play and Rate
              </h3>
              <p className="text-gray-600">
                Enjoy your game and afterward, rate your experience to help
                build a trusted community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Simple and{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Intuitive Workflow
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
            From registration to playing, our platform makes the process
            seamless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Users className="h-8 w-8 text-indigo-600" />,
              title: "Create Account",
              description:
                "Register with email to create your personalized player profile",
              number: "01",
            },
            {
              icon: <PlusCircle className="h-8 w-8 text-indigo-600" />,
              title: "Create or Join",
              description:
                "Post a new play request or browse existing ones to join",
              number: "02",
            },
            {
              icon: <Calendar className="h-8 w-8 text-indigo-600" />,
              title: "Confirm Details",
              description: "Accept participants and finalize game details",
              number: "03",
            },
            {
              icon: <Award className="h-8 w-8 text-indigo-600" />,
              title: "Play & Rate",
              description: "Enjoy your game and rate participants afterward",
              number: "04",
            },
          ].map((item, index) => (
            <Card key={index} className="relative border border-gray-200">
              <span className="absolute -top-4 -right-4 bg-indigo-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
                {item.number}
              </span>
              <CardContent className="pt-6">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Players Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
            Real experiences from sports enthusiasts who found their perfect
            game through GameON
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Ganesh Kachare",
              sport: "Basketball",
              quote:
                "I moved to a new city and had no one to play basketball with. Within a week of using GameON, I found a regular group to play with twice a week!",
            },
            {
              name: "Shubham Bayas",
              sport: "Tennis",
              quote:
                "As a competitive tennis player, finding matches at my skill level was always a challenge. GameON made it simple to find partners who can actually rally with me.",
            },
            {
              name: "Abhay Shankur",
              sport: "Soccer",
              quote:
                "Our team was always short a few players. Now we use GameON to fill the gaps, and we've even found some amazing permanent additions to our squad.",
            },
          ].map((testimonial) => (
            <Card className="border-0 h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-yellow-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-1"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.sport} Player
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => navigate(path);
  return (
    <section className="w-full py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container px-4 md:px-6 mx-auto text-center">
        <div className="max-w-[800px] mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Game?
          </h2>
          <p className="text-lg mb-8 text-white/80">
            Join thousands of players already using GameON to connect and play
            their favorite sports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => handleNavigate("register")}
            >
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-indigo-600 hover:text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">GameON</h3>
            <p className="text-gray-600">
              Connecting sports enthusiasts and making games happen.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Create Requests
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Join Games
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Player Profiles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Rating System
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Sports</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Basketball
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Soccer
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Tennis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Volleyball
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  All Sports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">© 2025 GameON. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const GameONLandingPage = () => {
  return (
    <div className="bg-white m-[-24px] md:m-[-40px]">
      <Hero />
      <Features />
      <Workflow />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default GameONLandingPage;
