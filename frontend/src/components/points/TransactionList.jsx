'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { List, ListItem } from '@/components/ui/List';
import { useLanguage } from '@/context/LanguageContext';

export const txTitle = (t, txDict = {}) => {
  if (t.type === 'redemption') return txDict.redemption || 'Canje de puntos';
  if (typeof txDict.referralFrom === 'function') return txDict.referralFrom(t.sourcePerson);
  return `Referido de ${t.sourcePerson}`;
};

/** Presentational transaction list. Takes `transactions` via props. */
export default function TransactionList({ transactions = [], compact = false }) {
  const { copy } = useLanguage();
  const txDict = copy.tx || {};

  return (
    <List>
      {transactions.map((t) => (
        <ListItem
          key={t.id}
          title={txTitle(t, txDict)}
          subtitle={`${t.purchaseDescription} · ${t.date}`}
          trailing={
            <div className="text-right">
              <p className={`text-sm font-bold ${t.points < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {t.points > 0 ? '+' : ''}{t.points} {compact ? '' : (copy.common.points || 'puntos')}
              </p>
              {t.level && <Badge variant="ocean" size="sm">{txDict.level || 'Nivel'} {t.level}</Badge>}
            </div>
          }
        />
      ))}
    </List>
  );
}
