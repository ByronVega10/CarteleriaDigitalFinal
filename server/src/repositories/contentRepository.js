const Content = require('../models/Contents');

async function findScheduledContent(screenId) {
  return await Content.find({
    assignedScreens: screenId,
    scheduled: { $lte: new Date() }
  });
}

async function createContent(data) {
  return await Content.create(data);
}

async function getAllContents() {
  return await Content.find();
}


// ELIMINAR CONTENIDO
async function deleteContent(id) {
  return await Content.findByIdAndDelete(id);
}

module.exports = { findScheduledContent, createContent, getAllContents, deleteContent };