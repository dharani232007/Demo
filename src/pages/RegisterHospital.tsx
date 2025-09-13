import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Hospital, Plus, Trash2, User, Clock, Copy, Download, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

interface Doctor {
  id: string;
  name: string;
  department: string;
  availableFrom: string;
  availableTo: string;
  avgServingTime: number;
}

interface DoctorWithCodes extends Doctor {
  entryCode: string;
  qrCodeDataUrl: string;
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorsWithCodes, setDoctorsWithCodes] = useState<DoctorWithCodes[]>([]);

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

  const generateEntryCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateQRCode = async (doctorData: Doctor, entryCode: string) => {
    const qrData = JSON.stringify({
      hospitalName,
      doctorName: doctorData.name,
      department: doctorData.department,
      entryCode,
      hospitalId: Date.now().toString()
    });
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
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
    
    // Generate codes and QR codes for all doctors
    try {
      const doctorsWithCodesData: DoctorWithCodes[] = await Promise.all(
        doctors.map(async (doctor) => {
          const entryCode = generateEntryCode();
          const qrCodeDataUrl = await generateQRCode(doctor, entryCode);
          return {
            ...doctor,
            entryCode,
            qrCodeDataUrl
          };
        })
      );

      // Simulate API call
      setTimeout(() => {
        setDoctorsWithCodes(doctorsWithCodesData);
        setIsRegistered(true);
        setLoading(false);
        toast({
          title: "Hospital Registered Successfully!",
          description: "QR codes and entry codes have been generated for all doctors.",
        });
      }, 2000);
    } catch (error) {
      console.error('Error during registration:', error);
      setLoading(false);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    });
  };

  const downloadQRCode = (dataUrl: string, doctorName: string) => {
    const link = document.createElement('a');
    link.download = `${doctorName.replace(/\s+/g, '_')}_QR_Code.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-green-600">Registration Successful!</h1>
            <p className="text-muted-foreground mb-4">
              Your hospital "{hospitalName}" has been registered successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Below are the QR codes and entry codes for each doctor. Save them securely.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctorsWithCodes.map((doctor) => (
              <Card key={doctor.id} className="shadow-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.department}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-inner">
                      <img 
                        src={doctor.qrCodeDataUrl} 
                        alt={`QR Code for ${doctor.name}`}
                        className="w-32 h-32"
                      />
                    </div>
                  </div>
                  
                  {/* Entry Code */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Entry Code</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={doctor.entryCode} 
                        readOnly 
                        className="font-mono text-center text-lg font-bold"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(doctor.entryCode, "Entry code")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => downloadQRCode(doctor.qrCodeDataUrl, doctor.name)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(doctor.entryCode, "Entry code")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>

                  {/* Doctor Details */}
                  <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                    <p>Available: {doctor.availableFrom} - {doctor.availableTo}</p>
                    <p>Avg. Time: {doctor.avgServingTime} minutes</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setIsRegistered(false);
                setHospitalName("");
                setAddress("");
                setPhone("");
                setDoctors([]);
                setDoctorsWithCodes([]);
              }}
            >
              Register Another Hospital
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
