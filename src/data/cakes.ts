// Cake collections, transcribed from the client's published order guide (nakedcakes.be/order-cake).
// All cakes are red velvet, two layers, real cream cheese frosting. No writing on cakes.
export type Size = 'medium' | 'large' | 'xl';
export type Style = 'basic' | 'vintage' | 'covered';
export type Shape = 'round' | 'heart' | 'rectangle';
export type Frosting = 'white' | 'surprise';

export const sizes: Record<Size, { cm: string; people: string }> = {
  medium: { cm: '18 cm', people: '8-12' },
  large: { cm: '25 cm', people: '12-25' },
  xl: { cm: '35 x 28 cm', people: '25-40' },
};

/** Price in euro by style and size, as published. */
export const prices: Record<Style, Record<Size, number>> = {
  basic: { medium: 75, large: 135, xl: 250 },
  vintage: { medium: 95, large: 165, xl: 285 },
  covered: { medium: 135, large: 205, xl: 330 },
};

export const decoPrice = 1; // ribbons or cherries, per piece
export const maxDeco = 12; // UI cap per decoration type; client to confirm a real maximum

/** XL only comes as a rectangle; Medium and Large come round or heart. */
export const shapesFor = (size: Size): Shape[] => (size === 'xl' ? ['rectangle'] : ['round', 'heart']);

export function estimate(o: { size?: Size; style?: Style; ribbons?: number; cherries?: number }): number | null {
  if (!o.size || !o.style) return null;
  return prices[o.style][o.size] + decoPrice * ((o.ribbons || 0) + (o.cherries || 0));
}
