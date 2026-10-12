'use client';

import React, { useEffect } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import Accordion from '@/components/ui/Accordion';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchFaqs } from '@/store/slices/faqsSlice';
import { HelpCircle } from 'lucide-react';

export default function FaqContent() {
  const { copy, faqs: i18nFaqs, isEn } = useLanguage();
  const dispatch = useDispatch();
  const reduxFaqs = useSelector((state) => state.faqs?.items);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const sourceFaqs = Array.isArray(reduxFaqs) ? reduxFaqs : [];

  const items = sourceFaqs.map((item) => {
    const translation = i18nFaqs?.[item.id] || {};
    const question = isEn
      ? item.questionEn || item.en?.question || translation.question || item.question
      : item.question || translation.question;
    const answer = isEn
      ? item.answerEn || item.en?.answer || translation.answer || item.answer
      : item.answer || translation.answer;

    return {
      id: item.id || item._id,
      question,
      answer,
    };
  });

  return (
    <section className="bg-sand-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.faqPage?.eyebrow || 'FAQ'}
          title={copy.faqPage?.title || 'Preguntas frecuentes'}
          align="center"
        />
        <div className="mt-10">
          {items.length > 0 ? (
            <Accordion items={items} />
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white border border-sand-200 p-8 shadow-xs">
              <HelpCircle className="w-10 h-10 mx-auto text-sand-400 mb-3" />
              <p className="text-sm font-semibold text-navy-900">
                {isEn ? 'No FAQs available at this time.' : 'No hay preguntas frecuentes disponibles en este momento.'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'Please contact our team directly for any inquiries.' : 'Comuníquese con nuestro equipo si tiene dudas o consultas.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
