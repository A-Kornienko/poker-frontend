import { Bank } from "../types/poker";

export const banksChanged = (oldBanks: Bank, newBanks: Bank): boolean => {
  if (oldBanks.rake !== newBanks.rake) return true;
  const oldKeys = Object.keys(oldBanks.items);
  const newKeys = Object.keys(newBanks.items);
  if (oldKeys.length !== newKeys.length) return true;
  for (const k of oldKeys) {
    if (oldBanks.items[k]?.sum !== newBanks.items[k]?.sum) return true;
  }
  return false;
};
