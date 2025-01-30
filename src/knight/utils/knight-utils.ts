import { CreateKnightDto } from '../dto/create-knight.dto';

function calculateModifier(attrValue: number): number {
  if (attrValue <= 8) return -2;
  if (attrValue <= 10) return -1;
  if (attrValue <= 12) return 0;
  if (attrValue <= 15) return 1;
  if (attrValue <= 18) return 2;
  return 3;
}

function calculateAttack(knight: CreateKnightDto): number {
  if (!knight || !knight.attributes || !knight.keyAttribute) return 10;

  const keyAttrValue = knight.attributes[knight.keyAttribute] || 0;
  const equippedWeapon = knight.weapons?.find((w) => w.equipped);
  const weaponMod = equippedWeapon ? equippedWeapon.mod : 0;

  return 10 + calculateModifier(keyAttrValue) + weaponMod;
}

function calculateExperience(birthday: Date): number {
  if (!birthday || isNaN(birthday.getTime())) return 0;

  const age = new Date().getFullYear() - birthday.getFullYear();
  if (age < 7) return 0;

  return Math.floor((age - 7) * Math.pow(22, 1.45));
}

export { calculateModifier, calculateAttack, calculateExperience };
