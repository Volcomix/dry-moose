class JsonNormalizer {
  static normalize(object) {
    if (object instanceof Array) {
      return object.map(JsonNormalizer.normalize)
    }
    if (typeof object !== 'object') {
      return object
    }
    return Object.keys(object).reduce(
      (normalized, key) => {
        const normalizedKey = JsonNormalizer.normalizeKey(key)
        normalized[normalizedKey] = JsonNormalizer.normalize(object[key])
        return normalized
      }, {}
    )
  }

  static normalizeKey(key) {
    const normalized = key.replace(/ID$/, 'Id')
    return normalized[0].toLowerCase() + normalized.substring(1)
  }
}

module.exports = JsonNormalizer