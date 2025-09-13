import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, UserCheck, Clock, Users, QrCode, Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Smart Queue Management
            <span className="block text-3xl mt-2 opacity-90">for Hospitals</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Streamline patient flow, reduce waiting times, and enhance hospital efficiency 
            with our intelligent queue management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
              <Link to="/register">
                <Hospital className="h-5 w-5 mr-2" />
                Register Your Hospital
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/join-queue">
                <UserCheck className="h-5 w-5 mr-2" />
                Join Queue
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/95 backdrop-blur-sm shadow-medical">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Live queue tracking with instant notifications for patients and doctors
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-medical">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <CardTitle>QR Code Access</CardTitle>
              <CardDescription>
                Patients can easily join queues by scanning QR codes or entering entry codes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-medical">
            <CardHeader>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Multi-Doctor Support</CardTitle>
              <CardDescription>
                Manage multiple doctors and departments with individual queue systems
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hospital Registration</h3>
              <p className="text-white/80">Register your hospital and doctors to get unique QR codes and admin access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Patient Queue</h3>
              <p className="text-white/80">Patients scan QR codes or enter codes to join specific doctor queues</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Management</h3>
              <p className="text-white/80">Real-time updates, queue analytics, and automated patient flow management</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Hospital?</h2>
          <p className="text-xl text-white/80 mb-8">Join hundreds of hospitals already using SmartQueue</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/register">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
