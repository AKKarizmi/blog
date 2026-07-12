import React from 'react';
import { ApplicationTable } from '../components/ApplicationTable';
export function ApplicationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage all volunteer applications.
        </p>
      </div>
      <ApplicationTable />
    </div>);

}