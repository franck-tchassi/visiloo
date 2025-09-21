
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import React from 'react'
import ChatbotMessege from './ChatbotMessege';

type Props = {
  children: React.ReactNode;
}

const LandingLayout = ({children}: Props) => {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-background">
        {children}
      </main>
      <Footer /> 
      <ChatbotMessege />
    </div>
  )
}

export default LandingLayout