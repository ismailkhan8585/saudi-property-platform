export const LAHORE_SOCIETIES = [
  'DHA Lahore',
  'Bahria Town Lahore',
  'Gulberg',
  'Model Town',
  'Johar Town',
  'Garden Town',
  'Allama Iqbal Town',
  'Faisal Town',
  'Valencia Town',
  'Lake City',
  'Paragon City',
  'Askari Housing',
  'Wapda Town',
  'Punjab University Society',
  'Raiwind Road',
  'Canal Road',
  'Cantt',
  'Sabzazar',
  'Iqbal Town',
  'Township',
  'Tajpura',
  'Other',
] as const;

export type LahoreSociety = (typeof LAHORE_SOCIETIES)[number];

const SOCIETY_ALIASES: Record<LahoreSociety, readonly string[]> = {
  'DHA Lahore': ['DHA Lahore', 'DHA', 'Defence Housing Authority Lahore'],
  'Bahria Town Lahore': ['Bahria Town Lahore', 'Bahria Town', 'Bahria Lahore'],
  Gulberg: ['Gulberg', 'Gulberg Lahore'],
  'Model Town': ['Model Town', 'Model Town Lahore'],
  'Johar Town': ['Johar Town', 'Johar Town Lahore'],
  'Garden Town': ['Garden Town', 'Garden Town Lahore'],
  'Allama Iqbal Town': ['Allama Iqbal Town', 'Allama Iqbal Town Lahore'],
  'Faisal Town': ['Faisal Town', 'Faisal Town Lahore'],
  'Valencia Town': ['Valencia Town', 'Valencia', 'Valencia Housing Society'],
  'Lake City': ['Lake City', 'Lake City Lahore'],
  'Paragon City': ['Paragon City', 'Paragon City Lahore'],
  'Askari Housing': ['Askari Housing', 'Askari', 'Askari Lahore'],
  'Wapda Town': ['Wapda Town', 'WAPDA Town', 'Wapda Town Lahore'],
  'Punjab University Society': ['Punjab University Society', 'Punjab University Housing Society', 'PU Society'],
  'Raiwind Road': ['Raiwind Road', 'Raiwind Road Lahore'],
  'Canal Road': ['Canal Road', 'Canal Road Lahore'],
  Cantt: ['Cantt', 'Lahore Cantt', 'Cantonment Lahore'],
  Sabzazar: ['Sabzazar', 'Sabzazar Scheme', 'Sabzazar Lahore'],
  'Iqbal Town': ['Iqbal Town', 'Iqbal Town Lahore'],
  Township: ['Township', 'Township Lahore'],
  Tajpura: ['Tajpura', 'Tajpura Lahore'],
  Other: ['Other'],
};

export function normalizeSocietyName(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('en')
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ');
}

const CANONICAL_BY_ALIAS = new Map<string, LahoreSociety>(
  LAHORE_SOCIETIES.flatMap(society =>
    SOCIETY_ALIASES[society].map(alias => [normalizeSocietyName(alias), society] as const),
  ),
);

export function canonicalizeSociety(value?: string | null): LahoreSociety | undefined {
  if (!value) return undefined;
  return CANONICAL_BY_ALIAS.get(normalizeSocietyName(value));
}

export function getSocietyAliases(value: string): readonly string[] {
  const canonical = canonicalizeSociety(value);
  return canonical ? SOCIETY_ALIASES[canonical] : [value.trim()];
}
