'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { AiOutlineGoogle } from 'react-icons/ai'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useChangeLocale, useCurrentLocale } from '@/locales/client'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const router = useRouter()

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true)
    axios.post('/api/register', data).then(response => {
      console.log('User registered:', response.data)
      toast.success('Compte créé avec succès!')
      // Redirect to login page
      router.push('/login')
      router.refresh()
      setIsLoading(false)
    }).catch(error => {
      console.error('Registration error:', error.response?.data || error.message)
      toast.error("Erreur lors de la création du compte")
      setIsLoading(false)
    })
  }

  // Hooks pour l'internationalisation
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  // Options de langue avec labels traduits
  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'it', label: 'Italiano' },
    { value: 'es', label: 'Español' },
    { value: 'pt', label: 'Português' },
    { value: 'de', label: 'Deutsch' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value as 'fr' | 'en' | 'it' | 'es' | 'pt' | 'de';
    changeLocale(locale);
  };

  // Données des avis clients
  const testimonials = [
    {
      id: 1,
      name: "Marie Dupont",
      company: "Agence WebPro",
      content: "Visiloo a révolutionné notre façon d'analyser la visibilité en ligne. Des insights précieux et actionnables!",
      avatar: "/avatars/1.png"
    },
    {
      id: 2,
      name: "Thomas Martin",
      company: "Martin & Cie",
      content: "Grâce à Visiloo, j'ai pu identifier les faiblesses de mon référencement et les corriger. Résultats impressionnants en 3 mois!",
      avatar: "/avatars/2.png"
    },
    {
      id: 3,
      name: "Sophie Leroux",
      company: "SL Consulting",
      content: "L'outil le plus intuitif que j'ai utilisé pour le SEO. La visualisation des données est exceptionnelle.",
      avatar: "/avatars/3.png"
    },
    {
      id: 4,
      name: "Julien Moreau",
      company: "DigitalBoost",
      content: "La qualité des rapports générés m'a permis de convaincre mes clients et d'augmenter mon chiffre d'affaires de 40%.",
      avatar: "/avatars/4.png"
    }
  ];

  return (
    <div className="isolate bg-gray-900 px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ffa08f] to-[#ff6f61] opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Section gauche - Avis clients avec Carrousel */}
          <div className="w-full lg:w-2/5">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="flex items-center mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-700"></div>
                <h2 className="text-3xl font-bold text-white px-4 text-center">Témoignages clients</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-700"></div>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={testimonial.id}>
                      <div className="p-1">
                        <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                          <CardContent className="flex flex-col aspect-square items-center justify-center h-60 p-6">
                            
                            <div className="flex flex-col items-center text-center mb-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                                {testimonial.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                                <p className="text-indigo-300 text-sm">{testimonial.company}</p>
                              </div>
                            </div>
                            <p className="text-gray-300 italic text-center mb-4">"{testimonial.content}"</p>
                            <div className="flex mt-auto">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
                <CarouselNext className="right-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
              </Carousel>
            </motion.div>
          </div>

          {/* Séparateur vertical */}
          <div className="hidden lg:block">
            <div className="w-px h-96 bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Section droite - Formulaire */}
          <div className="w-full lg:w-2/5">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md mx-auto flex flex-col items-center z-10"
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <a href="/" className="flex items-center">
                    <Image
                      src="/logo/visiloo.png"
                      alt="Visiloo"
                      width={32}
                      height={32}
                      className="h-12 w-12 mr-2"
                    />
                    <span className="sr-only">Visiloo</span>
                    <span className="text-white text-xl font-bold">Visiloo</span>
                  </a>
                </div>
                
                <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                  Créer un compte
                </h2>
                <p className="mt-2 text-lg/8 text-gray-400">
                  Découvrez votre classement Google actuel et obtenez des stratégies d'amélioration concrètes.
                </p>
              </div>
              
              <div className="w-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <Button
                    variant="outline"
                    onClick={() => {signIn('google')}}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
                  >
                    <AiOutlineGoogle size={15} />
                    Continuer avec Google
                  </Button>
                </motion.div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Ou</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label htmlFor="name" className="block text-sm/6 font-semibold text-white">
                      Nom
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        {...register('name', { required: true })}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">Le nom est requis</p>}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="email" className="block text-sm/6 font-semibold text-white">
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        {...register('email', { required: true })}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">L'email est requis</p>}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="password" className="block text-sm/6 font-semibold text-white">
                      Mot de passe
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                        {...register('password', { required: true })}
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-500">Le mot de passe est requis</p>}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Création...' : 'Créer un compte'}
                    </Button>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-sm text-gray-400"
                  >
                    Vous avez déjà un compte ?{' '}
                    <a href='/login' className='font-medium text-indigo-400 hover:text-indigo-300 transition-colors'>
                      Se connecter
                    </a>
                  </motion.p>
                </form>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 flex justify-center"
                >
                  <select 
                    value={currentLocale}
                    onChange={handleLanguageChange}
                    className="bg-gray-800 border border-gray-700 text-gray-400 rounded-md px-3 py-2 text-sm focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm