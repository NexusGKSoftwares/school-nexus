"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  scholarshipService,
  studentService,
  facultyService,
} from "@/lib/dataService";
import { ScholarshipModal } from "@/components/modals/ScholarshipModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

interface Scholarship {
  id: string;
  name: string;
  studentName: string;
  studentId: string;
  email: string;
  amount: number;
  date: string;
  status: string;
  gpa: number;
  department: string;
  avatar: string;
}

export default function AdminScholarships() {
  const [scholarshipData, setScholarshipData] = useState<Scholarship[]>([]);
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([
    "All Types",
  ]);
  const [scholarshipStatus, setScholarshipStatus] = useState<string[]>([
    "All Statuses",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch scholarships
      const { data: scholarships, error: scholarshipsError } =
        await scholarshipService.getScholarships();

      if (scholarshipsError) {
        setError(scholarshipsError.message);
        return;
      }

      // Fetch students for additional data
      const { data: students } = await studentService.getStudents();

      // Fetch faculties for additional data
      const { data: faculties } = await facultyService.getFaculties();

      if (scholarships) {
        const transformedScholarships: Scholarship[] = scholarships.map(
          (scholarship) => {
            const student = students?.find(
              (s) => s.id === scholarship.student_id,
            );
            const faculty = faculties?.find(
              (f) => f.id === student?.faculty_id,
            );

            return {
              id: scholarship.id,
              name: scholarship.scholarship_type || "General Scholarship",
              studentName: student
                ? `${student.first_name} ${student.last_name}`
                : "Unknown Student",
              studentId: student?.student_id || "N/A",
              email: student?.email || "N/A",
              amount: scholarship.amount || 0,
              date: scholarship.created_at
                ? new Date(scholarship.created_at).toISOString().split("T")[0]
                : "N/A",
              status: scholarship.status,
              gpa: student?.gpa || 0,
              department: faculty?.name || "General",
              avatar:
                student?.avatar_url || "/placeholder.svg?height=40&width=40",
            };
          },
        );
        setScholarshipData(transformedScholarships);

        // Generate filter options
        const uniqueTypes = Array.from(
          new Set(transformedScholarships.map((s) => s.name)),
        );
        const uniqueStatuses = Array.from(
          new Set(transformedScholarships.map((s) => s.status)),
        );

        setScholarshipTypes(["All Types", ...uniqueTypes]);
        setScholarshipStatus(["All Statuses", ...uniqueStatuses]);
      }
    } catch (err) {
      setError("Failed to fetch scholarship data");
      console.error("Error fetching scholarship data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarshipData.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      scholarship.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All Types" || scholarship.name === selectedType;
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      scholarship.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "Pending":
        return "bg-orange-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCreateScholarship = () => {
    setSelectedScholarship(null);
    setIsScholarshipModalOpen(true);
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship({
      id: scholarship.id,
      name: scholarship.name,
      student_id: scholarship.studentId,
      amount: scholarship.amount,
      status: scholarship.status,
      gpa: scholarship.gpa,
      department: scholarship.department,
      notes: "",
      awarded_date: scholarship.date ? new Date(scholarship.date) : new Date(),
    });
    setIsScholarshipModalOpen(true);
  };

  const handleDeleteScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setIsDeleteModalOpen(true);
  };

  const handleSaveScholarship = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedScholarship) {
        // Update
        const { error } = await scholarshipService.updateScholarship(
          selectedScholarship.id,
          data,
        );
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Success",
          description: "Scholarship updated successfully",
        });
      } else {
        // Create
        const { error } = await scholarshipService.createScholarship(data);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Success",
          description: "Scholarship created successfully",
        });
      }
      setIsScholarshipModalOpen(false);
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save scholarship",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedScholarship) return;
    try {
      setIsSubmitting(true);
      const { error } = await scholarshipService.deleteScholarship(
        selectedScholarship.id,
      );
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Scholarship deleted successfully",
      });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete scholarship",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading scholarship data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Scholarships & Waivers
          </h1>
          <p className="text-gray-600">
            Manage student scholarships and financial aid programs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleCreateScholarship}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Scholarship
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {scholarshipTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {scholarshipStatus.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Award className="h-5 w-5 text-blue-600" />
            Scholarship Records
          </CardTitle>
          <CardDescription>
            Manage and view all student scholarship information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredScholarships.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No scholarships found matching your criteria.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholarships.map((scholarship) => (
                  <TableRow key={scholarship.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {scholarship.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {scholarship.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={scholarship.avatar}
                            alt={scholarship.studentName}
                          />
                          <AvatarFallback>
                            {scholarship.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {scholarship.studentName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {scholarship.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${scholarship.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{scholarship.date}</TableCell>
                    <TableCell>{scholarship.gpa.toFixed(1)}</TableCell>
                    <TableCell>{scholarship.department}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(scholarship.status)}>
                        {scholarship.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditScholarship(scholarship)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Scholarship
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteScholarship(scholarship)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Scholarship
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Modals */}
      <ScholarshipModal
        isOpen={isScholarshipModalOpen}
        onClose={() => setIsScholarshipModalOpen(false)}
        onSave={handleSaveScholarship}
        scholarship={selectedScholarship}
        students={scholarshipData.map((s) => ({
          id: s.studentId,
          name: s.studentName,
          email: s.email,
        }))}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Scholarship"
        description={`Are you sure you want to delete the scholarship for ${selectedScholarship?.studentName || "this student"}? This action cannot be undone.`}
        isLoading={isSubmitting}
        itemName={""}
      />
    </div>
  );
}
