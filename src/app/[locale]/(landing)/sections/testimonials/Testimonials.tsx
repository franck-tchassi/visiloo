'use client'

import { motion } from 'framer-motion'
import { StaggerTestimonials } from './stagger-testimonials'


export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-wider text-gray-900 mb-6">
            Découvrez ce que nos CLIENTS disent.
          </h2>
         
        </motion.div>

        <StaggerTestimonials />
      </div>
    </section>
  )
}