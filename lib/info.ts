export interface JobProps {
  id?: string
  role: string
  company_name: string
  location: string
  status: string
  date_applied: string
  link?: string
  salary?: string
}

export const mock_data: JobProps[] = [
  {
    id: '1',
    role: 'Software Development Engineer',
    company_name: 'Amazon',
    location: 'NYC',
    status: 'Applied',
    date_applied: '2022-01-01',
  },
  {
    id: '2',
    role: 'Product Manager',
    company_name: 'Google',
    location: 'NYC',
    status: 'Ghosted',
    date_applied: '2022-01-01',
  },
  {
    id: '3',
    role: 'Data Scientist',
    company_name: 'Meta',
    location: 'Seattle',
    status: 'Rejected',
    date_applied: '2022-01-01',
  }
]