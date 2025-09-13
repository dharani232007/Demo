import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Hospital, Plus, Trash2, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  department: string;
  availableFrom: string;
  availableTo: string;
  avgServingTime: number;
}

const departments = [
  "Cardiology", "Pediatrics", "Gynecology", "Orthopedics", 
  "Neurology", "Dermatology", "Ophthalmology", "General Medicine"
];

const RegisterHospital = () => {
  const { toast } = useToast();
  const [hospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const addDoctor = () => {
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: "",
      department: "",
      availableFrom: "09:00",
      availableTo: "17:00",
      avgServingTime: 15
    };
    setDoctors([...doctors, newDoctor]);
  };

  const updateDoctor = (id: string, field: keyof Doctor, value: string | number) => {
    setDoctors(docs => docs.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const removeDoctor = (id: string) => {
    setDoctors(docs => docs.filter(doc => doc.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hospitalName || !address || !phone || doctors.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and add at least one doctor.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Hospital Registered Successfully!",
        description: "QR codes and admin credentials have been generated for all doctors.",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <Hospital className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Register Your Hospital</h1>
          <p className="text-muted-foreground">Set up your hospital and doctor profiles to start managing queues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hospital Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Hospital Information</CardTitle>
              <CardDescription>Basic details about your hospital</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="Enter hospital name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter complete hospital address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter hospital phone number"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Doctors Section */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Doctors & Departments</CardTitle>
                  <CardDescription>Add doctors who will use the queue management system</CardDescription>
                </div>
                <Button type="button" onClick={addDoctor} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {doctors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No doctors added yet. Click "Add Doctor" to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {doctors.map((doctor, index) => (
                    <div key={doctor.id} className="border rounded-lg p-4 bg-gradient-card">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">Doctor {index + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDoctor(doctor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Doctor Name *</Label>
                          <Input
                            value={doctor.name}
                            onChange={(e) => updateDoctor(doctor.id, "name", e.target.value)}
                            placeholder="Enter doctor name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Department *</Label>
                          <Select
                            value={doctor.department}
                            onValueChange={(value) => updateDoctor(doctor.id, "department", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Available From</Label>
                          <Input
                            type="time"
                            value={doctor.availableFrom}
                            onChange={(e) => updateDoctor(doctor.id, "availableFrom", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Available To</Label>
                          <Input
                            type="time"
                            value={doctor.availableTo}
                            onChange={(e) => updateDoctor(doctor.id, "availableTo", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Average Serving Time (minutes)
                          </Label>
                          <Input
                            type="number"
                            min="5"
                            max="60"
                            value={doctor.avgServingTime}
                            onChange={(e) => updateDoctor(doctor.id, "avgServingTime", parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              className="px-8"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Hospital"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterHospital;
