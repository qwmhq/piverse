export function ellipsizeAddress(
  address,
  charsAtStart = 6,
  charsAtEnd = 6,
  ellipsis = "...",
) {
  if (address.length <= charsAtStart * 2 + ellipsis.length) {
    return address;
  }

  const start = address.substring(0, charsAtStart);
  const end = address.substring(address.length - charsAtEnd);

  return `${start}${ellipsis}${end}`;
}
