import Link from 'next/link'
import { SpreadSheet } from '@/lib/Logos'
import { Theme } from './theme'
import { createClient } from '@/utils/supabase/server'

const paths = {
  "/": {
    name: 'Home',
  },
  "/login": {
    name: 'Login'
  }
}

export async function Navbar() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return(
    <nav className="sticky flex flex-col max-w-full h-max z-10 top-0 inset-x-o px-10 py-5 m-2 rounded-2xl border-none bg-pink-800/100 text-slate-100  dark:bg-slate-800/50 backdrop-blur-xl  shadow-md ">
      <div className="flex flex-row items-center justify-between px-5">
        <SpreadSheet className='w-6 h-6' />
        <ul className='hidden lg:flex flex-row gap-6 justify-end'>
          {user ? (
            <>
              <li>
                <p>Welcome!</p>
              </li>
              {Object.entries(paths).slice(0, 1).map(([path, { name }]) => (
                <li key={path} >
                  <Link href={path}>{name}</Link>
                </li>  
              ))}
              <li>
                <Link href="/logout">
                  Logout
                </Link>
              </li>
            </> 
          ): (
            <>
            {Object.entries(paths).map(([path, { name }]) => (
              <li key={path} >
                <Link href={path}>{name}</Link>
              </li>  
            ))}
            </>
          )}
          <li>
            <Theme />
          </li>
        </ul>
      </div>
    </nav>
  )
}