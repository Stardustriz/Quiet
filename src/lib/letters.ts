export const letters: string[] = [
  "I don't know what today was like for you. But I know you're still here, reading this, and that took something. I'm glad you're here. Tomorrow doesn't have to be figured out tonight. Just rest. Just stay.",

  "You are not a burden for feeling this way. The heaviness you carry is real, and so is the part of you that keeps going anyway. Someone sat down and wrote this because they wanted you to make it through the night. Please make it through the night.",

  "There was a time I thought the dark would last forever. It didn't. It lifted slowly, quietly, the way dawn does — so gradually I almost missed it. Yours can lift too. Until then, let this little page keep you company.",

  "You don't have to earn rest, or kindness, or another chance. You already deserve all three. Whatever happened today, it doesn't get the final word on who you are.",

  "If all you did today was survive it, that is enough. Some days that is the bravest thing a person does. I'm proud of you for that, even if we never meet.",

  "The world is softer with you in it, even on the days you can't feel it. Especially on the days you can't feel it. Please stay. Drink some water. Wrap up in something warm. This feeling is a weather pattern, not a climate.",

  "You found this page because someone who loves you wanted you to have a quiet place to land. That's not nothing. That's love, doing its quiet work. Let it hold you for a minute.",

  "It's okay if tonight you can't see the point. You don't have to see it. You just have to stay until the morning, and let the morning show you. Mornings are good at that.",

  "Whatever you're carrying, you were never meant to carry it alone. There are hands — some you know, some you haven't met yet — ready to help you hold it. Let them.",
];

export function randomLetter(except?: number): number {
  if (letters.length === 1) return 0;
  let i = Math.floor(Math.random() * letters.length);
  while (i === except) i = Math.floor(Math.random() * letters.length);
  return i;
}
