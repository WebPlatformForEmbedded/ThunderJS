export default (versionsConfig, plugin, params) => {
  const defaultVersion = 1

  let version
  if ((version = params && params.version)) {
    return version
  }
  return versionsConfig
    ? versionsConfig[plugin] || versionsConfig.default || defaultVersion
    : defaultVersion
}
