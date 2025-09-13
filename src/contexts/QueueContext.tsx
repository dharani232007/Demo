import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Patient {
  id: string;
  name: string;
  position: number;
  status: 'waiting' | 'being-served' | 'skipped';
  joinedAt: string;
  entryCode: string;
}

interface QueueStats {
  totalPatients: number;
  patientsServed: number;
  avgWaitTime: number;
  efficiency: number;
}

interface QueueContextType {
  patients: Patient[];
  currentPatient: Patient | null;
  queuePaused: boolean;
  stats: QueueStats;
  addPatient: (name: string, entryCode: string) => void;
  callNext: () => Patient | null;
  skipPatient: () => void;
  toggleQueue: () => void;
  setCurrentPatient: (patient: Patient | null) => void;
  getPatientPosition: (patientName: string) => number;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

interface QueueProviderProps {
  children: ReactNode;
}

export const QueueProvider: React.FC<QueueProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [queuePaused, setQueuePaused] = useState(false);
  const [patientsServed, setPatientsServed] = useState(0);

  const stats: QueueStats = {
    totalPatients: patients.length,
    patientsServed,
    avgWaitTime: patients.length * 15, // 15 minutes per patient
    efficiency: patients.length > 0 ? Math.round((patientsServed / (patientsServed + patients.length)) * 100) : 100
  };

  const addPatient = (name: string, entryCode: string) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      name,
      position: patients.length + 1,
      status: 'waiting',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      entryCode
    };
    
    setPatients(prev => [...prev, newPatient]);
  };

  const callNext = (): Patient | null => {
    if (patients.length === 0) return null;
    
    const nextPatient = patients[0];
    setCurrentPatient(nextPatient);
    setPatients(prev => prev.slice(1).map((p, index) => ({ ...p, position: index + 1 })));
    setPatientsServed(prev => prev + 1);
    
    return nextPatient;
  };

  const skipPatient = () => {
    if (patients.length === 0) return;
    
    const skippedPatient = patients[0];
    setPatients(prev => [
      ...prev.slice(1).map((p, index) => ({ ...p, position: index + 1 })),
      { ...skippedPatient, position: prev.length, status: 'skipped' }
    ]);
  };

  const toggleQueue = () => {
    setQueuePaused(!queuePaused);
  };

  const getPatientPosition = (patientName: string): number => {
    const patient = patients.find(p => p.name === patientName);
    return patient ? patient.position : 0;
  };

  const value: QueueContextType = {
    patients,
    currentPatient,
    queuePaused,
    stats,
    addPatient,
    callNext,
    skipPatient,
    toggleQueue,
    setCurrentPatient,
    getPatientPosition
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};
