import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  QrCode, 
  Mic, 
  Type,
  Database,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  User,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AttendanceDashboard = () => {
  const [selectedView, setSelectedView] = useState("dashboard");
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Check-in states
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  // Mock data for the dashboard
  const attendanceStats = {
    totalStudents: 1248,
    presentToday: 1087,
    attendanceRate: 87,
    riskStudents: 23
  };

  const recentActivity = [
    { id: 1, student: "Alice Johnson", action: "Check-in via QR", time: "09:15 AM", status: "present" },
    { id: 2, student: "Bob Smith", action: "Voice check-in", time: "09:12 AM", status: "present" },
    { id: 3, student: "Carol Davis", action: "Manual entry", time: "09:08 AM", status: "late" },
  ];

  const riskStudents = [
    { 
      id: 1, 
      name: "David Wilson", 
      riskLevel: "high", 
      attendanceRate: 45, 
      engagementScore: 32,
      lastSeen: "3 days ago",
      reason: "Poor attendance pattern, low engagement in activities"
    },
    { 
      id: 2, 
      name: "Emma Brown", 
      riskLevel: "medium", 
      attendanceRate: 72, 
      engagementScore: 58,
      lastSeen: "1 day ago",
      reason: "Declining engagement, missed recent assessments"
    },
    { 
      id: 3, 
      name: "Frank Miller", 
      riskLevel: "low", 
      attendanceRate: 88, 
      engagementScore: 75,
      lastSeen: "Today",
      reason: "Slight dip in participation, needs monitoring"
    },
  ];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="risk-high">High Risk</Badge>;
      case "medium":
        return <Badge className="risk-medium">Medium Risk</Badge>;
      case "low":
        return <Badge className="risk-low">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "late":
        return <Clock className="h-4 w-4 text-warning" />;
      case "absent":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">EduPresence</h1>
          <p className="text-xl text-muted-foreground mt-1">Smart Classroom</p>
            <p className="text-lg text-muted-foreground mt-2">
              Smart tracking and predictive analytics for student success
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{profile?.full_name || user?.email}</span>
              <Badge variant="secondary" className="text-xs capitalize">
                {profile?.role || 'Student'}
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          {["dashboard", "checkin", "alerts", "analytics"].map((view) => (
            <Button
              key={view}
              variant={selectedView === view ? "default" : "outline"}
              onClick={() => setSelectedView(view)}
              className="capitalize"
            >
              {view === "checkin" ? "Check-in Methods" : view}
            </Button>
          ))}
        </div>
      </div>

      {/* Dashboard View */}
      {selectedView === "dashboard" && (
        <div className="space-y-8 fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{attendanceStats.totalStudents}</div>
                <div className="flex items-center text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Present Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{attendanceStats.presentToday}</div>
                <div className="flex items-center text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {attendanceStats.attendanceRate}% attendance rate
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Risk Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{attendanceStats.riskStudents}</div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Bell className="h-3 w-3 mr-1" />
                  Need intervention
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Weekly Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">92%</div>
                <div className="flex items-center text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Above target (85%)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <Card className="card-hover lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium text-foreground">{activity.student}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Rate Progress */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <span className="text-sm font-medium">{attendanceStats.attendanceRate}%</span>
                  </div>
                  <Progress value={attendanceStats.attendanceRate} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Engagement Score</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Weekly Target</span>
                    <span className="text-sm font-medium">108%</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment Section */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Student Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.reason}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Attendance: {student.attendanceRate}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Engagement: {student.engagementScore}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last seen: {student.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getRiskBadge(student.riskLevel)}
                      <Button size="sm" variant="outline">
                        Intervene
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Check-in Methods View */}
      {selectedView === "checkin" && (
        <div className="space-y-8 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR Code Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-muted rounded-lg mx-auto flex items-center justify-center">
                    {qrDialogOpen ? (
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EduPresence-Checkin" 
                        alt="QR Code" 
                        className="w-28 h-28"
                      />
                    ) : (
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Students can scan QR codes to check in instantly
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setQrDialogOpen(true);
                      toast({
                        title: "QR Code Generated",
                        description: "Students can now scan this code to check in",
                      });
                      
                      // Simulate a student checking in after 3 seconds
                      setTimeout(() => {
                        toast({
                          title: "Student Checked In",
                          description: "John Smith has checked in via QR code",
                          variant: "success",
                        });
                      }, 3000);
                    }}
                  >
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  Voice Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-muted rounded-lg mx-auto flex items-center justify-center">
                    {isListening ? (
                      <div className="relative">
                        <Mic className="h-16 w-16 text-primary animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-primary/10 animate-ping"></div>
                        </div>
                      </div>
                    ) : (
                      <Mic className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Voice-activated attendance for hands-free checking
                  </p>
                  <Button 
                    className="w-full" 
                    variant={isListening ? "destructive" : "secondary"}
                    onClick={() => {
                      if (!isListening) {
                        setIsListening(true);
                        toast({
                          title: "Voice Recognition Active",
                          description: "Say your name and ID to check in",
                        });
                        
                        // Simulate voice recognition after 3 seconds
                        setTimeout(() => {
                          setTranscript("Emma Brown, ID 1234");
                          toast({
                            title: "Voice Recognized",
                            description: "Emma Brown has checked in via voice",
                            variant: "success",
                          });
                          setIsListening(false);
                        }, 3000);
                      } else {
                        setIsListening(false);
                        toast({
                          title: "Voice Recognition Stopped",
                          description: "Voice check-in has been cancelled",
                        });
                      }
                    }}
                  >
                    {isListening ? "Stop Listening" : "Start Voice"}
                  </Button>
                  {transcript && (
                    <div className="p-2 bg-muted rounded text-sm">
                      Recognized: "{transcript}"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Type className="h-5 w-5 mr-2" />
                  Manual Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-muted rounded-lg mx-auto flex items-center justify-center">
                    <Type className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Traditional text-based attendance entry
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setManualDialogOpen(true)}
                  >
                    Manual Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Manual Entry Dialog */}
            <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Attendance Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="student-name" className="text-sm font-medium">Student Name</label>
                    <Input 
                      id="student-name" 
                      placeholder="Enter student name" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="student-id" className="text-sm font-medium">Student ID</label>
                    <Input 
                      id="student-id" 
                      placeholder="Enter student ID" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setManualDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (studentName && studentId) {
                        toast({
                          title: "Attendance Recorded",
                          description: `${studentName} has been checked in manually`,
                          variant: "success",
                        });
                        setManualDialogOpen(false);
                        setStudentName("");
                        setStudentId("");
                      } else {
                        toast({
                          title: "Missing Information",
                          description: "Please enter both name and ID",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                LMS Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Connected Systems</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Canvas LMS</span>
                      <Badge className="status-excellent">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Moodle</span>
                      <Badge variant="outline">Disconnected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Blackboard</span>
                      <Badge className="status-good">Syncing</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Integration Settings</h3>
                  <div className="space-y-4">
                    <Button className="w-full">Configure Sync</Button>
                    <Button className="w-full" variant="outline">Import Students</Button>
                    <Button className="w-full" variant="outline">Export Reports</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts View */}
      {selectedView === "alerts" && (
        <div className="space-y-8 fade-in">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Weekly Alert Report for Counselors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskStudents.map((student, index) => (
                  <div key={student.id} className="p-4 border-l-4 border-l-destructive bg-destructive/5 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{student.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{student.reason}</p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="w-20 text-muted-foreground">Risk Level:</span>
                            {getRiskBadge(student.riskLevel)}
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="w-20 text-muted-foreground">Attendance:</span>
                            <span className="font-medium">{student.attendanceRate}%</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="w-20 text-muted-foreground">Engagement:</span>
                            <span className="font-medium">{student.engagementScore}%</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-info/10 rounded-lg">
                          <h5 className="font-medium text-info text-sm mb-2">Recommended Interventions:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Schedule one-on-one meeting within 48 hours</li>
                            <li>• Connect with academic advisor for support plan</li>
                            <li>• Implement attendance monitoring system</li>
                            {student.riskLevel === 'high' && (
                              <li>• Contact emergency support services if needed</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <Button size="sm" className="ml-4">
                        Export Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics View */}
      {selectedView === "analytics" && (
        <div className="space-y-8 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Chart: Attendance over time</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-success">92%</p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-info">89%</p>
                      <p className="text-sm text-muted-foreground">Last Week</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">91%</p>
                      <p className="text-sm text-muted-foreground">Average</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Chart: Engagement scores</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Class Participation</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Assignment Completion</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Time</span>
                      <span className="font-medium">3.2s avg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Predictive Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-success">94%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-info">87%</p>
                  <p className="text-sm text-muted-foreground">Precision</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning">91%</p>
                  <p className="text-sm text-muted-foreground">Recall</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">89%</p>
                  <p className="text-sm text-muted-foreground">F1-Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;