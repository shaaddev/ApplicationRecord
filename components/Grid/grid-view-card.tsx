'use client'
import { Button } from "@/components/ui/button";
import {LayoutGridIcon, ListIcon} from 'lucide-react'
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChevronDownIcon from 'lucide-react'

export function GridView({data}: any) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    return(
        {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedApplications.map((app) => (
                <GridView key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedApplications.map((app) => (
                <Card key={app.id} className="bg-white border-none shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{app.company}</h3>
                      <p className="text-sm text-gray-500">{app.position}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={statusColors[app.status]}>{app.status}</Badge>
                      <span className="text-sm text-gray-500">{new Date(app.dateApplied).toLocaleDateString()}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Update
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, "Applied")}>Applied</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, "Interview")}>Interview</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, "Offer")}>Offer</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, "Rejected")}>Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
    )
}