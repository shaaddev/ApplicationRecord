'use client'
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, ListIcon } from 'lucide-react'
import { useState, useMemo } from "react";
import { ApplicationGridView } from "./application-grid-view";
import { ApplicationListView } from "./application-list-view";
import { JobProps } from "@/lib/info";
import { User } from "@supabase/supabase-js";
import { SortDropdown } from "./sort-dropdown";

const colors = {
  'Not Applied': 'bg-red-500',
  'Applied': 'bg-yellow-500',
  'Phone Screen': 'bg-orange-500',
  'Offer': 'bg-green-500',
  'Hired': 'bg-lime-500',
  'Rejected': 'bg-red-500',
  'Ghosted': 'bg-gray-500',
  'Blacklist': 'bg-gray-900',
}

type SortableFields = 'role' | 'company_name' | 'status' | 'date_applied';

export function GridListToggle({data, children, user}:{
  data: JobProps[], children?: React.ReactNode, user?: User | null
}) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortField, setSortField] = useState<SortableFields>('date_applied');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const sortedAndFilteredData = useMemo(() => {
      let result = [...data];
      
      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      result.sort((a, b) => {
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return result;
    }, [data, sortField, sortOrder, filterStatus]);

    const handleSortChange = (field: SortableFields, order: 'asc' | 'desc') => {
      setSortField(field);
      setSortOrder(order);
    };

    const handleFilter = (status: string) => {
      setFilterStatus(status);
    };

    return(
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="gap-2 flex">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGridIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <SortDropdown sortBy={sortField} sortOrder={sortOrder} onSortChange={handleSortChange} />
              <Button
                variant="outline"
                onClick={() => handleFilter(filterStatus === 'all' ? 'Applied' : 'all')}
              >
                {filterStatus === 'all' ? 'Show Applied' : 'Show All'}
              </Button>
              {children}
            </div>
          </div>
          {viewMode === 'grid' ? (
            <ApplicationGridView data={sortedAndFilteredData} statusColours={colors} user={user}/>
          ) : (
            <ApplicationListView data={sortedAndFilteredData} statusColours={colors} className={`${viewMode === 'list' ? 'mt-5' : '' }`}/>
          )}
        </div>
    )
}