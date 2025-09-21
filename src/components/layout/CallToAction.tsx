import React from "react";

const CallToAction = () => {
    return (
        <section className="py-8 bg-gradient-to-r max-w-6xl m-auto from-orange-400 via-orange-500 to-orange-600 text-white text-center rounded-4xl">
            <div className="max-w-xl mx-auto px-2">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4 ">
                    Prêt à booster votre visibilité locale ?
                </h2>
                <p className="text-base mb-6 opacity-90">
                    Essayez LocalAdd gratuitement pendant 14 jours et découvrez comment attirer plus de clients dès aujourd'hui.
                </p>
                <a
                    href="/auth/sign-in"
                    className="inline-block px-8 py-3 rounded-full bg-white text-orange-600 font-bold text-base shadow-lg hover:bg-orange-100 hover:text-orange-700 transition-all border-2 border-white"
                >
                    Commencer l'essai gratuit
                </a>
            </div>
        </section>
    );
};

export default CallToAction;
