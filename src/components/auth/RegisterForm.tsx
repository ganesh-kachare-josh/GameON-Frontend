import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle, Plus, X } from "lucide-react";
import { SportLevel } from "../../lib/types";

// Define form values interface
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SportLevel>("Basic");
  const [sports, setSports] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const sportOptions = [
    "Cricket",
    "Football",
    "Basketball",
    "Tennis",
    "Badminton",
    "Chess",
    "Table Tennis",
    "Volleyball",
  ];
  const levelOptions: SportLevel[] = ["Basic", "Intermediate", "Advanced"];

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      // .email("Invalid email address")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/,
        "Invalid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  });

  const addSport = () => {
    if (selectedSport && !sports[selectedSport]) {
      setSports({
        ...sports,
        [selectedSport]: selectedLevel,
      });
      setSelectedSport("");
    }
  };

  const removeSport = (sport: string) => {
    const newSports = { ...sports };
    delete newSports[sport];
    setSports(newSports);
  };

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setError("");
    setIsLoading(true);

    if (Object.keys(sports).length === 0) {
      setError("Please add at least one sport");
      setIsLoading(false);
      setSubmitting(false);
      return;
    }

    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone_number: values.phoneNumber,
        sports,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Join GameON</CardTitle>
        <CardDescription>
          Create an account to start finding sports partners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting}) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Ganesh Kachare"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  placeholder = "password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </label>
                <Field
                  as={Input}
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="1234567890"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Add Sports You Play</label>
                <div className="flex space-x-2">
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportOptions.map((sport) => (
                        <SelectItem
                          key={sport}
                          value={sport}
                          disabled={!!sports[sport]}
                        >
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedLevel}
                    onValueChange={(value) => setSelectedLevel(value as SportLevel)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    size="icon"
                    onClick={addSport}
                    disabled={!selectedSport}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-2">
                  {Object.entries(sports).map(([sport, level]) => (
                    <div
                      key={sport}
                      className="flex items-center justify-between px-3 py-2 mt-1 text-sm rounded-md bg-primary-50"
                    >
                      <span>
                        {sport} - <span className="font-medium">{level}</span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeSport(sport)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {Object.keys(sports).length === 0 && error && (
                  <div className="text-sm text-red-500">
                    Please add at least one sport
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center p-3 text-sm rounded-md bg-red-50 text-red-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?
          <Button
            variant="link"
            className="px-2"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};