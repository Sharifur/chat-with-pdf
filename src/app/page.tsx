import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { LogIn } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  return (
   <div className='w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100'>
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className='mr-3 text-5xl font-semibold'>ChatPDF</h1>
              <UserButton afterSignOutUrl='/' />
            </div>
            <div className="flex items-center mt-2">
              {isAuth && <Button>Go TO Chats</Button>}
            </div>
            <p className='max-w-xl mt-1 text-lg text-slate-600'>
              Join Millions of students, researcher and professional to instantly answer question and researche with AI
            </p>
            <div className="w-full mt-4 items-center">
              {isAuth ? (
                <h1>File Upload</h1>
              ) : (
                  <Link href="/sign-in">
                    <Button>
                      Login to get Started
                      <LogIn className='w-4 h-4 ml-2'/>
                    </Button>
                  </Link>
              )}
            </div>
        </div>
    </div>
   </div>
  )
}
