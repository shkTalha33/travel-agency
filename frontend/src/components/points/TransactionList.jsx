'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { List, ListItem } from '@/components/ui/List';
import { useLanguage } from '@/context/LanguageContext';

export const txTitle = (t, txDict = {}, isEn = false) => {
  if (t.type === 'redemption') return txDict.redemption || (isEn ? 'Points Redemption' : 'Canje de puntos');
  if (typeof txDict.referralFrom === 'function') return txDict.referralFrom(t.sourcePerson);
  return isEn ? `Referral from ${t.sourcePerson}` : `Referido de ${t.sourcePerson}`;
};

/** Presentational transaction list. Takes `transactions` via props. */
export default function TransactionList({ transactions = [], compact = false }) {
  const { copy, isEn } = useLanguage();
  const txDict = copy.tx || {};

  return (
    <List>
      {transactions.map((t) => {
        // Format readable date without 'undefined'
        const txDate = t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : t.iso) || '';
        
        // Clean any raw mongo ids from description
        let desc = t.purchaseDescription || (isEn ? 'Points Transaction' : 'Transacción de puntos');
        if (desc.includes('#')) {
          desc = desc.replace(/#[a-f0-9]{24}/gi, '').trim();
        }

        const subtitleText = txDate ? `${desc} · ${txDate}` : desc;

        return (
          <ListItem
            key={t.id || t._id}
            title={txTitle(t, txDict, isEn)}
            subtitle={subtitleText}
            trailing={
              <div className="text-right">
                <p className={`text-sm font-bold ${t.points < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {t.points > 0 ? '+' : ''}{t.points} {compact ? '' : (copy.common?.points || 'PTS')}
                </p>
                {t.level && <Badge variant="ocean" size="sm">{txDict.level || 'Nivel'} {t.level}</Badge>}
              </div>
            }
          />
        );
      })}
    </List>
  );
}
