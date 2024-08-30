'use client'
import { Button } from "@/components/ui/button";
import {LayoutGridIcon, ListIcon} from 'lucide-react'
import { useState } from "react";

export function GridListToggle({data}: any) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    return(
        <div className="flex gap-2">
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
    )
}