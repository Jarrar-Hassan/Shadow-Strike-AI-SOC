import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Shield, ArrowRight, Activity, Search, User, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

const TypingLog = () => {
  const logs = [
    "Failed password for invalid user root from 192.168.1.105 port 54323 ssh2",
    "sudo: auth could not identify password for [test]",
    "Connection from 10.0.0.45 port 3306 [tcp/mysql] ACCEPTED",
    "Possible SYN SYN-ACK flood from 192.168.1.100 on eth0",
    "Oct 14 10:14:15 server kernel: [  123.456] IN=eth0 OUT= MAC=00:11:22... SRC=10.1.1.50 DST=10.1.1.200 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=4567 DF PROTO=TCP SPT=80 DPT=12345 WINDOW=8192 RES=0x00 ACK URGP=0"
  ];
  
  const [currentLog, setCurrentLog] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLog(prev => (prev + 1) % logs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [logs.length]);

  return (
    <div className="font-mono text-xs sm:text-sm text-green-400 bg-slate-900/80 p-4 rounded-lg shadow-inner overflow-hidden h-20 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLog}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 p-4 flex items-center"
        >
          {">_ " + logs[currentLog]}
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const AnimatedCounter = ({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col justify-center min-h-[90vh]">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <motion.div style={{ y: y1 }} className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <motion.div style={{ y: y2 }} className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                <span>Next-Gen AI Security Operations</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
                Uncover Hidden Threats <br className="hidden md:block"/>
                with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Contextual AI</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                ShadowStrike analyzes raw security logs in seconds, mapping attacker behavior to the MITRE ATT&CK framework and generating actionable defense intelligence.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="h-14 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                  <Link href="/analyze">
                    Start Free Analysis <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-300 hover:bg-slate-100" asChild>
                  <Link href="/analyze?demo=apt">
                    View Demo Report
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                {/* Rotating shield graphic */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-primary/20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-2xl rotate-12 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white -rotate-12" />
                  </div>
                </div>
                {/* Floating log snippets */}
                <div className="absolute -bottom-4 -left-8 right-8">
                  <TypingLog />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800">
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-white mb-1"><AnimatedCounter end={50000} suffix="+" /></div>
              <div className="text-slate-400 text-sm font-medium">Threats Analyzed</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-white mb-1"><AnimatedCounter end={99} suffix=".7%" /></div>
              <div className="text-slate-400 text-sm font-medium">Detection Accuracy</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-white mb-1">&lt; <AnimatedCounter end={3} suffix="s" /></div>
              <div className="text-slate-400 text-sm font-medium">Analysis Time</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-white mb-1"><AnimatedCounter end={140} suffix="+" /></div>
              <div className="text-slate-400 text-sm font-medium">MITRE Techniques</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Enterprise-Grade Intelligence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Stop analyzing logs manually. Let our specialized AI engine extract the narrative behind the alerts.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Activity,
                title: "AI Log Parsing",
                desc: "Instantly parse syslogs, CloudTrail, Firewall, Zeek, Suricata, Windows Event logs"
              },
              {
                icon: Shield,
                title: "MITRE ATT&CK Mapping",
                desc: "Every behavior mapped to specific tactics and techniques in real-time"
              },
              {
                icon: Search,
                title: "IOC Extraction",
                desc: "Auto-extract IPs, domains, file hashes, CVEs, URLs from any log format"
              },
              {
                icon: User,
                title: "Threat Actor Profiling",
                desc: "Attribute attacks to known threat groups with sophistication scoring"
              },
              {
                icon: BookOpen,
                title: "Incident Playbook",
                desc: "Auto-generate 7-phase IR playbooks tailored to the specific attack type"
              },
              {
                icon: TrendingUp,
                title: "Risk Scoring",
                desc: "0-100 composite risk score with confidence rating for triage priority"
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            
            {[
              { step: 1, title: "Paste Logs", desc: "Drop your raw, unformatted logs into our secure terminal." },
              { step: 2, title: "AI Analysis", desc: "Our engine parses, correlates, and enriches the data instantly." },
              { step: 3, title: "Act on Intelligence", desc: "Get actionable defenses, playbooks, and mitigation steps." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 text-center"
              >
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 relative">
                  <span className="text-3xl font-black text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-600/30 opacity-50 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Stop reacting. Start predicting.</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join the next generation of security operations and turn your raw logs into actionable defense intelligence today.</p>
            <Button size="lg" asChild className="h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-xl">
              <Link href="/analyze">Start Free Analysis</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-slate-900">ShadowStrike</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} ShadowStrike. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
