const nipa1Models = jsonData.filter(item => item.gene === "NIPA1");

// Datos estructurados para visualización
const modelsForViz = nipa1Models.map(model => ({
  id: model.modelEntityId,
  score: parseFloat(model.globalMetricValue),
  sequence: model.sequence,
  organism: model.organismScientificName
}));
