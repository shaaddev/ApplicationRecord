import Link from 'next/link'
import { SpreadSheet } from '@/lib/Logos'
import { Theme } from './theme'
import { createClient } from '@/utils/supabase/server'
import logo from '@/public/logo.svg'
import Image from 'next/image'

const paths = {
  "/login": {
    name: 'Login'
  }
}

export async function Navbar() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return(
    <nav className="sticky flex flex-col max-w-full h-max z-10 top-0 inset-x-o px-10 py-5 m-2 rounded-2xl border-none bg-lime-600 text-slate-100  dark:bg-lime-500 backdrop-blur-xl  shadow-md ">
      <div className="flex flex-row items-center justify-between px-5">
        {/* <SpreadSheet className='w-6 h-6' /> */}
        <Link href="/">
          <Image src={logo} alt="Logo" width={100} height={24} />
        </Link>
        <ul className='hidden lg:flex flex-row gap-6 justify-end'>
          {user ? (
            <>
              <li>
                <p>Welcome!</p>
              </li>
              {Object.entries(paths).slice(1).map(([path, { name }]) => (
                <li key={path} >
                  <Link href={path} className='hover:text-slate-800 dark:hover:text-pink-500'>{name}</Link>
                </li>  
              ))}
              <li>
                <Link href="/logout" className='hover:text-slate-800 dark:text-slate-800'>
                  Logout
                </Link>
              </li>
            </> 
          ): (
            <>
            {Object.entries(paths).map(([path, { name }]) => (
              <li key={path} >
                <Link href={path} className='hover:text-slate-800 dark:hover:text-slate-800'>{name}</Link>
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