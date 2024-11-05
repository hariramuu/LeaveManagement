import React from 'react';
import { useStore } from '../store/useStore';
import { LeaveRequest, UserRole } from '../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, ArrowRight, Clock, Filter, FileText, Download } from 'lucide-react';

interface DashboardProps {
  role: UserRole;
}

export function Dashboard({ role }: DashboardProps) {
  const { leaveRequests, currentUser, updateLeaveRequest } = useStore();
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [forwardTo, setForwardTo] = React.useState('');
  const [rejectionReason, setRejectionReason] = React.useState('');

  const filteredRequests = leaveRequests.filter((request) => {
    if (role === 'student') {
      return request.studentId === currentUser?.id;
    }
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const handleAction = (requestId: string, action: 'approve' | 'reject' | 'forward') => {
    if (!currentUser) return;

    const updates: Partial<LeaveRequest> = {
      status: action === 'forward' ? 'forwarded' : action === 'approve' ? 'approved' : 'rejected',
    };

    if (action === 'approve') {
      updates.approvedBy = currentUser.name;
      updates.approverSignature = currentUser.digitalSignature;
    }
    
    if (action === 'reject') {
      updates.rejectedBy = currentUser.name;
      updates.rejectionReason = rejectionReason;
      setRejectionReason('');
    }
    
    if (action === 'forward') {
      updates.forwardedTo = forwardTo;
      setForwardTo('');
    }

    updateLeaveRequest(requestId, updates);
  };

  const renderOutpass = (request: LeaveRequest) => {
    if (request.status !== 'approved') return null;

    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Approved Outpass</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Student ID</p>
            <p className="font-medium">{request.studentId}</p>
          </div>
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{request.studentName}</p>
          </div>
          <div>
            <p className="text-gray-600">Branch</p>
            <p className="font-medium">{request.studentBranch}</p>
          </div>
          <div>
            <p className="text-gray-600">Year</p>
            <p className="font-medium">{request.studentYear}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number</p>
            <p className="font-medium">{request.studentPhone}</p>
          </div>
          <div>
            <p className="text-gray-600">Type</p>
            <p className="font-medium capitalize">{request.type}</p>
          </div>
          {request.type === 'outing' && (
            <>
              <div>
                <p className="text-gray-600">Out Time</p>
                <p className="font-medium">{request.outTime}</p>
              </div>
              <div>
                <p className="text-gray-600">In Time</p>
                <p className="font-medium">{request.inTime}</p>
              </div>
            </>
          )}
        </div>
        {request.approverSignature && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2">Approved By</p>
            <div className="flex items-center">
              <img
                src={request.approverSignature}
                alt="Digital Signature"
                className="h-16 object-contain"
              />
              <p className="ml-2 text-sm text-gray-600">{request.approvedBy}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => window.print()}
          className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Outpass
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                </h3>
                <p className="text-sm text-gray-600">From {request.studentName}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{format(new Date(request.startDate), 'PPP')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">{format(new Date(request.endDate), 'PPP')}</p>
              </div>
              {request.type === 'outing' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Out Time</p>
                    <p className="font-medium">{request.outTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Time</p>
                    <p className="font-medium">{request.inTime}</p>
                  </div>
                </>
              )}
            </div>

            <p className="mt-4 text-gray-700">{request.reason}</p>

            {request.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Supporting Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {request.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-blue-600 hover:bg-gray-200"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {doc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {request.status === 'rejected' && request.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                <p className="text-sm font-medium">Rejection Reason:</p>
                <p className="text-sm">{request.rejectionReason}</p>
              </div>
            )}

            {(role === 'warden' || role === 'chief_warden' || role === 'dean') && 
             request.status === 'pending' && (
              <div className="mt-4 space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(request.id, 'approve')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(request.id, 'reject')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                  {role !== 'dean' && (
                    <div className="flex-1 flex space-x-2">
                      <select
                        value={forwardTo}
                        onChange={(e) => setForwardTo(e.target.value)}
                        className="flex-1 rounded-lg border-gray-300"
                      >
                        <option value="">Forward to...</option>
                        <option value="chief_warden">Chief Warden</option>
                        <option value="dean">Dean</option>
                      </select>
                      <button
                        onClick={() => handleAction(request.id, 'forward')}
                        disabled={!forwardTo}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                      >
                        Forward
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  placeholder="Reason for rejection (required for rejecting)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>
            )}

            {renderOutpass(request)}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveRequest['status'] }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    forwarded: 'bg-blue-100 text-blue-800',
  };

  const icons = {
    pending: <Clock className="w-4 h-4" />,
    approved: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
    forwarded: <ArrowRight className="w-4 h-4" />,
  };

  return (
    <span className={`px-3 py-1 rounded-full flex items-center space-x-1 ${styles[status]}`}>
      {icons[status]}
      <span className="capitalize">{status}</span>
    </span>
  );
}