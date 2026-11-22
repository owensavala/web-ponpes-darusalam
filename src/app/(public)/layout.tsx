import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import DynamicWaButton from '@/components/public/DynamicWaButton';
import { getEducationUnits, getSiteSettings } from '@/lib/data';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [units, settings] = await Promise.all([
    getEducationUnits(),
    getSiteSettings(),
  ]);

  const unitSummaries = units.map((u) => ({
    id: u.id,
    name: u.name,
    shortName: u.shortName,
    slug: u.slug,
    level: u.level,
    whatsappNumber: u.whatsappNumber,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        units={unitSummaries}
        sitePhone={settings?.mainWhatsapp || '6282293883344'}
        siteEmail={settings?.email || 'info@darussalambacan.sch.id'}
      />
      <main className="flex-1">{children}</main>
      <Footer
        units={unitSummaries}
        sitePhone={settings?.mainWhatsapp || '6282293883344'}
        siteEmail={settings?.email || 'info@darussalambacan.sch.id'}
        address={settings?.address}
        npyp={settings?.npyp}
      />
      <DynamicWaButton
        units={unitSummaries}
        defaultWhatsapp={settings?.mainWhatsapp || '6282293883344'}
        siteName={settings?.siteName}
      />
    </div>
  );
}
