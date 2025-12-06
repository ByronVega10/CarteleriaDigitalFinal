const contentRepo = require('../repositories/contentRepository');

async function getPlayerPlaylist(screenId) {
  const contentList = await contentRepo.findScheduledContent(screenId);
  return contentList.map(c => ({
    url: c.fileUrl,
    duration: c.durationSec,
    title: c.title
  }));
}

module.exports = { getPlayerPlaylist };