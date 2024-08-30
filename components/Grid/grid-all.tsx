import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon, FilterIcon, ListOrderedIcon, LayoutGridIcon, ListIcon } from 'lucide-react'

type JobApplication = {
  id: number
  company: string
  position: string
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected'
  dateApplied: string
}

const initialJobApplications: JobApplication[] = [
  { id: 1, company: 'TechCorp', position: 'Frontend Developer', status: 'Applied', dateApplied: '2023-06-01' },
  { id: 2, company: 'DataSystems', position: 'Data Analyst', status: 'Interview', dateApplied: '2023-06-05' },
  { id: 3, company: 'WebSolutions', position: 'UX Designer', status: 'Offer', dateApplied: '2023-06-10' },
  { id: 4, company: 'AI Innovations', position: 'Machine Learning Engineer', status: 'Rejected', dateApplied: '2023-06-15' },
  { id: 5, company: 'CloudNet', position: 'DevOps Engineer', status: 'Applied', dateApplied: '2023-06-20' },
]

const statusColors = {
  Applied: 'bg-blue-200 text-blue-800',
  Interview: 'bg-yellow-200 text-yellow-800',
  Offer: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
}

export default function JobApplicationTracker({data}: any) {
  const [applications, setApplications] = useState<JobApplication[]>(initialJobApplications)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("dateApplied")
  const [sortOrder, setSortOrder] = useState("desc")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleAddApplication = () => {
    const newApplication: JobApplication = {
      id: applications.length + 1,
      company: "New Company",
      position: "New Position",
      status: "Applied",
      dateApplied: new Date().toISOString().split('T')[0],
    }
    setApplications([...applications, newApplication])
  }

  const handleUpdateStatus = (id: number, newStatus: JobApplication['status']) => {
    setApplications(apps =>
      apps.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    )
  }

  const filteredApplications =
    filterStatus === "all" ? applications : applications.filter((app) => app.status.toLowerCase() === filterStatus)

  const sortedApplications = filteredApplications.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const ApplicationCard = ({ app }: { app: JobApplication }) => (
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-800">Job Application Tracker</h1> */}
        <Button onClick={handleAddApplication}>Add Application</Button>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              <span>
                {filterStatus === "all" ? "All" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={filterStatus === "all"} onCheckedChange={() => setFilterStatus("all")}>
              All
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === "applied"}
              onCheckedChange={() => setFilterStatus("applied")}
            >
              Applied
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === "interview"}
              onCheckedChange={() => setFilterStatus("interview")}
            >
              Interview
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === "offer"}
              onCheckedChange={() => setFilterStatus("offer")}
            >
              Offer
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === "rejected"}
              onCheckedChange={() => setFilterStatus("rejected")}
            >
              Rejected
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ListOrderedIcon className="w-4 h-4" />
              <span>
                {sortBy === "dateApplied" ? "Date Applied" : sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </span>
              <ChevronsUpDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="company">Company</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="position">Position</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dateApplied">Date Applied</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder} className="flex items-center">
              <DropdownMenuRadioItem value="asc">
                <ChevronUpIcon className="w-4 h-4 mr-2" />
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                <ChevronDownIcon className="w-4 h-4 mr-2" />
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
      </div>
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
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
    </div>
  )
}