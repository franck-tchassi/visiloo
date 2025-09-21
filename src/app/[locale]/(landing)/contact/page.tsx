import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <div className="isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* Effet d'arrière-plan décoratif */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4F46E5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      {/* Conteneur principal avec image à gauche et formulaire à droite */}
      <div className="mx-auto">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Colonne de gauche avec image seulement */}
          <div className="flex items-center justify-center">
            <div className="relative h-full w-full ">
              <Image
                src="/logo/contact.jpeg" // Remplacez par votre image réelle
                alt="Équipe de support Visitoo"
                fill
                className="rounded-2xl object-cover "
                priority
              />
            </div>
          </div>
          
          {/* Colonne de droite avec le formulaire */}
          <div>
            {/* En-tête */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">Contactez-nous !</h2>
              <p className="mt-2 text-lg text-gray-400">
                Nous sommes là pour vous aider. Veuillez sélectionner un sujet ci-dessous lié à votre demande afin que la bonne personne puisse vous assister dès que possible.
              </p>
            </div>
            
            {/* Formulaire de contact */}
            <form action="#" method="POST" className="mt-10">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {/* Prénom */}
                <div>
                  <label htmlFor="first-name" className="block text-sm font-semibold text-white">
                    Prénom
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                
                {/* Nom */}
                <div>
                  <label htmlFor="last-name" className="block text-sm font-semibold text-white">
                    Nom
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-white">
                    Adresse e-mail
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>
                
                {/* Sujet */}
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-white">
                    Choisir un sujet
                  </label>
                  <div className="mt-2.5">
                    <div className="flex rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 has-[select:focus-within]:outline-2 has-[select:focus-within]:-outline-offset-2 has-[select:focus-within]:outline-indigo-500">
                      <select
                        id="subject"
                        name="subject"
                        className="block w-full rounded-md bg-transparent px-3.5 py-2 text-white outline-none placeholder:text-gray-500"
                      >
                        <option value="" disabled selected>Sélectionnez un sujet</option>
                        <option className='text-black'>Services client</option>
                        <option className='text-black'>Problèmes techniques</option>
                        <option className='text-black'>Problèmes de paiement / facturation</option>
                        <option className='text-black'>Demande de collaboration</option>
                        <option className='text-black'>Demande concernant le marketing sur les réseaux sociaux</option>
                        <option className='text-black'>Idée de fonctionnalité</option>
                        <option className='text-black'>Demande</option>
                      </select>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none mr-2 size-5 self-center justify-self-end text-gray-400"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-white">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                      placeholder="Décrivez-nous votre demande en détail..."
                    />
                  </div>
                </div>
                
                {/* Newsletter */}
                <div className="flex gap-x-4 sm:col-span-2">
                  <div className="flex h-6 items-center">
                    <input
                      id="newsletter"
                      name="newsletter"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <label htmlFor="newsletter" className="text-sm text-gray-400">
                    Ne manquez rien ! Cochez cette case pour recevoir des offres exclusives, du savoir-faire marketing et des mises à jour de produits par e-mail.
                  </label>
                </div>
              </div>
              
              {/* Bouton d'envoi */}
              <div className="mt-10">
                <button
                  type="submit"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Envoyer un message
                </button>
              </div>
            </form>
            
            {/* Informations de contact alternatives */}
            <div className="mt-16 text-center lg:text-left">
              <p className="text-gray-400">Vous pouvez également nous contacter directement à l'adresse :</p>
              <p className="mt-2 text-indigo-400 font-medium">support@visitoo.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}