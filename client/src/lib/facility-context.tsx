import { createContext, useContext, useState, ReactNode } from "react";

type Facility = {
  id: number;
  name: string;
  code: string;
};

type FacilityContextType = {
  selectedFacility: Facility | 'all';
  setSelectedFacility: (facility: Facility | 'all') => void;
};

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export function FacilityProvider({ children }: { children: ReactNode }) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | 'all'>('all');

  return (
    <FacilityContext.Provider value={{ selectedFacility, setSelectedFacility }}>
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacility() {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacility must be used within a FacilityProvider');
  }
  return context;
}

export type { Facility };