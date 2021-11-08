// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function installComponents (component, components) {
  component.components = component.components || {}

  for (var i in components) {
    options.components[i] = options.components[i] || components[i]
  }
}