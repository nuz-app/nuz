function getImportantFieldsOnly({
  exportsOnly,
  createdAt,
  format,
  library,
  publisher,
  shared,
  externals,
}) {
  return {
    exportsOnly,
    createdAt,
    format,
    library,
    publisher,
    shared,
    externals,
  }
}

export default getImportantFieldsOnly
