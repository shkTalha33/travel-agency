'use client';

import React, { useState } from 'react';
import { Mail, User, Building, Send, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { contactApi } from '@/lib/apiClient';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';

export default function ContactFormGridWithDetails() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isEn = language === 'en';

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    company: '',
    message: '',
    agree: true,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.fullname.trim()) {
      errs.fullname = isEn ? 'Full name is required' : 'El nombre completo es requerido';
    }
    if (!form.email.trim()) {
      errs.email = isEn ? 'Email address is required' : 'El correo electrónico es requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = isEn ? 'Invalid email format' : 'Formato de correo no válido';
    }
    if (!form.message.trim() || form.message.length < 5) {
      errs.message = isEn ? 'Message must be at least 5 characters' : 'El mensaje debe tener al menos 5 caracteres';
    }
    if (!form.agree) {
      errs.agree = isEn ? 'Please accept the terms' : 'Debes aceptar los términos';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await contactApi.submit({
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        subject: form.company.trim() || (isEn ? 'General VIP Travel Inquiry' : 'Consulta VIP de Viaje'),
        message: form.message.trim(),
      });

      setSubmitted(true);
      toast(
        isEn ? 'Inquiry sent successfully!' : '¡Mensaje enviado con éxito!',
        'success'
      );
    } catch (err) {
      const msg = err.message || (isEn ? 'Error submitting contact form.' : 'Error al enviar el mensaje de contacto.');
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ fullname: '', email: '', company: '', message: '', agree: true });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] w-full bg-slate-100/80 py-12 md:py-20 lg:py-24 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Full-width 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Icon, Title, Description, Inline Info & Transparent Tilted 3D World Map (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Mail Icon Badge */}
              <div className="relative inline-flex items-center justify-center rounded-2xl bg-navy-950 border border-gold-400/30 p-3 shadow-md">
                <Mail className="h-6 w-6 text-gold-400" />
                <div className="absolute inset-0 rounded-2xl bg-gold-400/10 blur-sm -z-10" />
              </div>

              {/* Main Heading */}
              <h1 className="mt-6 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-navy-950">
                {isEn ? 'Contact us' : 'Contáctanos'}
              </h1>

              {/* Subtitle Description */}
              <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-xl">
                {isEn 
                  ? 'We are always looking for ways to improve our travel experiences and membership rewards. Contact us and let us know how we can help you.'
                  : 'Siempre buscamos perfeccionar tus experiencias de viaje y recompensas VIP. Contáctanos y cuéntanos cómo podemos ayudarte a planear tu próxima escapada.'}
              </p>

              {/* Inline Contact Info Row */}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <a href="mailto:concierge@viajesdominicana.com" className="hover:text-ocean-700 transition-colors font-semibold">
                  concierge@viajesdominicana.com
                </a>
                <span className="text-slate-400 select-none">•</span>
                <a href="tel:+18095558427" className="hover:text-ocean-700 transition-colors font-semibold">
                  +1 (809) 555-8427
                </a>
                <span className="text-slate-400 select-none">•</span>
                <a href="mailto:reservas@viajesdominicana.com" className="hover:text-ocean-700 transition-colors font-semibold">
                  reservas@viajesdominicana.com
                </a>
              </div>
            </div>

            {/* Seamless 3D World Map sitting directly on the page background */}
            <div className="relative mt-8 sm:mt-12 w-full h-[250px] sm:h-[300px] [perspective:900px] select-none pointer-events-none">
              <div 
                className="relative w-full h-full [transform:rotateX(26deg)_rotateZ(-7deg)] transition-all duration-700"
              >
                {/* Geographically accurate world map rendered in exact Navy-950 color */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="https://assets.aceternity.com/pro/world.svg"
                    alt="World Map"
                    className="w-full h-full object-contain filter brightness-0 contrast-200 opacity-75"
                  />
                </div>

                {/* SVG Overlay for Golden Beacon ground rings and vertical glowing Golden position pointer line */}
                <svg 
                  viewBox="0 0 1000 500" 
                  className="absolute inset-0 w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Golden Laser Gradient matching the button palette */}
                    <linearGradient id="goldLaserGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
                      <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity="0.85" />
                    </linearGradient>
                    <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#d4af37" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* Beacon Position: Dominican Republic / Caribbean location in button gold */}
                  <ellipse cx="325" cy="235" rx="38" ry="17" fill="rgba(212, 175, 55, 0.22)" stroke="#d4af37" strokeWidth="2" className="animate-pulse" filter="url(#goldGlow)" />
                  <ellipse cx="325" cy="235" rx="22" ry="10" fill="rgba(212, 175, 55, 0.45)" stroke="#b45309" strokeWidth="2" />
                  <circle cx="325" cy="235" r="5" fill="#d4af37" stroke="#0a1128" strokeWidth="1.5" />

                  {/* High-visibility Vertical Golden Position Pointer Line */}
                  <line x1="325" y1="235" x2="325" y2="72" stroke="#0a1128" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
                  <line x1="325" y1="235" x2="325" y2="72" stroke="url(#goldLaserGrad)" strokeWidth="2.2" strokeLinecap="round" filter="url(#goldGlow)" />
                  <line x1="325" y1="235" x2="325" y2="72" stroke="#fef08a" strokeWidth="0.9" strokeLinecap="round" />
                </svg>

                {/* Floating "We are here" / "Estamos aquí" Tooltip Badge */}
                <div 
                  className="absolute"
                  style={{ left: '32.5%', top: '9%', transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative flex items-center gap-1.5 rounded-xl border border-gold-500 bg-navy-950 px-3.5 py-1 text-xs font-bold text-gold-300 shadow-[0_4px_20px_rgba(212,175,55,0.35)] backdrop-blur-md whitespace-nowrap">
                    <span className="h-2 w-2 rounded-full bg-gold-400 animate-ping" />
                    <span>{isEn ? 'We are here' : 'Estamos aquí'}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Full White Form Card matching our other pages (6 cols) */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xl">
              
              {submitted ? (
                /* Animated Success Confirmation State */
                <div className="py-10 text-center animate-fade-in">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 mb-4">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-navy-950">
                    {isEn ? 'Inquiry sent successfully!' : '¡Mensaje enviado con éxito!'}
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
                    {isEn 
                      ? 'We have received your message. One of our VIP travel specialists will get back to you shortly.'
                      : 'Hemos recibido tu solicitud. Uno de nuestros asesores de viajes de lujo te contactará en breve.'}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="primary"
                      onClick={resetForm}
                      className="rounded-2xl px-6 py-2.5 font-bold shadow-md"
                    >
                      {isEn ? 'Send another message' : 'Enviar otra consulta'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Active Form matching login/register pages */
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-navy-950 capitalize sm:text-3xl">
                      {isEn ? 'Send us a message' : 'Envíanos un mensaje'}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                      {isEn 
                        ? 'Fill out the form below and a dedicated travel specialist will get back to you within 2 hours.'
                        : 'Completa el formulario y un asesor exclusivo se comunicará contigo en menos de 2 horas.'}
                    </p>
                  </div>

                  {/* Full Name */}
                  <Input
                    id="contact-fullname"
                    label={isEn ? 'Full name' : 'Nombre completo'}
                    type="text"
                    placeholder={isEn ? 'Alexander Miller' : 'Alejandro Morales'}
                    value={form.fullname}
                    onChange={(e) => {
                      setForm({ ...form, fullname: e.target.value });
                      if (errors.fullname) setErrors({ ...errors, fullname: '' });
                    }}
                    error={errors.fullname}
                    icon={<User size={16} />}
                    required
                  />

                  {/* Email Address */}
                  <Input
                    id="contact-email"
                    label={isEn ? 'Email address' : 'Correo electrónico'}
                    type="email"
                    placeholder="yourname@example.com"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    error={errors.email}
                    icon={<Mail size={16} />}
                    required
                  />

                  {/* Company / Trip Topic */}
                  <Input
                    id="contact-company"
                    label={isEn ? 'Company / Trip subject' : 'Empresa / Asunto del viaje'}
                    type="text"
                    placeholder={isEn ? 'e.g. Punta Cana VIP Vacation' : 'Ej. Vacaciones VIP Punta Cana'}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    icon={<Building size={16} />}
                  />

                  {/* Message Textarea */}
                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium capitalize text-slate-700">
                      {isEn ? 'Message or trip details' : 'Mensaje o detalles del viaje'}
                      <span className="ml-1 text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: '' });
                        }}
                        placeholder={isEn 
                          ? 'Tell us about your estimated dates, party size, preferred vibe, or any special requests...' 
                          : 'Cuéntanos sobre fechas estimadas, número de viajeros, destinos preferidos o solicitudes especiales...'}
                        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 outline-none focus:outline-none focus:ring-0 resize-y ${
                          errors.message ? 'border-rose-500' : 'border-slate-300 hover:border-slate-400 focus:border-gold-500'
                        }`}
                      />
                    </div>
                    {errors.message && <p className="mt-1.5 text-xs text-rose-600">{errors.message}</p>}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <Checkbox
                      id="contact-terms"
                      label={isEn 
                        ? 'I agree to receive personalized travel recommendations and terms.' 
                        : 'Acepto recibir atención personalizada y los términos del servicio.'}
                      checked={form.agree}
                      onChange={(e) => {
                        setForm({ ...form, agree: e.target.checked });
                        if (errors.agree) setErrors({ ...errors, agree: '' });
                      }}
                      error={errors.agree}
                    />
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full rounded-2xl py-3.5 text-sm font-bold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                      isLoading={loading}
                    >
                      <Send size={16} className="text-white" />
                      <span>
                        {loading 
                          ? (isEn ? 'Submitting...' : 'Enviando...') 
                          : (isEn ? 'Send inquiry message' : 'Enviar mensaje de consulta')}
                      </span>
                    </Button>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>{isEn ? 'Your information is 100% confidential & encrypted under SSL.' : 'Tus datos están 100% confidenciales y encriptados bajo SSL.'}</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
