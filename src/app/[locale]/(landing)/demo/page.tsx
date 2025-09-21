"use client";

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    country: '',
    need: '',
    message: '',
    agreeToPolicies: false
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Traitement du formulaire ici
    console.log(formData);
  };

  const partnerLogos = [
    "/partners/avignon.png",
    "/partners/charleetalice.png",
    "/partners/justebios.png",
  ];

  return (
    <div className="relative isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content & Partners */}
          <div>
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                Découvrez Visiloo en action
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                Obtenez une démonstration personnalisée et découvrez comment Visiloo surpasse 
                les solutions traditionnelles pour booster votre visibilité locale.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-white mb-6">Pourquoi choisir Visiloo ?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-500 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong>Technologie avancée</strong> - Moteur d'optimisation 3x plus performant
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-500 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong>Prix compétitif</strong> - Jusqu'à 40% moins cher que la concurrence
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-500 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong>Interface intuitive</strong> - Prise en main immédiate sans formation
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-500 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong>Support expert</strong> - Accompagnement personnalisé 7j/7
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-8 bg-indigo-900/20 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-indigo-300 mb-3">Notre différence</h4>
              <p className="text-gray-300 text-sm">
                Visiloo utilise l'IA pour générer des optimisations 
                prédictives et automatisées. Notre algorithme analyse en temps réel les tendances du 
                marché pour vous donner un avantage concurrentiel immédiat.
              </p>
            </div>

            {/* Partners Section */}
            <div className="mt-16">
              <h4 className="text-lg font-semibold text-gray-400 text-center lg:text-left mb-12">
                Rejoignez nos clients satisfaits
              </h4>
              <div className="mx-auto grid max-w-lg grid-cols-3 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:gap-x-12 lg:mx-0 lg:max-w-none">
                <img
                  alt="Avignon"
                  src="/partners/avignon.png"
                  width={158}
                  height={48}
                  className="max-h-12 w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <img
                  alt="Charles et Alice"
                  src="/partners/charleetalice.png"
                  width={158}
                  height={48}
                  className="max-h-12 w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <img
                  alt="Juste Bios"
                  src="/partners/justebios.png"
                  width={158}
                  height={48}
                  className="max-h-12 w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              
              {/* Témoignages clients */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">+89%</div>
                  <p className="text-sm text-gray-400 mt-2">de visibilité pour Avignon</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">4.8/5</div>
                  <p className="text-sm text-gray-400 mt-2">satisfaction client moyenne</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">-40%</div>
                  <p className="text-sm text-gray-400 mt-2">de temps de gestion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gray-800 rounded-2xl p-8 ring-1 ring-white/10">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Demandez votre démo personnalisée
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-white">
                    Prénom*
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-white">
                    Nom*
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white">
                  Email Professionnel*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  placeholder="exemple@votre-entreprise.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white">
                  Téléphone*
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-white">
                    Entreprise*
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    placeholder="Nom de votre société"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-semibold text-white">
                    Poste*
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                    placeholder="Votre fonction"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-white">
                  Pays*
                </label>
                <div className="mt-2 relative">
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 appearance-none focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  >
                    <option value="">Sélectionnez votre pays</option>
                    <option value="fr">France</option>
                    <option value="be">Belgique</option>
                    <option value="ch">Suisse</option>
                    <option value="lu">Luxembourg</option>
                    <option value="ca">Canada</option>
                    <option value="other">Autre</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="need" className="block text-sm font-semibold text-white">
                  Votre défi principal*
                </label>
                <select
                  id="need"
                  name="need"
                  required
                  value={formData.need}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                >
                  <option value="">Sélectionnez un défi</option>
                  <option value="visibility">Manque de visibilité en ligne</option>
                  <option value="multi-location">Gestion multi-établissements complexe</option>
                  <option value="reviews">Gestion des avis clients</option>
                  <option value="analytics">Manque d'analyses précises</option>
                  <option value="competition">Concurrence trop forte</option>
                  <option value="other">Autre défi</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-white">
                  Votre situation actuelle
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  placeholder="Décrivez votre situation actuelle, outils utilisés, nombre d'établissements..."
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="agreeToPolicies"
                  name="agreeToPolicies"
                  type="checkbox"
                  required
                  checked={formData.agreeToPolicies}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agreeToPolicies" className="text-sm text-gray-400">
                  J'accepte de recevoir des conseils personnalisés et actualités Visiloo. 
                  Désabonnement possible à tout moment.
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
              >
                Envoyer
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                ⚡ Réponse sous 2 heures ouvrées - Aucun engagement requis
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Section Témoignages Clients */}
      <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 mt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-500),transparent)] opacity-10" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Ils font confiance à Visiloo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Témoignage Avignon */}
            <figure className="text-center">
              <blockquote className="text-lg/7 font-semibold text-white">
                <p>
                  "Visiloo a révolutionné notre présence en ligne. Notre visibilité a augmenté de 89% 
                  en seulement 3 mois. Une solution bien plus performante que nos outils précédents."
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <img
                  alt="Avignon"
                  src="/partners/avignon.png"
                  className="mx-auto h-8 w-auto object-contain opacity-90"
                />
                <div className="mt-4 text-base text-gray-400">Directeur Marketing - Avignon</div>
              </figcaption>
            </figure>

            {/* Témoignage Charles et Alice */}
            <figure className="text-center">
              <blockquote className="text-lg/7 font-semibold text-white">
                <p>
                  "L'interface intuitive de Visiloo nous fait gagner 15 heures par semaine sur la gestion 
                  de nos multiples établissements. Un gain de temps considérable !"
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <img
                  alt="Charles et Alice"
                  src="/partners/charleetalice.png"
                  className="mx-auto h-8 w-auto object-contain opacity-90"
                />
                <div className="mt-4 text-base text-gray-400">Responsable Digital - Charles et Alice</div>
              </figcaption>
            </figure>

            {/* Témoignage Juste Bios */}
            <figure className="text-center">
              <blockquote className="text-lg/7 font-semibold text-white">
                <p>
                  "Le support client de Visiloo est exceptionnel. Ils nous accompagnent sur chaque 
                  optimisation et les résultats sont visibles immédiatement dans nos analytics."
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <img
                  alt="Juste Bios"
                  src="/partners/justebios.png"
                  className="mx-auto h-8 w-auto object-contain opacity-90"
                />
                <div className="mt-4 text-base text-gray-400">CEO - Juste Bios</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}