import prisma from './prisma';

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });
    return settings;
  } catch (err) {
    console.error('Error fetching site settings:', err);
    return null;
  }
}

export async function getEducationUnits() {
  try {
    const units = await prisma.educationUnit.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return units;
  } catch (err) {
    console.error('Error fetching education units:', err);
    return [];
  }
}

export async function getActivePsbPeriod() {
  try {
    const period = await prisma.psbPeriod.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return period;
  } catch (err) {
    console.error('Error fetching active PSB period:', err);
    return null;
  }
}
