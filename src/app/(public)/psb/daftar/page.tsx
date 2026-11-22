import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import PsbRegisterForm from '@/components/public/PsbRegisterForm';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Pendaftaran Santri Baru Online (PSB)',
  description: 'Formulir online pendaftaran santri baru Yayasan Darussalam Bacan TA 2026/2027.',
};

export default async function PsbDaftarPage() {
  const [units, period] = await Promise.all([
    prisma.educationUnit.findMany({
      where: { isActive: true, isPsbOpen: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.psbPeriod.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const unitOptions = units.map((u) => ({
    id: u.id,
    name: u.name,
    shortName: u.shortName,
    slug: u.slug,
    level: u.level,
    registrationFee: u.registrationFee,
  }));

  const periodId = period?.id || 'default-period';
  const periodName = period?.name || 'Gelombang I - TA 2026/2027';

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#0F2A24]" />
              <p className="text-xs text-slate-500">Memuat formulir pendaftaran...</p>
            </div>
          }
        >
          <PsbRegisterForm
            units={unitOptions}
            periodId={periodId}
            periodName={periodName}
          />
        </Suspense>
      </div>
    </div>
  );
}
