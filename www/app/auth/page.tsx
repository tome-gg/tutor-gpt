'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import icon from "@/public/bloomicon.jpg";

import SignUp from '@/components/signUp';
import SignIn from '@/components/signIn';
import Forgot from '@/components/forgot'
import Reset from '@/components/reset'

export default function Auth() {
  const [formType, setFormType] = useState('LOGIN');
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { // Can't access this page if you're logged in
        router.push('/')
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event != "INITIAL_SESSION") {
        console.log(event)
      }
      if (event == "PASSWORD_RECOVERY") {
        router.push("/auth/reset")
      }

    })
  }, [router, supabase])

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside
          className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6"
        >
          <Image
            alt="Pattern"
            src="/auth_banner.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            fill={true}
          />
        </aside>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="/">
              <span className="sr-only">Home</span>
              <Image src={icon} alt="banner" className="h-10 sm:h-10 w-auto rounded-full" />
            </a>

            <h1
              className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
            >
              Welcome to Bloom 🌱
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Your Aristotelian learning companion — here to help you follow your curiosity in whatever direction you like.
            </p>
            {formType === 'LOGIN' && (
              <SignIn stateSync={setFormType} />
            )}
            {formType === 'SIGNUP' && (
              <SignUp stateSync={setFormType} />
            )}
            {formType === 'FORGOT' && (
              <Forgot stateSync={setFormType} />
            )}

          </div>
        </main>
      </div>
    </section>
  )
}
