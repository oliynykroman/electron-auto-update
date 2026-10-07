function normalizeVersion(version) {
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('Версія повинна мати формат MAJOR.MINOR.PATCH.');
  }

  return version.split('.').map(Number);
}

function compareVersions(left, right) {
  const leftParts = normalizeVersion(left);
  const rightParts = normalizeVersion(right);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] > rightParts[index]) return 1;
    if (leftParts[index] < rightParts[index]) return -1;
  }

  return 0;
}

function validateHttpUrl(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label}: вказано некоректну URL-адресу.`);
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) {
    throw new Error(`${label}: адреса повинна використовувати HTTP або HTTPS.`);
  }

  return parsed.toString();
}

module.exports = { compareVersions, normalizeVersion, validateHttpUrl };
