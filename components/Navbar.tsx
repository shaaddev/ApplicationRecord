import Link from 'next/link'
import { SpreadSheet } from '@/lib/Logos'
import { Theme } from './theme'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import { ResNavBar } from './res-nav-bar'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export interface PathProps {
  [key: string]: {
    name: string
  }
}

const paths: PathProps = {
  "/api/auth/login": {
    name: 'Login',
  },
  "/donate-with-elements":{
    name: 'Donate'
  }
}

export async function Navbar() {
  const { getUser } = getKindeServerSession()

  const user = await getUser()

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
              {Object.entries(paths).slice(1).map(([path, { name }]) => (
                <li key={path} >
                  <Link href={path} className='hover:text-slate-800 dark:hover:text-slate-800'>{name}</Link>
                </li>  
              ))}
              <li>
                <LogoutLink className='hover:text-slate-800 dark:hover:text-slate-800'>
                  Logout
                </LogoutLink>
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
        <ResNavBar 
          theme={<Theme />}
          user={user}
          paths={paths}
        />
      </div>
    </nav>
  )
}