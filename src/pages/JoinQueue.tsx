import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, Users, QrCode, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueue } from "@/contexts/QueueContext";

const JoinQueue = () => {
  const { toast } = useToast();
  const { addPatient, patients, getPatientPosition } = useQueue();
  const [entryCode, setEntryCode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [queueJoined, setQueueJoined] = useState(false);
  const [currentPatientPosition, setCurrentPatientPosition] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entryCode || !patientName) {
      toast({
        title: "Missing Information",
        description: "Please enter both entry code and your full name.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add patient to the shared queue
      addPatient(patientName, entryCode);
      
      // Get the patient's position (newly added patient will be at the end)
      const newPosition = patients.length + 1;
      setCurrentPatientPosition(newPosition);
      
      setQueueJoined(true);
      setLoading(false);
      
      toast({
        title: "Successfully Joined Queue!",
        description: "You'll receive notifications when it's your turn.",
      });
    }, 1500);
  };

  if (queueJoined) {
    const currentPosition = getPatientPosition(patientName);
    const patientsAhead = Math.max(0, currentPosition - 1);
    const estimatedWait = currentPosition * 15;

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-secondary">You're in the Queue!</h1>
            <p className="text-muted-foreground">We'll notify you when it's your turn</p>
          </div>

          <Card className="shadow-queue mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Queue Status</CardTitle>
              <CardDescription>
                Doctor Name - Department
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {currentPosition}
                </div>
                <p className="text-muted-foreground">Your position in queue</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="font-semibold">{estimatedWait} min</div>
                  <div className="text-sm text-muted-foreground">Est. Wait Time</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{patientsAhead}</div>
                  <div className="text-sm text-muted-foreground">Patients Ahead</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <span className="font-medium">Patient: {patientName}</span>
                  <Badge variant="secondary">Waiting</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Entry Code: {entryCode}</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-sm">You'll get a notification when you're next in line</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-sm">Another notification when it's your turn</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <p className="text-sm">Please be ready when called to avoid delays</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <QrCode className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Join Queue</h1>
          <p className="text-muted-foreground">Enter your entry code to join a doctor's queue</p>
        </div>

        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Enter the entry code provided by your doctor or scan the QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="entryCode">Entry Code</Label>
                <Input
                  id="entryCode"
                  type="text"
                  value={entryCode}
                  onChange={(e) => setEntryCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit entry code"
                  className="mt-1 font-mono text-center tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: DOC123, CAR456, etc.
                </p>
              </div>
              
              <div>
                <Label htmlFor="patientName">Full Name</Label>
                <Input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  "Joining Queue..."
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Join Queue
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Demo Entry Codes</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>DOC001:</strong> Doctor 1 (Department A)</p>
                <p><strong>DOC002:</strong> Doctor 2 (Department B)</p>
                <p><strong>DOC003:</strong> Doctor 3 (Department C)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinQueue;
