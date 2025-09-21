export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Logo Visiloo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-2xl">V</span>
          </div>
        </div>
        
        <p className="text-base font-semibold text-indigo-400">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
          Page non trouvée
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          Désolé, nous n'avons pas trouvé la page que vous recherchez.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
          >
            Retour à l'accueil
          </a>
          <a 
            href="/contact" 
            className="text-base font-semibold text-white hover:text-indigo-300 transition-colors"
          >
            Contacter le support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* Section supplémentaire avec liens utiles */}
        <div className="mt-16 border-t border-gray-800 pt-8">
          <h3 className="text-sm font-semibold text-gray-400">Pages populaires</h3>
          <div className="mt-4 flex justify-center gap-6">
            <a href="/features" className="text-sm text-indigo-300 hover:text-indigo-200">
              Fonctionnalités
            </a>
            <a href="/pricing" className="text-sm text-indigo-300 hover:text-indigo-200">
              Tarifs
            </a>
            <a href="/demo" className="text-sm text-indigo-300 hover:text-indigo-200">
              Démo
            </a>
            <a href="/about" className="text-sm text-indigo-300 hover:text-indigo-200">
              À propos
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}