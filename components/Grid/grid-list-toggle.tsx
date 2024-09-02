'use client'
import { Button } from "@/components/ui/button";
import {LayoutGridIcon, ListIcon} from 'lucide-react'
import { useState } from "react";
import { ApplicationGridView } from "./application-grid-view";
import { ApplicationListView } from "./application-list-view";
import { JobProps } from "@/lib/info";
import { User } from "@supabase/supabase-js";

const colors = {
  'Not Applied': 'bg-red-500',
  'Applied': 'bg-yellow-500',
  'Phone Screen': 'bg-orange-500',
  'Offer': 'bg-green-500',
  'Hired': 'bg-lime-500',
  'Rejected': 'bg-red-500',
  'Ghosted': 'bg-gray-500',
  'Blacklist': 'bg-red-500',
}

export function GridListToggle({data, children, user}:{
  data: JobProps[], children?: React.ReactNode, user?: User | null
}) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
            {children}
          </div>
          {viewMode === 'grid' ? (
            <ApplicationGridView data={data} statusColours={colors} user={user}/>
          ) : (
            <ApplicationListView data={data} statusColours={colors} className={`${viewMode === 'list' ? 'mt-5' : '' }`}/>
          )}
        </div>
    )
}