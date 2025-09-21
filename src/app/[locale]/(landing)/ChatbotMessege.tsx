'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  X, ArrowLeft, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MdOutlineSms } from "react-icons/md";
import Image from "next/image"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<"main" | "sms" | "whatsapp">("main")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour envoyer le SMS
    const response = await fetch("/api/bulksms", {
        method:"POST",
        headers:{
            "content-type": "application/json",
        },
        body: JSON.stringify({
            phone,
            message,
        }),
    })
    // Réinitialiser le formulaire
    setName("")
    setPhone("")
    setMessage("")
    // Revenir à la vue principale
    setView("main")
  }

  const handleWhatsAppRedirect = () => {
    // Redirection vers WhatsApp
    window.open("https://wa.me/33600000000", "_blank")
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-full max-w-md min-w-[350px]"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <Card className="h-[500px] flex flex-col shadow-2xl border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 border-b border-gray-200">
                <div className="flex items-center">
                  {view !== "main" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setView("main")}
                      className="mr-2 h-8 w-8 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <CardTitle className="text-lg font-bold">
                    {view === "main" ? "Une question ?" : 
                    view === "sms" ? "Contact par SMS" : "Contact WhatsApp"}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-hidden p-2">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {view === "main" && (
                      <div className="text-center py-8">
                         <p className="text-gray-600 mb-6">Choisir un canal pour discuter</p>
                        <div className="flex flex-col gap-4">
                          <Button 
                            onClick={() => setView("sms")} 
                            className="flex items-center font-bold justify-center gap-2 py-6"
                            variant="outline"
                          >
                            <MdOutlineSms className="w-10 h-10" />
                            SMS
                          </Button>
                          
                          <Button 
                            onClick={() => setView("whatsapp")} 
                            className="flex items-center font-bold justify-center gap-2 py-6"
                            variant="outline"
                          >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                            </svg>
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    )}

                   {view === "sms" && (
                      <div className="py-4">
                        <p className="text-gray-600 mb-6 text-center">Nous reviendrons vers vous par SMS.</p>
                        <form onSubmit={handleSmsSubmit} className="space-y-4  flex flex-col justify-center px-6">
                          {/* Nom - Une seule ligne */}
                          <div className="flex items-center gap-3">
                            
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Nom"
                              required
                              className="flex-1"
                            />
                          </div>

                          {/* Numéro de téléphone - Une seule ligne */}
                          <div className="flex items-center gap-3">
                            
                            <div className="flex-1 flex">
                              <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-100 text-gray-500 text-sm">
                                +33
                              </div>
                              <Input
                                id="Phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="612345678"
                                required
                                className="rounded-l-none flex-1"
                                maxLength={9}
                              />
                            </div>
                          </div>

                          {/* Message - Une seule ligne avec placeholder amélioré */}
                          <div className="flex items-center gap-3">
                            
                            <textarea
                              id="message"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Votre demande ?"
                              className="w-full p-2 border rounded-md min-h-[60px] flex-1"
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full cursor-pointer mt-4">
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer
                          </Button>
                        </form>
                      </div>
                    )}

                    {view === "whatsapp" && (
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">Scannez le QR code pour envoyer un message depuis votre mobile sur WhatsApp.</p>
                        
                        <div className="mb-6 flex justify-center">
                          <div className="border-8 p-2 bg-white rounded-4xl">
                            {/* Correction de l'image WhatsApp */}
                            <div className="w-28 h-28  bg-gray-200 flex items-center justify-center relative">
                              <Image 
                                src="/whatsapp.png" 
                                alt="QR Code WhatsApp" 
                                width={112}
                                height={112}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">Ou</p>
                        
                        <Button onClick={handleWhatsAppRedirect} className="w-full mb-4 cursor-pointer">
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                          </svg>
                          WhatsApp Web
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bouton flottant en bas à droite */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 shadow-lg cursor-pointer"
          aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </Button>
      </div>
    </>
  )
}