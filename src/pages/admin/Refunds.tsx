"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
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
  refundService,
  studentService,
  courseService,
} from "@/lib/dataService";
import { RefundModal } from "@/components/modals/RefundModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

interface Refund {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  amount: number;
  date: string;
  reason: string;
  status: string;
  requestDate: string;
  course: string;
  avatar: string;
}

export default function AdminRefunds() {
  const [refundData, setRefundData] = useState<Refund[]>([]);
  const [refundReasons, setRefundReasons] = useState<string[]>(["All Reasons"]);
  const [refundStatus, setRefundStatus] = useState<string[]>(["All Statuses"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReason, setSelectedReason] = useState("All Reasons");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch refunds
      const { data: refunds, error: refundsError } =
        await refundService.getRefunds();

      if (refundsError) {
        setError(refundsError.message);
        return;
      }

      // Fetch students for additional data
      const { data: students } = await studentService.getStudents();

      // Fetch courses for additional data
      const { data: courses } = await courseService.getCourses();

      if (refunds) {
        const transformedRefunds: Refund[] = refunds.map((refund) => {
          const student = students?.find((s) => s.id === refund.student_id);
          const course = courses?.find((c) => c.id === refund.course_id);

          return {
            id: refund.id,
            studentName: student
              ? `${student.first_name} ${student.last_name}`
              : "Unknown Student",
            studentId: student?.student_id || "N/A",
            email: student?.email || "N/A",
            amount: refund.amount || 0,
            date: refund.refund_date
              ? new Date(refund.refund_date).toISOString().split("T")[0]
              : "TBD",
            reason: refund.reason || "General refund",
            status: refund.status,
            requestDate: refund.created_at
              ? new Date(refund.created_at).toISOString().split("T")[0]
              : "N/A",
            course: course?.name || "Unknown Course",
            avatar:
              student?.avatar_url || "/placeholder.svg?height=40&width=40",
          };
        });
        setRefundData(transformedRefunds);

        // Generate filter options
        const uniqueReasons = Array.from(
          new Set(transformedRefunds.map((r) => r.reason)),
        );
        const uniqueStatuses = Array.from(
          new Set(transformedRefunds.map((r) => r.status)),
        );

        setRefundReasons(["All Reasons", ...uniqueReasons]);
        setRefundStatus(["All Statuses", ...uniqueStatuses]);
      }
    } catch (err) {
      setError("Failed to fetch refund data");
      console.error("Error fetching refund data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRefunds = refundData.filter((refund) => {
    const matchesSearch =
      refund.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason =
      selectedReason === "All Reasons" || refund.reason === selectedReason;
    const matchesStatus =
      selectedStatus === "All Statuses" || refund.status === selectedStatus;
    return matchesSearch && matchesReason && matchesStatus;
  });

  const pendingCount = refundData.filter((r) => r.status === "Pending").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

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

  const handleCreateRefund = () => {
    setSelectedRefund(null);
    setIsRefundModalOpen(true);
  };

  const handleEditRefund = (refund: Refund) => {
    setSelectedRefund({
      id: refund.id,
      student_id: refund.studentId,
      course_id: "", // You may want to map course name to id if available
      amount: refund.amount,
      refund_date: refund.date ? new Date(refund.date) : new Date(),
      reason: refund.reason,
      status: refund.status,
      notes: "",
    });
    setIsRefundModalOpen(true);
  };

  const handleDeleteRefund = (refund: Refund) => {
    setSelectedRefund(refund);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRefund = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedRefund) {
        // Update
        const { error } = await refundService.updateRefund(
          selectedRefund.id,
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
        toast({ title: "Success", description: "Refund updated successfully" });
      } else {
        // Create
        const { error } = await refundService.createRefund(data);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({ title: "Success", description: "Refund created successfully" });
      }
      setIsRefundModalOpen(false);
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save refund",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRefund) return;
    try {
      setIsSubmitting(true);
      const { error } = await refundService.deleteRefund(selectedRefund.id);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Refund deleted successfully" });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete refund",
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
          <span>Loading refund data...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Refund Approvals</h1>
          <p className="text-gray-600">
            Review and process student refund requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateRefund}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Add Refund
          </Button>
          <Badge className="bg-orange-500 text-white px-3 py-1">
            {pendingCount} Pending Approvals
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search refunds..."
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
                  {selectedReason}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Reason</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {refundReasons.map((reason) => (
                  <DropdownMenuItem
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                  >
                    {reason}
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
                {refundStatus.map((status) => (
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

      {/* Refund Requests Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Refund Requests
          </CardTitle>
          <CardDescription>
            Review and process student refund requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRefunds.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No refund requests found matching your criteria.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={refund.avatar}
                            alt={refund.studentName}
                          />
                          <AvatarFallback>
                            {refund.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {refund.studentName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {refund.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${refund.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{refund.date}</TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>{refund.requestDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(refund.status)}
                        <Badge className={getStatusColor(refund.status)}>
                          {refund.status}
                        </Badge>
                      </div>
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
                            onClick={() => handleEditRefund(refund)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Edit Refund
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteRefund(refund)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Delete Refund
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
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSave={handleSaveRefund}
        refund={selectedRefund}
        students={refundData.map((r) => ({
          id: r.studentId,
          name: r.studentName,
          email: r.email,
        }))}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Refund"
        description={`Are you sure you want to delete the refund for ${selectedRefund?.studentName || "this student"}? This action cannot be undone.`}
        isLoading={isSubmitting}
        itemName={""}
      />
    </div>
  );
}
