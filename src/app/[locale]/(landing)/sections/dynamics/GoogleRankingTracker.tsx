// Ce code est un squelette, pas une version prête à exporter en GIF
// Il montre comment animer les changements dans la liste + la carte

"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";

const competitorsDataVariants = [
  // jeu de données 1
  [
    { position: 1, title: "A", coords: [50.06, 19.94], rating: 4.9 },
    { position: 2, title: "B", coords: [50.07, 19.95], rating: 4.7 },
    { position: 3, title: "C", coords: [50.05, 19.96], rating: 4.5 },
    { position: 4, title: "D", coords: [50.08, 19.92], rating: 4.2 },
    { position: 5, title: "E", coords: [50.04, 19.93], rating: 4.0 }
  ],
  // jeu de données 2 : positions changées
  [
    { position: 1, title: "C", coords: [50.05, 19.96], rating: 4.5 },
    { position: 2, title: "A", coords: [50.06, 19.94], rating: 4.9 },
    { position: 3, title: "B", coords: [50.07, 19.95], rating: 4.7 },
    { position: 4, title: "E", coords: [50.04, 19.93], rating: 4.0 },
    { position: 5, title: "D", coords: [50.08, 19.92], rating: 4.2 }
  ]
];

const getColor = (pos: number) => {
  if (pos <= 3) return "green";
  if (pos <= 6) return "orange";
  return "red";
};

const AnimatedPositionChecker = () => {
  const [variantIndex, setVariantIndex] = useState(0);
  const competitors = competitorsDataVariants[variantIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setVariantIndex((prev) => (prev + 1) % competitorsDataVariants.length);
    }, 4000); // toutes les 4s, change les données
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-gray-50 p-6 rounded-2xl shadow-lg">
      {/* Liste */}
      <div className="w-1/2 pr-4 space-y-4">
        <AnimatePresence>
          {competitors.map((competitor) => (
            <motion.div
              key={competitor.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md flex justify-between items-center"
            >
              <div className="text-xl font-bold" style={{ color: getColor(competitor.position) }}>
                {competitor.position}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold">{competitor.title}</h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Carte */}
      <div className="w-1/2 h-96 rounded-lg overflow-hidden relative">
        <MapContainer center={[50.06, 19.94]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {competitors.map((comp) => (
            <Marker key={comp.title} position={comp.coords}>
              <Tooltip direction="top" offset={[0, -10]} permanent>
                <span style={{ color: getColor(comp.position), fontWeight: "bold" }}>
                  {comp.position}
                </span>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AnimatedPositionChecker;
;