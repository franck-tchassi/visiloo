"use client";

export default function AboutPage() {
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
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            À propos de Visiloo
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
            Découvrez la vision et les valeurs qui guident notre mission pour révolutionner 
            la visibilité digitale des entreprises.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left Column - Why Visiloo */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Pourquoi choisir Visiloo ?
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-300">
                Choisir Visiloo, c'est opter pour une solution intelligente qui révolutionne 
                votre présence en ligne. Nous vous accompagnons dans chaque étape de votre 
                stratégie digitale pour maximiser votre visibilité et transformer votre 
                attractivité en ligne.
              </p>
              <p className="text-lg text-gray-300">
                Grâce à nos technologies innovantes, développez votre audience et fidélisez 
                vos clients tout en analysant votre positionnement concurrentiel. 
                Concentrez-vous sur l'essentiel : développer votre activité en toute sérénité.
              </p>
              <p className="text-lg text-gray-300">
                Notre plateforme intuitive et nos algorithmes avancés vous donnent un avantage 
                compétitif immédiat, avec des résultats mesurables dès les premiers jours.
              </p>
            </div>
          </div>

          {/* Right Column - Team Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">👥</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Notre équipe</h3>
                  <p className="text-indigo-100">
                    Des experts passionnés dédiés à votre succès
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Pillars Section */}
        <div className="bg-gray-800 rounded-2xl p-12 mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Les 3 piliers de Visiloo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Partenaire de confiance</h3>
              <p className="text-gray-300">
                Nos clients peuvent toujours compter sur notre engagement et notre support continu
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Expert du SEO local</h3>
              <p className="text-gray-300">
                Bénéficiez de l'expertise de nos équipes spécialisées en visibilité locale
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Solution tout-en-un</h3>
              <p className="text-gray-300">
                Une plateforme unique pour gérer l'ensemble de votre marketing local
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Nos valeurs fondamentales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Innovation</h3>
              <p className="text-gray-300 text-sm">
                Nous repoussons constamment les limites en explorant de nouvelles technologies 
                et approches pour rester à la pointe du digital.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">😊</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Passion</h3>
              <p className="text-gray-300 text-sm">
                Visiloo, c'est une aventure humaine où l'enthousiasme et la bonne humeur 
                sont au cœur de notre culture d'entreprise.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">❤️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Empathie</h3>
              <p className="text-gray-300 text-sm">
                Notre succès repose sur des relations authentiques et une compréhension 
                profonde des besoins de nos clients et collaborateurs.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Impact</h3>
              <p className="text-gray-300 text-sm">
                Nous mesurons notre réussite à l'aune de l'impact positif que nous créons 
                pour nos clients et notre environnement.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Simplicité</h3>
              <p className="text-gray-300 text-sm">
                Nous transformons la complexité du digital en solutions simples, 
                accessibles et efficaces pour tous.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Excellence</h3>
              <p className="text-gray-300 text-sm">
                Nous visons l'excellence dans chaque détail pour offrir une expérience 
                exceptionnelle à nos utilisateurs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24">
          <h2 className="text-3xl font-bold text-white mb-8">
            Avez-vous des questions ?
          </h2>
          <div className="flex justify-center gap-6">
            <a
              href="/contact"
              className="rounded-md bg-gray-700 px-8 py-3 text-base font-semibold text-white shadow-xs hover:bg-gray-600 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}