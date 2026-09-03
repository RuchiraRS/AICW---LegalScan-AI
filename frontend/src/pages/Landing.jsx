import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ShieldCheck, Zap, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base text-primary flex flex-col">
      <header className="px-10 py-6 flex justify-between items-center bg-white border-b border-border">
        <div className="text-2xl font-bold tracking-tighter">LegalScan AI</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="primary" onClick={() => navigate('/login')}>Get Started</Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
        >
          Automated Compliance <br/><span className="text-accent">Verification Engine</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl"
        >
          Government-grade AI enforcement for industrial and commercial goods. Detect missing CE markings, documentation flaws, and non-compliance instantly.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="primary" className="text-lg px-8 py-4" onClick={() => navigate('/login')}>
            Access Dashboard
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: ShieldCheck, title: "Rule Enforcement", desc: "Strict adherence to government guidelines." },
            { icon: Zap, title: "Instant Analysis", desc: "AI-driven image and document processing." },
            { icon: Server, title: "Secure Storage", desc: "Tamper-proof inspection logs." },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-white p-6 rounded-2xl border border-border shadow-sm text-left"
            >
              <feat.icon className="text-accent mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-600 text-sm">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
