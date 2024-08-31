'use client'
import { Button } from "@/components/ui/button";
import {LayoutGridIcon, ListIcon} from 'lucide-react'
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChevronDownIcon from 'lucide-react'
import app from "next/app";


const statusColors = {
    Applied: 'bg-blue-200 text-blue-800',
    Interview: 'bg-yellow-200 text-yellow-800',
    Offer: 'bg-green-200 text-green-800',
    Rejected: 'bg-red-200 text-red-800',
}

export function GridView({data}: any) {

    return(
        <Card 
            className="bg-white border-none shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1"
        >
        <CardHeader>
          <CardTitle>{app.company}</CardTitle>
          <CardDescription>{app.position}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={statusColors[app.status]}>
              {app.status}
            </Badge>
            <div className="text-sm text-gray-500">{new Date(app.dateApplied).toLocaleDateString()}</div>
          </div>
        </CardContent>
        <CardFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Update Status
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
        </CardFooter>
      </Card>
    )
}