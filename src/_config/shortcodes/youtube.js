
export const youtubeShortcode = (id, label) => {
    return `<lite-youtube videoid="${id}" style="background-image: url('https://i.ytimg.com/vi/${id}/hqdefault.jpg');">
    <a href="https://youtube.com/watch?v=${id}" class="lty-playbtn" title="${label || 'Play Video'}">
      <span class="lyt-visually-hidden">${label || 'Play Video'}</span>
    </a>
  </lite-youtube>`;
};
