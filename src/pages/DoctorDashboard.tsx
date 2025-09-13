import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Clock, UserCheck, Pause, Play, 
  PhoneCall, SkipForward, QrCode, Copy,
  TrendingUp, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueue } from "@/contexts/QueueContext";

const DoctorDashboard = () => {
  const { toast } = useToast();
  const { 
    patients, 
    currentPatient, 
    queuePaused, 
    stats,
    callNext: callNextPatient, 
    skipPatient: skipCurrentPatient, 
    toggleQueue: toggleQueueStatus 
  } = useQueue();

  const doctorInfo = {
    name: 'Doctor Name',
    department: 'Department',
    entryCode: 'DOC001',
    avgServingTime: 15
  };

  const callNext = () => {
    if (patients.length === 0) {
      toast({
        title: "No Patients in Queue",
        description: "There are no patients waiting to be served.",
        variant: "destructive"
      });
      return;
    }

    const nextPatient = callNextPatient();
    if (nextPatient) {
      toast({
        title: "Patient Called",
        description: `${nextPatient.name} has been called for consultation.`,
      });
    }
  };

  const skipPatient = () => {
    if (patients.length === 0) return;
    
    const skippedPatient = patients[0];
    skipCurrentPatient();
    
    toast({
      title: "Patient Skipped",
      description: `${skippedPatient.name} has been moved to the end of the queue.`,
      variant: "destructive"
    });
  };

  const toggleQueue = () => {
    toggleQueueStatus();
    toast({
      title: queuePaused ? "Queue Resumed" : "Queue Paused",
      description: queuePaused ? "Patients can now join the queue." : "New patients cannot join the queue.",
    });
  };

  const copyEntryCode = () => {
    navigator.clipboard.writeText(doctorInfo.entryCode);
    toast({
      title: "Entry Code Copied",
      description: "Patients can use this code to join your queue.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{doctorInfo.name}</h1>
              <p className="text-muted-foreground">{doctorInfo.department} Department</p>
            </div>
            <Badge variant={queuePaused ? "destructive" : "secondary"} className="text-sm px-3 py-1">
              {queuePaused ? "Queue Paused" : "Queue Active"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Patients Waiting</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalPatients}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Patients Served</CardTitle>
                <UserCheck className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.patientsServed}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.avgWaitTime}m</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.efficiency}%</div>
              <Progress value={stats.efficiency} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue Management */}
          <div className="lg:col-span-2">
            <Card className="shadow-queue">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Queue Management</CardTitle>
                    <CardDescription>Manage your patient queue</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleQueue}
                    >
                      {queuePaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button onClick={callNext} disabled={patients.length === 0}>
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentPatient && (
                  <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary">Currently Serving</h3>
                        <p className="text-lg">{currentPatient.name}</p>
                      </div>
                      <Badge variant="secondary">In Session</Badge>
                    </div>
                  </div>
                )}

                {patients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No patients in queue</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patients.map((patient, index) => (
                      <div
                        key={patient.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          index === 0 
                            ? 'bg-accent/10 border-accent/20' 
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {patient.position}
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">Joined at {patient.joinedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={skipPatient}
                            >
                              <SkipForward className="h-4 w-4" />
                            </Button>
                          )}
                          <Badge variant={patient.status === 'skipped' ? 'destructive' : 'outline'}>
                            {patient.status === 'skipped' ? 'Skipped' : 'Waiting'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Entry Code Card */}
            <Card className="shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Entry Code
                </CardTitle>
                <CardDescription>Share this code with patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold font-mono bg-gradient-primary bg-clip-text text-transparent mb-4">
                    {doctorInfo.entryCode}
                  </div>
                  <Button variant="outline" onClick={copyEntryCode} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Send Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
